import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './PageButton';
import axios from 'axios';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    const navigate = useNavigate();

    // code 1 = success, code 2 = invalid password, code 3 = no account found
    const handleLogin = async (event) => {
        
        event.preventDefault();

        try {
            const response = await axios.post("/api/login", { email, password });
            if (response.data.code === 1) {
                console.log("Data made it LOLwdwd");
                sessionStorage.setItem('token', response.data.token);
                sessionStorage.setItem('userData', JSON.stringify(response.data.userData));
                navigate("/");
            }
            else if (response.data.code === 2) {
                setErr("Invalid Password");
                console.log("ddddd");
            }
            else {
                setErr("No Account Found");
                console.log("Ddadwadwadwd");
            }
            // only had this because I saw other websites reload after login
            // window.location.reload();
        }
        catch (err) {
            setErr(err);
        }
    };

    return (
        <div className="flex flex-col items-center font-orbitron">
            <h1>Login Page</h1>
            <form onSubmit={handleLogin}>
                <div className="flex flex-col items-center">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="w-64 mb-4 p-2 border rounded"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-64 mb-4 p-2 border rounded"
                    />
                    <button type="submit" className="w-32 mb-8 border rounded bg-gray-200">Login</button>
                </div>
            </form>
            <Button page="/signup" text="Signup" className="w-32 mb-8 border rounded bg-gray-200 text-center"></Button>
            <Button page={"/"} text={"Back"}></Button>
            {err && <p className="text-black">Error: {err}</p>}
        </div>
    );
};

export default Login;