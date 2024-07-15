import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Footer from "../Managedata/tools/footer";
import GetAllData from "../Managedata/GetAllData";
import Navbar from "../Managedata/tools/navbar";


const HomepageUser = () => {
    const [authStatus, setAuthStatus] = useState("loading");
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setAuthStatus("unauthenticated");
                    return;
                }
                const response = await fetch("http://localhost:3333/authen", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    }
                });
                const data = await response.json();
                if (data.status === "ok") {
                    setAuthStatus("authenticated");
                    setUser(data.user);
                } else {
                    setAuthStatus("unauthenticated");
                    localStorage.removeItem("token");
                    navigate("/login"); 
                }
            } catch (error) {
                console.error("Authentication error:", error);
                setAuthStatus("error");
                localStorage.removeItem("token");
                navigate("/login"); 
            }
        };
        fetchData();
    }, [navigate]);

    if (authStatus === "loading") {
        return (
            <div>
                <div>กำลังโหลด...</div>
                <Footer/>
            </div>
        );
    }

    if (authStatus === "authenticated" && user) {
        return (
        <>
            <Navbar/>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "80px"}}>
                <GetAllData authStatus={authStatus} user={user}/> 
                <Footer/>
            </div>
        </>
        );
    }

    return (
        <div>
            <div>กรุณาเข้าสู่ระบบ <button onClick={() => navigate("/login")}>เข้าสู่ระบบ</button></div>
            <Footer/>
        </div>
    );
};

export default HomepageUser;
