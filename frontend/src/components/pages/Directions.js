import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../PageButton';
import ProfileButton from '../ProfileButton';
import axios from 'axios';

const Directions = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [startingDistance, setStartingDistance] = useState(200);
    const [timer, setTimer] = useState("3 minutes");
    const [map, setMap] = useState("Random")
    const [rawTimer, setRawTimer] = useState(80);
    const [rounds, setRounds] = useState(3);
    const [mapOptions, setMapOptions] = useState([]);

    const [err, setErr] = useState("");

    useEffect(() => {
        if (sessionStorage.getItem("token")) {
            setLoggedIn(true);
        }
        const fetchMaps = async () => {
            const response = await axios.get("/api/db/directions-maps");
            if (response.data.code === 1) {
                setMapOptions(response.data.maps);
            }
            else {
                setErr("Maps could not be fetched");
            }
        }
        fetchMaps();
    }, []); 

    const navigate = useNavigate();

    const startDirectionsGame = async () => {
        if (!loggedIn) {
            alert("You must be logged in to play");
            return;
        }
        const response = await axios.post("/api/create-game/directions", { map, rounds });
        if (response.data.code !== 1) {
            setErr("Error Creating Game");
            return;
        }
        console.log(response.data.locations);
        const seconds = rawTimer < 60 ? rawTimer : 60 + Math.floor((rawTimer - 60) / 10) * 60;
        sessionStorage.setItem("gameState", JSON.stringify({round: 0, totalRounds: rounds, started: false, locations: response.data.locations, roundTimer: seconds, currTimer: null, startingDistance, currTargetLocation: null, currLocation: null, finishedRound: false, failed: false, results: [], map}));
        navigate("/play/directions");
    };

    // 10-59 are seconds, then 60-69 represent 1 minute, 70-79 represent 2 minutes ...
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
                    <Button page={"/games"} text={"Back"}></Button>
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
            <p>In this gamemode, you are dropped into a randomized street nearby a goal location. Get to within 100 meters of the goal before the timer runs out!</p>
            <div className="flex flex-col w-full h-full items-center justify-end">
                <button className="text-2xl w-32 mb-40 border rounded bg-gray-200" onClick={startDirectionsGame}>Start</button>
                {err && (<p>{err}</p>)}
                <div className="flex mb-32 w-full h-1/4">
                    <div className="flex space-x-4 w-1/4 justify-center items-center">
                        <label for="distance" className="text-center">Starting Distance <br></br> In meters</label>
                        <input id="distance" type="range" min="200" max="1000" defaultValue="200" value={startingDistance} className="" onChange={(e) => {setStartingDistance(e.target.value)}}></input>
                        <input type="number" placeholder="200" min="200" max="1000" defaultValue="200" value={startingDistance} onChange={(e) => {setStartingDistance(e.target.value)}} className="border border-rounded border-2"></input>
                    </div>
                    <div className="flex space-x-4 w-1/4 justify-center items-center">
                        <label for="time" className="text-center">Timer</label>
                        <input id="time" type="range" min="10" max="150" defaultValue="80" value={rawTimer} className="" onChange={(e) => {handleTimerSlideConversion(e.target.value)}}></input>
                        <div className="border border-rounded border-2 overflow-hidden w-20 h-30">{timer}</div>
                    </div>
                    <div className="flex space-x-4 w-1/4 justify-center items-center">
                        <label for="map" className="text-center">Map Select</label>
                        <select id="map" className="border border-rounded border-2" onChange={(e) => {setMap(e.target.value)}}>
                            <option key="base" value={"Random"}>Random</option>
                            {mapOptions.map((option, index) => (
                                <option key={index} value={option.map_name}>
                                    {option.map_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex space-x-4 w-1/4 justify-center items-center">
                        <label for="time" className="text-center">Rounds</label>
                        <input id="time" type="range" min="1" max="10" defaultValue="3" value={rounds} className="" onChange={(e) => {setRounds(e.target.value)}}></input>
                        <div className="border border-rounded border-2 overflow-hidden w-8 h-30">{rounds}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Directions;