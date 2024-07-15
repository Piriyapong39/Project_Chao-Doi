
import "./Login.css"
import { useNavigate } from 'react-router-dom'; 
import Footer from "../Managedata/tools/footer";

function UserLogin() {
  localStorage.removeItem("token")
  const navigate = useNavigate(); 
  const GoRegis = () => {
    navigate("/register"); 
  }
  const LoginSubmit = async (event) => {
      event.preventDefault()
      const form = event.currentTarget
      const formData = new FormData(form)
      const requestOptions = {
        method : "POST",
        headers : { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email : formData.get("email"),
          password : formData.get("password")
        })
      }
    try {
        const response = await fetch("http://localhost:3333/login", requestOptions)
        if (!response.ok) {
          throw new Error("เกิดข้อผิดพลาดในการ Login")
        }
        const data = await response.json()
        if (data.status === "err") {
          alert(data.msg)
        } else {
          localStorage.setItem("token", data.token); 
          alert("login Success")
          navigate("/homepage"); 
        }
    } catch (error) { 
      console.error("Login error:", error);
      alert("เกิดข้อผิดพลาดในการ Login");
    }
  }
  return (
    <div className="container" style={{marginTop:"50%"}}>
      <h1 className="greet-user">ชาวดอย</h1>
      <form className="box-form" onSubmit={LoginSubmit}>
        <label className="lable-logre">Email</label>
        <input name="email" type="email" placeholder="ป้อน Email ของคุณ" required />
        <label className="lable-logre">Password</label>
        <input name="password" type="password" placeholder="ป้อน Password ของคุณ" required />
        <button type="submit" className="btn-log">Login</button>
        <button type="button" className="btn-log" onClick={GoRegis}>Register</button>
      </form>
      <Footer/>
    </div>
  );
}

export default UserLogin;