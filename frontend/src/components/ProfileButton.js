import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileButton = () => {

    const navigate = useNavigate();

    const switchToProfile = () => {
        navigate("/profile");
    }

    return (
        <img src="/pfp.png" alt="Profile" className="h-24 w-24" onClick={switchToProfile}/>
    );
};

export default ProfileButton;