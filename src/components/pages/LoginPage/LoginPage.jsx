import React from "react"
import { freeClient, ACCESS_TOKEN, REFRESH_TOKEN } from "@provider/api"
import { useNavigate, Link } from "react-router-dom"

function LoginPage ({ usedFor = "login" }) {
  const navigate = useNavigate();
  const [loginData, setLoginData] = React.useState({ 
    username: "", 
    password: "" 
  });
  const [registerData, setRegisterData] = React.useState({
    first_name: "", 
    last_name: "",
    email: "",
    username: "", 
    password: ""
  });

  // Handle the login part of both forms 
  function handleLogin(loginData) {
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
  function handleSubmit(e) {
    e.preventDefault();
    if (usedFor == "login") {
      handleLogin(loginData); // login with the data from the login form 
    } else {
      freeClient.post(`/register`, registerData)
        .then((response) => {
          console.log(response.data);
          // login with obtained username and password
          handleLogin({ 
            username: registerData.username, 
            password: registerData.password 
          });
        })
        .catch((error) => console.log(error))
    }
  }

  const formStyle = "bg-[darkslategrey] rounded-xl text-white text-center text-lg w-1/3 mt-50 mx-auto p-3 shadow-xl"
  const inputStyle = "w-4/5 bg-[darkslategrey] text-lg px-4 py-2 my-2 mx-auto border-1 rounded-xl text-white"
  const registerStyle = "bg-[darkslategrey] text-lg px-4 py-2 my-2 mx-auto border-1 rounded-xl text-white"

  if (usedFor === "login") {
    return (
      <form className={formStyle}>
        <h3 className="my-2 mx-auto text-2xl font-semibold">LOGIN</h3>
        <input 
          className={inputStyle}
          type="text" 
          placeholder='Username' 
          onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} 
        />
        <br />
        <input 
          className={inputStyle}
          type="password" 
          placeholder='Password' 
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} 
        />
        <br />
        <button 
          className="bg-white text-black py-1 px-2 rounded-lg mt-2 shadow-lg"
          type="submit" 
          onClick={(e) => { handleSubmit(e) }}
        >Login</button>
        <p className="text-lg mt-2 mx-auto">
          <span>Don't have an account?  </span>
          <Link to="/register" style={{ color: "skyblue" }}>
            Register
          </Link>
        </p>
      </form>
    );
  } else {
    return (
      <form className={formStyle}>
        <h3 className="my-2 mx-auto text-2xl font-semibold">REGISTER</h3>
        <div className="w-4/5 m-auto grid grid-cols-[1fr_1fr]">
          <input 
            className={registerStyle}
            type="text" 
            placeholder='First name' 
            onChange={(e) => setRegisterData({ ...registerData, first_name: e.target.value })} 
          />
          <input 
            className={registerStyle}
            type="text" 
            placeholder='Last name' 
            onChange={(e) => setRegisterData({ ...registerData, last_name: e.target.value })} 
          />
        </div>
        <div className="w-4/5 m-auto grid grid-cols-[1fr_1fr]">
          <input 
            className={registerStyle}
            type="email" 
            placeholder='Email' 
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} 
          />
          <input 
            className={registerStyle}
            type="text" 
            placeholder='Username' 
            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })} 
          />
        </div>
        <div className="w-4/5 m-auto grid grid-cols-[1fr_1fr]">
          <input 
            className={registerStyle}
            type="text" 
            placeholder='Password' 
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
          />
          <input 
            className={registerStyle}
            type="text" 
            placeholder='Password again' 
            onChange={(e) => setRegisterData({ ...registerData, password2: e.target.value })} 
          />
        </div >
        <input 
          className={inputStyle}
          type="number" 
          placeholder='Balance ($)' 
          onChange={(e) => setRegisterData({ ...registerData, balance: e.target.value })} 
        />
        <br />
        <button 
          className="bg-white text-black py-1 px-2 rounded-lg mt-2 shadow-lg"
          type="submit" 
          onClick={(e) => { handleSubmit(e) }}
        >
          Register
        </button>
        <p className="text-lg mt-2 mx-auto">
          <span>Already have an account? </span>
          <Link to="/login" style={{ color: "skyblue" }}>
            Login
          </Link>
        </p>
      </form>
    )
  }
}

export default LoginPage;