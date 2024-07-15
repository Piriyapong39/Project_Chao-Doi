const express = require("express")
const cors = require("cors")
require('dotenv').config()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const authenticateToken = require("./modules/authen.js")
const updateTotalProfit = require("./modules/UpdateTotalProfit.js")


//config .env
const port = process.env.port
const saltRounds = Number(process.env.saltRounds)
const JWT_SECRET = process.env.JWT_SECRET


//config app
const app = express()
app.use(cors())

//config mysql
const mysql = require("mysql2")
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'chao-doy',
});


// Register
app.post("/register", jsonParser, async function(req, res) {
    const email = req.body.email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const password = req.body.password
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
    const fname = req.body.fname
    const lname = req.body.lname
    const errors = [
        { condition: !email, message: "Email is required" },
        { condition: !password, message: "Password is required" },
        { condition: !fname, message: "Firstname is required" },
        { condition: !lname, message: "Lastname is required" },
        { condition: !emailRegex.test(email), message: "Email must be English" },
        { condition: !passwordRegex.test(password), message: "Password must be at least 6 characters long and contain both letters and numbers" }
    ]   
    for (const error of errors) {
        if (error.condition) {
            res.json({ status: "err", msg: error.message })
            return
        }
    }
    try {
        const [users] = await connection.promise().query('SELECT * FROM users WHERE email = ?', [email])
        if (users.length !== 0) {
            return res.json({status:"err", msg:"Email already used"})
        }
        const hash = await bcrypt.hash(password, saltRounds)
        await connection.promise().query(
            "INSERT INTO users (email, password, fname, lname) VALUES (?,?,?,?)",
            [email, hash, fname, lname]
        )
        res.json({status:"ok", msg:"User registered successfully", email:email})
    } catch (error) {
        res.json({status:"err", msg:"Internal server error"})
    }
})


//login
app.post("/login", jsonParser, async function(req, res) {
    const { email, password } = req.body;
    if (!email || !email.trim()) {
        return res.json({ status: "err", msg: "Email is required" });
    }
    if (!password || password.length < 6) {
        return res.json({ status: "err", msg: "Password is required and must be at least 6 characters long" })
    }
    try {
        const [users] = await connection.promise().query("SELECT * FROM users WHERE email=?", [email])
        
        if (users.length === 0) {
            return res.json({ status: "err", msg: "User not found" });
        }
        const status_login = await bcrypt.compare(password, users[0].password)     
        if (status_login) {
            const token = jwt.sign(
                { id: users[0].id, email: users[0].email },
                JWT_SECRET,
                { expiresIn: '2h' }
            );
            return res.json({ status: "ok", msg: "Login Successfully", token: token , User_ID : users[0].id, fname: users[0].fname})
        } else {
            return res.json({ status: "err", msg: "Wrong Password" })
        }
    } catch (err) {
        return res.json({ status: "err", msg: "An internal server error occurred" })
    }
});


// Authentication
app.post("/authen", jsonParser, authenticateToken, function(req, res){
    res.json({ status: "ok", msg: "You can access", user: req.user })
})


// Open position
app.post("/authen/openposition", jsonParser, authenticateToken, async function(req, res){
    const User_ID = req.user.id
    const StatusTrade = true
    const {StockName, EntryPrice, LotSize, ReasonTrade, Position} = req.body
    const errs = [
        {condition : !Position, msg: "Position is required"},
        {condition : !User_ID, msg:"User id is required"},
        {condition : !StatusTrade, msg:"Status trade is required"},
        {condition : !StockName, msg:"Stock Name is required"},
        {condition : !EntryPrice, msg:"Entry price is required"},
        {condition : !LotSize, msg:"Lot Size is required"}
    ]
    for (const err of errs) {
        if (err.condition) {
            return res.json({status:"err", msg:err.msg})
        }
    }
    try {
        const PositionUpper = Position.toUpperCase()
        const StockNameUpper = StockName.toUpperCase()
        const [result] = await connection.promise().query(
            "INSERT INTO tradedata (User_ID, Position, StockName, EntryPrice, LotSize, ReasonTrade, StatusTrade) VALUES (?,?,?,?,?,?,?)",
            [User_ID, PositionUpper, StockNameUpper, EntryPrice, LotSize, ReasonTrade, StatusTrade]
        )
        const newTradeId = result.insertId;
        res.json({status:"ok", msg:"Open Position Successfully", tradeId: newTradeId})
    } catch (error) {
        res.json({status:"err", msg:error.message})
    }
})


