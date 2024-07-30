const jwt = require("jsonwebtoken");
const SECRET_JWT = process.env.JWT_SECRET;
const mysql = require("mysql2");
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'chao-doy',
});

function authenticateToken(req, res, next) {
    const token = req.headers.authorization
    if (!token) {
        return res.json({ status: "err", msg: "Authorization header missing" })
    }
    const tokenParts = token.split(" ")
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.json({ status: "err", msg: "Invalid token format" })
    }  
    const tokenValue = tokenParts[1]
    try {
        const decoded = jwt.verify(tokenValue, SECRET_JWT)
        if (!decoded.id) {
            return res.json({ status: "err", msg: "Invalid token: user_id missing" })
        }
        req.user = decoded
        connection.promise().query("SELECT fname FROM users WHERE id = ?", [req.user.id])
            .then(([rows]) => {
                if (rows.length === 0) {
                    return res.json({ status: "err", msg: "User not found" })
                }
                req.user.fname = rows[0].fname
                next();
            })
            .catch(error => {
                res.json({ status: "err", message: error });
            });
    } catch (error) {
        res.json({ status: "err", message: "Invalid or expired token" })
    }
}

module.exports = authenticateToken;
