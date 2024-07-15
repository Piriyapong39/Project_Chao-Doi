import React, { useState, useEffect } from "react";
import "./GetAllData.css";
import ShowProfit from "./ShowInserDeletePatch/ShowProfit";
import OpenPosition from "../Managedata/ShowInserDeletePatch/OpenPosition";
import CloseTradePosition from "./ShowInserDeletePatch/ClosePosition";
import DeleteTrade from "./ShowInserDeletePatch/DeleteTrade";


const GetAllData = ({ authStatus, user }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visibleClosedTrades, setVisibleClosedTrades] = useState(5);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:3333/authen/alldata", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    }
                });
                const result = await response.json();
                if (response.ok) {
                    setData(result);
                } else {
                    console.error("Error fetching data:", result.msg);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (authStatus === "authenticated") {
            fetchData();
        }
    }, [authStatus]);

    if (loading) {
        return <div>Loading data...</div>;
    }

    if (authStatus === "unauthenticated" || authStatus === "error") {
        return <div>Not authenticated. Redirecting to login...</div>;
    }

    if (authStatus === "authenticated" && data) {
        const StatusTrade = (statusTrade, trade) => {
            if (statusTrade === 0) {
                return <span className="status-closed">Closed</span>;
            } else {
                return <CloseTradePosition tradeID={trade.ID} />;
            }
        };

        const StatusBuyOrSell = (Position, trade) => {
            if (Position === "BUY") {
                return <span>{<DeleteTrade Position={Position} tradeID={trade.ID}/>}</span>;
            } else {
                return <span>{<DeleteTrade Position={Position} tradeID={trade.ID}/>}</span>;
            }
        };

        const sortedData = [...data.msg].sort((a, b) => new Date(b.DateOpen) - new Date(a.DateOpen));
        const activeTrades = sortedData.filter(trade => trade.StatusTrade === 1);
        const closedTrades = sortedData.filter(trade => trade.StatusTrade === 0);
        
        const ShowReason = (reason) => {
            alert(reason);
        };

        const renderTable = (trades, title, isClosedTrades = false) => (
            <>
                <h3>{title}</h3>
                <table className="trade-table">
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>หุ้น</th>
                            <th>เปิด</th>
                            <th>ปิด</th>
                            <th>ระยะเวลา</th>
                            <th>ราคาเข้าซื้อ</th>
                            <th>Lot Size</th>
                            <th>TP</th>
                            <th>กำไร</th>
                            <th>เหตุผลเข้าซื้อ</th>
                            <th>เหตุผลการปิด</th>
                            <th>สถานะ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(isClosedTrades ? trades.slice(0, visibleClosedTrades) : trades).map((trade) => (
                            <tr key={trade.ID}>
                                <td>{StatusBuyOrSell(trade.Position, trade)}</td>
                                <td>{trade.StockName}</td>
                                <td>{new Date(trade.DateOpen).toLocaleDateString()}</td>
                                <td>{trade.DateClose ? new Date(trade.DateClose).toLocaleDateString() : 'N/A'}</td>
                                <td>{trade.SpendTime}</td>
                                <td>{trade.EntryPrice}</td>
                                <td>{trade.LotSize}</td>
                                <td>{trade.ClosePrice}</td>
                                <td>{trade.Profit}</td>
                                <td><button className="btn-reason" onClick={() => ShowReason(trade.ReasonTrade)}>แสดงเหตุผล</button></td>
                                <td><button className="btn-reason" onClick={() => ShowReason(trade.ReasonClose)}>แสดงเหตุผล</button></td>
                                <td>{StatusTrade(trade.StatusTrade, trade)}</td>     
                            </tr>
                        ))}
                    </tbody>
                </table>
                {isClosedTrades && visibleClosedTrades < trades.length && (
                    <button onClick={() => setVisibleClosedTrades(prev => prev + 5)} className="load-more-btn">
                        ดูเพิ่มเติม
                    </button>
                )}
            </>
        );

        return (
        <>
            <div className="data-container">
                <h2 className="saparate-data">ข้อมูลผู้ใช้</h2>
                <div className="user-dashboard">
                    <div className="user-profile">
                        <div className="avatar">{user.fname[0]}</div>
                        <div className="user-info">
                            <h2>{user.fname}</h2>
                            <p>{user.email}</p>
                        </div>
                    </div>
                    <div className="profit-display">
                        <h3>Your Profit</h3>
                        <ShowProfit authStatus={authStatus} user={user} sortedData={sortedData} />
                    </div>
                </div>
                <h2 className="saparate-data">ข้อมูลการซื้อขาย</h2>
                <OpenPosition authStatus={authStatus} user={user} />
                {renderTable(activeTrades, "รายการที่กำลังเทรด")}
                <hr style={{ marginTop: "50px" }}></hr>
                {renderTable(closedTrades, "รายการที่ปิดการซื้อขายแล้ว", true)}
            </div>
        </>
        );
    }

    return null;
};

export default GetAllData;