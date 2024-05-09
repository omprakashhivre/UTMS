import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./style.css"

const API_BASEPATH = "http://localhost:8080/api/v1"


const Login = () => {
const navigate = useNavigate()
    const [inputError , setInputError] = useState({
        isError : false,
        message : ""
    })
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASEPATH}/login`, { email, password });
            console.log(response.status);
            console.log(response.data);
            if(response.status == 200){
                const responseData = response.data
                if(responseData.status === true){
                    localStorage.setItem("authKey" , responseData.token)
                    localStorage.setItem("refreshToken" , responseData.refreshToken)
                    navigate("/tasks")
                }
                else{
                    setInputError({
                        isError : true,
                        message : responseData.message
                    })
                }
            }
            setInputError({
                isError : true,
                message : response.message || "server error"
            })
        } catch (error) {
            setError(error.response.data.message);
            setInputError({
                isError : true,
                message : error.message || "server error"
            })
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group" >
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {/* <p className="error-message" style={{display : inputError.isError ? "block"  : "none"}}>{inputError.message}</p> */}

                <button type="submit">Login</button>
            </form>
            <div>
                <p>new User?  <span className='link' onClick={() => navigate("/register")}>Register here</span></p>

            </div>
        </div>
    );
};

export default Login;