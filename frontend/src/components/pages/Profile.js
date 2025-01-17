import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../PageButton';
import axios from "axios";
import LoggedInContext from '../../contexts/LoggedInContext';

const Profile = () => {

    const { setLoggedIn } = useContext(LoggedInContext);

    const [username, setUsername] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const userData = JSON.parse(sessionStorage.getItem('userData'));
        setUsername(userData.user);
    }, [])

    const handleLogout = async () => {
        const response = await axios.post("/api/logout", { token: sessionStorage.getItem("token") });
        if (response.data.code === 1) {
            console.log("Successful logout");
        }
        else {
            console.log("Error logging out");
        }
        sessionStorage.clear();
        setLoggedIn(false);
        navigate("/");
    }

    return (
        <div className="flex flex-col items-center min-h-screen">
            <div className="w-full mb-10">  
                <div className="inline-block w-1/3 float-left border-box float-left">
                    <Button page={"/"} text={"Back"}></Button>
                </div>
                <div className="inline-block w-1/3 float-left border-box text-center">
                    <h1 className="text-3xl mb-10 font-orbitron font-bold" >Profile Page</h1>
                </div>
                <div className="inline-block w-1/3 float-left border-box text-right"> 
                </div>
            </div>
            {username && (<h2 className="mb-20">Welcome {username}</h2>)}
            <div className="flex flex-col items-center h-[calc(100vh-18rem)] w-screen justify-end">
                <button onClick={handleLogout} className="w-32 mb-8 border rounded bg-gray-200 text-center">Logout</button>
            </div>
        </div>
    );
}

export default Profile;