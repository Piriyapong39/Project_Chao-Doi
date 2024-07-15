import React, { useState} from "react";
import "./OpenPosition.css"

const OpenPosition = ({ authStatus}) => {
    const [popupStatus, setPopupStatus] = useState(false);
    const [formData, setFormData] = useState({
        Position: "",
        StockName: "",
        EntryPrice: "",
        LotSize: "",
        ReasonTrade: ""
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const insertDataTrade = async (e) => {
        e.preventDefault();
        if (authStatus === "authenticated") {
            try {
                const dataToSend = {
                    ...formData,
                    EntryPrice: parseFloat(formData.EntryPrice),
                    LotSize: parseFloat(formData.LotSize),
                    Position: formData.Position.toLowerCase()
                };
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:3333/authen/openposition", {      
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify(dataToSend)
                });
                const result = await response.json();
                if (result.status === "ok") {
                    alert(result.msg)
                    window.location.reload()
                } else {
                    alert(result.msg)
                }
                closePopup();
            } catch (error) {
                console.log(error);
            }
        }
    };
    const closePopup = () => setPopupStatus(false);
    const openPopup = () => setPopupStatus(true);
    return (
        <div>
            <button onClick={openPopup} className="btn-opentrade">เปิด Position</button>
            {popupStatus && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close" onClick={closePopup}>&times;</span>
                        <p style={{textAlign:"center",fontWeight:"bold"}}>เปิด Position</p>
                        <form className="form-insert-data" onSubmit={insertDataTrade}>
                            <label>Position</label>
                            <select id="Position" name="Position" value={formData.Position} onChange={handleInputChange} required>
                                <option value="" disabled>Select an option</option>
                                <option value="BUY">BUY</option>
                                <option value="SELL">SELL</option>
                            </select>
                            <label>Stock Name</label>
                            <input type="text" name="StockName" value={formData.StockName} onChange={handleInputChange} placeholder="Stock Name" required></input>
                            <label>Entry Price</label>
                            <input type="number" step="0.01" name="EntryPrice" value={formData.EntryPrice} onChange={handleInputChange} placeholder="Entry Price" required></input>
                            <label>Lot Size</label>
                            <input type="number" step="0.01" name="LotSize" value={formData.LotSize} onChange={handleInputChange} placeholder="Lot Size" required></input>
                            <label>Reason Trade</label>
                            <input type="text" name="ReasonTrade" value={formData.ReasonTrade} onChange={handleInputChange} placeholder="Reason" required></input>
                            <button type="submit">บันทึก Position</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OpenPosition;