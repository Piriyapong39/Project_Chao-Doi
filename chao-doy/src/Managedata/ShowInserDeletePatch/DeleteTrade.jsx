import React from 'react';
import "./DeletTrade.css"

const DeleteTrade = async (tradeID) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3333/authen/deleteposition/${tradeID}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
    });
    const result = await response.json();
    console.log(result);
    if (result.status === "ok") {
        alert(result.msg);
        window.location.reload();
    } else {
        console.log(result.msg);
    }
};

const DeleteTradeButton = ({ Position, tradeID }) => {
    const handleDelete = async () => {
        if (window.confirm("แน่ใจที่จะลบใช่ไหม ?")) {
            await DeleteTrade(tradeID);
        }
    };

    const BuyOrSell = (position) => {
        if (position === "BUY") {
            return <h4 className="buy">BUY</h4>;
        } else {
            return <h4 className="sell">SELL</h4>;
        }
    };

    return (
        <button className="delete-button" onClick={handleDelete}>
            {BuyOrSell(Position)}
        </button>
    );
};

export default DeleteTradeButton;
