import React from 'react';
import Button from './Button';

const Profile = () => {
    return (
        <div>
        <h1 className="items-center justify-center">Profile</h1>
        <Button page={"/"} text={"Back"}></Button>
        </div>
    );
}

export default Profile;