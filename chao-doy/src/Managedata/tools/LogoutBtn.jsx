import { useNavigate } from "react-router-dom";
import "./Logoutbtn.css";

const LogOutBtn = () => {
    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };
    return (
        <button className="logout-btn" onClick={handleLogOut}>Log Out</button>
    );
};

export default LogOutBtn;
