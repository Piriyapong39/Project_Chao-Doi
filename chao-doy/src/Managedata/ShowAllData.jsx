import { useState, useEffect } from "react"
import React from "react"
import './ShowAllData.css'
import Navbar from "./tools/navbar"
import Footer from "./tools/footer"

const ShowAllData = () => {
    const [data, setData] = useState([])

    const fetData = async () => {
        try {
            const token = localStorage.getItem("token")
            const url = "http://localhost:3333/authen/alldata"
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            })
            const result = await response.json()
            if (result.status === "ok") {
                setData(result.msg)
            } else {
                console.log(result.msg)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const statusTrade = (status) => {
        if (status === 0) {
            return <div style={{color:"red", fontWeight:"bold"}}>Closed</div>
        }
    }

    useEffect(() => {
        fetData()
    }, [])

    const sortedData = data
        .filter(item => item.StatusTrade !== 1)
        .sort((a, b) => new Date(b.DateOpen) - new Date(a.DateOpen))

    return (
    <>
        <Navbar/>
        <div className="table-container">
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>StockName</th>
                        <th>DateOpen</th>
                        <th>DateClose</th>
                        <th>SpendTime</th>
                        <th>EntryPrice</th>
                        <th>LotSize</th>
                        <th>ClosePrice</th>
                        <th>Profit</th>
                        <th>ReasonTrade</th>
                        <th>ReasonClose</th>
                        <th>StatusTrade</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((item, e) => (
                        <tr key={item.ID}>
                            <td>{e+1}</td>
                            <td>{item.StockName}</td>
                            <td>{item.DateOpen}</td>
                            <td>{item.DateClose}</td>
                            <td>{item.SpendTime}</td>
                            <td>{item.EntryPrice}</td>
                            <td>{item.LotSize}</td>
                            <td>{item.ClosePrice}</td>
                            <td>{item.Profit}</td>
                            <td>{item.ReasonTrade}</td>
                            <td>{item.ReasonClose}</td>
                            <td>{statusTrade(item.StatusTrade)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <Footer/>
    </>
    )
}

export default ShowAllData
