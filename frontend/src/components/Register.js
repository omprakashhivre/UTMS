import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import "./style.css"

const API_BASEPATH = "http://localhost:8080/api/v1"

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASEPATH}/register`, { username, email, password });
            console.log(response.data);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="form-group">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Register</button>
            </form>
            <div>
                <p>Already registered?  <span className='link' onClick={() => navigate("/")}>login here</span></p>
            </div>

        </div>
    );
};

export default Register