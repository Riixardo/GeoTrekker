import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../PageButton';
import ImageButton from '../ImageButton';
import ProfileButton from '../ProfileButton';

const Play = () => {

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem('token')) {
            setLoggedIn(true);
        }
    }, []); 

    const navigate = useNavigate();

    const handleDirectionsClick = () => {
        navigate("/play/directions");
    }

    return (
        <div className="flex flex-col items-center font-orbitron">
            <div className="w-full mb-10">  
                <div className="inline-block w-1/3 float-left border-box float-left">
                    <Button page={"/"} text={"Back"}></Button>
                </div>
                <div className="inline-block w-1/3 float-left border-box text-center">
                    <h1 className="text-3xl font-orbitron font-bold">Play Page</h1>
                </div>
                <div className="inline-block w-1/3 float-left border-box text-right"> 
                    { !loggedIn && (<Button page={"/login"} text={"Login"}></Button>)}
                    { loggedIn && (
                    <div className="flex flex-col items-end">
                        <ProfileButton/>
                    </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] space-x-0 space-y-20">
                <h2 className="text-2xl font-orbitron font-bold">Game Modes</h2>
                <div className="flex items-center space-x-8">
                    <ImageButton img="/directions.jpg" alt="Play Directions" className="h-24 w-24 border-4 rounded hover:scale-110" onClick={handleDirectionsClick}></ImageButton>
                    <ImageButton img="/globe.png" alt="Play Classic" className="h-24 w-24 border-4 rounded hover:scale-110"></ImageButton>
                </div>
            </div>
        </div>
    );
};

export default Play;