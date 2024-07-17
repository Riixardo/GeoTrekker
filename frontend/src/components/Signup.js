import React, { useState }from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './PageButton';
import axios from 'axios';

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [err, setErr] = useState("");

    const navigate = useNavigate();

    // code 1 = success, code 2 = account already exists
    const handleSignup= async (event) => {
        
        event.preventDefault();

        if (password !== rePassword) {
            setErr("Passwords Do Not Match")
            return;
        }

        try {
            const response = await axios.post("/api/signup", { username, email, password });
            if (response.data.code === 1) {
                console.log("Data made it LOLwdwd");
                navigate("/login");
                window.location.reload();
            }
            else {
                setErr("Account Already Exists")
                console.log("ddddd");
            }
        }
        catch (err) {
            setErr(err);
        }
    };

    return (
        <div className="flex flex-col items-center font-orbitron">
            <h1>Signup Page</h1>
            <form onSubmit={handleSignup}>
                <div className="flex flex-col items-center">
                    <input
                        type="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        className="w-64 mb-4 p-2 border rounded"
                    />
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
                        placeholder="Enter Password"
                        required
                        className="w-64 mb-4 p-2 border rounded"
                    />
                    <input
                        type="password"
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
                        placeholder="Re-Enter Password"
                        required
                        className="w-64 mb-4 p-2 border rounded"
                    />
                    <button type="submit" className="w-32 mb-8 border rounded bg-gray-200">Signup Account</button>
                </div>
            </form>
            <Button page={"/"} text={"Back"}></Button>
            {err && <p className="text-black">Error: {err}</p>}
        </div>
    );
};

export default Signup;