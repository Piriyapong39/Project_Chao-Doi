const mysql = require("mysql2");
const connection = mysql.createConnection({host: 'localhost',user: 'root',database: 'chao-doy'});

async function updateTotalProfit(User_ID) {
    try {     
        const [totalProfitResult] = await connection.promise().query(
            "SELECT SUM(Profit) AS TotalProfit FROM tradedata WHERE StatusTrade = false AND User_ID = ?",
            [User_ID]
        )
        const totalProfit = totalProfitResult[0].TotalProfit || 0;
        await connection.promise().query(
            "UPDATE tradedata SET TotalProfit = ? WHERE User_ID = ?",
            [totalProfit, User_ID]
        )
        return totalProfit

    } catch (error) {
        throw error
    }
}
module.exports = updateTotalProfit;
