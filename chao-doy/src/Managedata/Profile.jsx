import Navbar from "./tools/navbar";
import Footer from "./tools/footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const UserProfile = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [authen, setAuthen] = useState("");

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const url = "http://localhost:3333/authen/getsomedata";
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            });
            const result = await response.json();
            if (result.status === "ok") {
                setData(result.msg);
                setAuthen("authenticated");
            } else {
                setAuthen("notauthenticate");
                console.log(result.msg);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (authen === "authenticated") {
        return (
            <>
                <Navbar />
                <div className="container">
                    <h1>Hello, {data.fname}</h1>
                    <div className="data-item">
                        <div className="data-label">Total Profit:</div>
                        <div className="data-value">{data.TotalProfit}</div>
                    </div>
                    <div className="data-item">
                        <div className="data-label">จำนวนการเปิด Buy:</div>
                        <div className="data-value">{data.BuyCount}</div>
                    </div>
                    <div className="data-item">
                        <div className="data-label">จำนวนการเปิด Sell:</div>
                        <div className="data-value">{data.SellCount}</div>
                    </div>
                    <div className="data-item">
                        <div className="data-label">จำนวนการเปิด Position:</div>
                        <div className="data-value">{data.tradeNumber}</div>
                    </div>
                </div>
                <Footer className="footer" />
            </>
        );
    }

    if (authen === "notauthenticate") {
        navigate("/login");
        return null;
    }

    return null;
};

export default UserProfile;
