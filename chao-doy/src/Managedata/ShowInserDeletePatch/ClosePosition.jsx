import { useState } from "react";
import "./ClosePosition.css";

const CloseTradePosition = ({tradeID}) => {
    const [popup, setPopup] = useState(false);
    const [formData, setFormData] = useState({
        ClosePrice: "",
        ReasonClose: ""
    });
    const openPopup = () => setPopup(true);
    const closePopup = () => setPopup(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const url = `http://localhost:3333/authen/closeposition/${tradeID}`;
        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.msg)
            closePopup();
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <>
            <button className="btn-active" onClick={openPopup}>Active</button>
            {popup && 
                <div className="popup-overlay" onClick={closePopup}>
                    <div className="popup-closeContent" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={closePopup}>&times;</button>
                        <h2>ปิด Position</h2>
                        <form className="close-position-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="ClosePrice">Close Price</label>
                                <input 
                                    id="ClosePrice"
                                    type="number" 
                                    step="0.01" 
                                    name="ClosePrice"
                                    value={formData.ClosePrice}
                                    onChange={handleChange}
                                    placeholder="ราคาที่ปิด Position" 
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="ReasonClose">Reason Why Close Position</label>
                                <textarea 
                                    id="ReasonClose"
                                    name="ReasonClose"
                                    value={formData.ReasonClose}
                                    onChange={handleChange}
                                    placeholder="เหตุผลที่ปิด Position" 
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-btn">ปิด Position</button>
                        </form>
                    </div>
                </div>
            }
        </>
    );
};

export default CloseTradePosition;