// Close position
app.post("/authen/closeposition/:id", jsonParser, authenticateToken, async function(req, res){
    const User_ID = req.user.id
    const tradeId = req.params.id
    const {ClosePrice, ReasonClose} = req.body
    if (!User_ID) {
        res.json({status:"err", msg:"User ID not found"})
    }    
    if (!tradeId) {
        return res.json({status:"err", msg:"Trade ID is required"})
    }
    if (!ClosePrice) {  
        return res.json({status:"err", msg:"Close Price is required"})
    }
    try {
        const [tradeData] = await connection.promise().query(
            "SELECT DateOpen, EntryPrice, LotSize FROM tradedata WHERE id = ? AND User_ID = ?",
            [tradeId, User_ID]
        )
        if (tradeData.length === 0) {
            return res.json({status:"err", msg:"Trade not found"})
        }
        const [value_buyOrsell] = await connection.promise().query(
            "SELECT Position FROM tradedata WHERE id=?",
            [tradeId])
        const position = value_buyOrsell[0].Position
        let value = 0
        if (position === "SELL") {
            value = -1
        } else if (position === "BUY") {
            value = 1
        } else {
            value = null
        }
        const { DateOpen, EntryPrice, LotSize } = tradeData[0];
        const DateClose = new Date()
        const openDate = new Date(DateOpen)
        const SpendTime = Math.round((DateClose - openDate) / (1000 * 60))
        const days = Math.floor(SpendTime / (60 * 24))
        const hours = Math.floor((SpendTime % (60 * 24)) / 60);
        const minutes = SpendTime % 60;       
        const formattedTime = `${days} วัน ${hours} ชั่วโมง ${minutes} นาที`             
        const Profit = (ClosePrice - EntryPrice) * LotSize * 100 * (value)
        const [result] = await connection.promise().query(
            `UPDATE tradedata 
             SET DateClose = ?,
                ClosePrice = ?,  
                ReasonClose = ?,
                StatusTrade = false,
                SpendTime = ?,
                Profit = ?
             WHERE id = ? AND User_ID = ?`,
            [DateClose, ClosePrice, ReasonClose, formattedTime, Profit, tradeId, User_ID]
        )
        if (result.affectedRows === 0) {
            return res.json({status:"err", msg:"Failed to update trade"})
        }
        const TotalProfit = await updateTotalProfit(User_ID);
        res.json({status:"ok", msg:"Position Closed Successfully", Profit, TotalProfit})
    } catch (error) {
        res.json({status:"err", msg:error.message})
    }
})

// Delete Position
app.delete("/authen/deleteposition/:id", jsonParser, authenticateToken, async function(req, res) {
    const User_ID = req.user.id;
    const tradeId = req.params.id;
    try {
        const [result] = await connection.promise().query(
            "DELETE FROM tradedata WHERE id = ? AND User_ID = ?",
            [tradeId, User_ID]
        );
        if (result.affectedRows === 0) {
            return res.json({status:"err", msg:"Trade not found or already deleted"})
        }
        const TotalProfit = await updateTotalProfit(User_ID);
        res.json({status:"ok", msg:"Position Deleted Successfully", TotalProfit})
    } catch (error) {
        res.json({status:"err", msg:error.message})
    }
});


// Get All Position
app.get("/authen/alldata", jsonParser, authenticateToken, async function(req, res){
    const User_ID = req.user.id
    try {
        const [AllData] = await connection.promise().query(
            "SELECT * FROM tradedata WHERE User_ID=?",
            [User_ID]
        )
        res.json({status:"ok",msg:AllData})
    } catch (error) {
        res.json({status:"err", msg: error})
    }
})

// Get data to Profile
app.get("/authen/getsomedata", jsonParser, authenticateToken, async function(req, res) {
    const User_ID = req.user.id;
    const fname = req.user.fname
    try {
        const [TotalProfit] = await connection.promise().query(
            "SELECT TotalProfit FROM tradedata WHERE User_ID=? AND StatusTrade=0",
            [User_ID]
        );

        const [BuyCount] = await connection.promise().query(
            "SELECT COUNT(*) AS count FROM tradedata WHERE User_ID=? AND Position='BUY'",
            [User_ID]
        );

        const [SellCount] = await connection.promise().query(
            "SELECT COUNT(*) AS count FROM tradedata WHERE User_ID=? AND Position='SELL'",
            [User_ID]
        )
        const [tradeNumber] = await connection.promise().query(
            "SELECT COUNT(*) AS count FROM tradedata WHERE User_ID=?",
            [User_ID]
        )
        res.json({
            status: "ok",
            msg: {
                TotalProfit: TotalProfit[0] ? TotalProfit[0].TotalProfit : 0,
                BuyCount: BuyCount[0] ? BuyCount[0].count : 0,
                SellCount: SellCount[0] ? SellCount[0].count : 0,
                tradeNumber:tradeNumber[0] ? tradeNumber[0].count:0,
                fname:fname
            }
        });
    } catch (error) {
        res.json({ status: "err", msg: error.message });
    }
});


// Run Server On
app.listen(port, ()=>{
    console.log(`Server in running on Port ${port}`)
})




