import React, { useState, useEffect } from 'react';
import Button from '../PageButton';
import ProfileButton from '../ProfileButton';

const Directions = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [startingDistance, setStartingDistance] = useState(100);
    const [timer, setTimer] = useState("3 minutes");
    const [rawTimer, setRawTimer] = useState(80);

    useEffect(() => {
        if (sessionStorage.getItem('token')) {
            setLoggedIn(true);
        }
    }, []); 

    const handleTimerSlideConversion = (number) => {
        setRawTimer(number);
        if (number < 60) {
            setTimer("" + number + " seconds");
        }
        else {
            setTimer("" + Math.floor((number - 50) / 10) + " minutes");
        }
    }

    return (
        <div className="flex flex-col items-center font-orbitron w-full h-screen">
            <div className="w-full mb-10">  
                <div className="inline-block w-1/3 float-left border-box float-left">
                    <Button page={"/play"} text={"Back"}></Button>
                </div>
                <div className="inline-block w-1/3 float-left border-box text-center">
                    <h1 className="text-3xl font-orbitron font-bold">Directions Game Mode</h1>
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
            <p>In this gamemode, you are dropped into a randomized street nearby a goal location. Get to the goal location within the specified time to win!</p>
            <div className="flex flex-col w-full h-full items-center justify-end">
                <button className="text-2xl w-32 mb-40 border rounded bg-gray-200">Start</button>
                <div className="flex mb-32 space-x-32">
                    <div className="flex space-x-4">
                        <label for="distance" className="text-center">Starting Distance <br></br> In meters</label>
                        <input id="distance" type="range" min="50" max="1000" defaultValue="50" value={startingDistance} className="" onChange={(e) => {setStartingDistance(e.target.value)}}></input>
                        <input type="number" placeholder="100" min="50" max="1000" defaultValue="100" value={startingDistance} onChange={(e) => {setStartingDistance(e.target.value)}} className="border border-rounded border-2"></input>
                    </div>
                    <div className="flex space-x-4 w-80">
                        <label for="time" className="text-center">Timer</label>
                        <input id="time" type="range" min="10" max="150" defaultValue="80" value={rawTimer} className="" onChange={(e) => {handleTimerSlideConversion(e.target.value)}}></input>
                        <div>{timer}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Directions;