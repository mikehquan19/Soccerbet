import React from "react"
import { freeClient, ACCESS_TOKEN, REFRESH_TOKEN } from "../../../provider/api"
import { useNavigate, Link } from "react-router-dom"
import './LoginPage.css'

const LoginPage = ({ usedFor = "login" }) => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = React.useState({ username: "", password: "" });
  const [registerData, setRegisterData] = React.useState({
    first_name: "", last_name: "",
    email: "",
    username: "", password: ""
  })

  // handle the login part of both forms 
  const handleLogin = (loginData) => {
    freeClient.post(`/login`, loginData)
      .then((response) => {
        console.log("Login successfully");
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        navigate("/")
      })
      .catch((error) => console.log(error));
  }

  // handle the button submitting 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (usedFor == "login") {
      handleLogin(loginData); // login with the data from the login form 
    } else {
      freeClient.post(`/register`, registerData)
        .then((response) => {
          console.log(response.data);
          // login with obtained username and password
          handleLogin({ username: registerData.username, password: registerData.password })
        })
        .catch((error) => console.log(error))
    }
  }

  if (usedFor === "login") {
    return (
      <form className="login-form">
        <h3>LOGIN</h3>
        <input type="text" placeholder='Username' onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} /><br />
        <input type="password" placeholder='Password' onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} /><br />
        <button type="submit" onClick={(e) => { handleSubmit(e) }}>Login</button>
        <p style={{ fontSize: "1.2rem", marginTop: "0.5rem auto" }}>Don't have an account? <Link to="/register" style={{ color: "skyblue" }}>Register</Link></p>
      </form>
    );
  } else {
    return (
      <form className="login-form register">
        <h3>REGISTER</h3>
        <div>
          <input type="text" placeholder='First name' onChange={(e) => setRegisterData({ ...registerData, first_name: e.target.value })} />
          <input type="text" placeholder='Last name' onChange={(e) => setRegisterData({ ...registerData, last_name: e.target.value })} />
        </div>
        <div>
          <input type="email" placeholder='Email' onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} />
          <input type="text" placeholder='Username' onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })} />
        </div>
        <div>
          <input type="text" placeholder='Password' onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} />
          <input type="text" placeholder='Password again' onChange={(e) => setRegisterData({ ...registerData, password2: e.target.value })} />
        </div>
        <input type="number" placeholder='Balance ($)' onChange={(e) => setRegisterData({ ...registerData, balance: e.target.value })} /><br />
        <button type="submit" onClick={(e) => { handleSubmit(e) }}>Register</button>
        <p style={{ fontSize: "1.2rem", margin: "0.5rem auto" }}>Already have an account? <Link to="/login" style={{ color: "skyblue" }}>Login</Link></p>
      </form>
    )
  }
}

export default LoginPage;