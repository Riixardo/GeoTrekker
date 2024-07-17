import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './PageButton';

const Profile = () => {

    const [username, setUsername] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const userData = JSON.parse(sessionStorage.getItem('userData'));
        setUsername(userData.user);
    }, [])

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/");
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-3xl mb-10" >Profile Page</h1>
            {username && (<h2 className="mb-20">Welcome {username}</h2>)}
            <button onClick={handleLogout} className="w-32 mb-8 border rounded bg-gray-200 text-center">Logout</button>
            <Button page={"/"} text={"Back"}></Button>
        </div>
    );
}

export default Profile;