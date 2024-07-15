import "./Register.css";
import { useNavigate } from "react-router-dom";
import Footer from "../Managedata/tools/footer";

const UserRegister = () => {
    localStorage.removeItem("token")
    const navigate = useNavigate()
    const BackToLogin = () => {
        navigate("/login");
    }  
    const handleSubmit = async (event) => {
        event.preventDefault(); 
        const form = event.currentTarget;
        const formData = new FormData(form);   
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password'),
                fname: formData.get('firstName'),
                lname: formData.get('lastName')
            })
        };
        try {
            const response = await fetch('http://localhost:3333/register', requestOptions);
            if (!response.ok) {
                throw new Error('เกิดข้อผิดพลาดในการลงทะเบียน');
            }  
            const data = await response.json();
            if (data.status === "err") {
                alert(data.msg)
            } else {
                navigate("/login")
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการลงทะเบียน:', error);
        }
    }; 
    return (
        <div className="container" style={{marginTop:"35%"}}>
            <h2>ลงทะเบียนเป็นชาวดอย</h2>
            <form className="form-register" onSubmit={handleSubmit}>
                <label className="label-regis">Email</label>
                <input type="email" name="email" className="input-regis" placeholder="ป้อน Email ของคุณ" required />
                <label className="label-regis">Password</label>
                <input type="password" name="password" className="input-regis" placeholder="ป้อน Password ของคุณ" required />
                <label className="label-regis">First Name</label>
                <input type="text" name="firstName" className="input-regis" placeholder="ป้อนชื่อของคุณ" required />
                <label className="label-regis">Last Name</label>
                <input type="text" name="lastName" className="input-regis" placeholder="ป้อนนามสกุลของคุณ" required />
                <button type="submit" className="btn-regis">ลงทะเบียน</button>
                <button type="button" className="btn-regis" onClick={BackToLogin}>กลับหน้า Login</button>
            </form>
            <Footer/>
        </div>
    );
};

export default UserRegister;