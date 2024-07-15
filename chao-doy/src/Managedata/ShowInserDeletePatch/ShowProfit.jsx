import { useState, useEffect } from "react";

const ShowProfit = ({ authStatus, sortedData }) => {
    const [Total_Profit, setTotalProfit] = useState(0);


    useEffect(() => {
        if (authStatus === "authenticated") {
            const status_false = sortedData.filter(index => index.StatusTrade === 0);
            if (status_false.length > 0) {
                setTotalProfit(status_false[0].TotalProfit);
            } else {
                setTotalProfit(0); 
            }
        } else {
            alert("Cannot find data");
        }
    }, [authStatus, sortedData]);
    return <div style={{color:"#16404b", fontSize:"50px", textAlign:"center", fontWeight:"bold"}}>$ {Total_Profit}</div>; 
};
export default ShowProfit;
