import React, { useState, useEffect } from 'react';
import Button from '../PageButton';
import DirectionsResultRow from '../DirectionsResultRow';
import axios from 'axios';

const DirectionsGameEnd = () => {

    const [results, setResults] = useState(() => {return JSON.parse(sessionStorage.getItem("gameState")).results;})

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const loadMap = async () => {
        await sleep(1000);
        const map = new window.google.maps.Map(document.getElementById("map"), {
            zoom: 2,
            center: {lat:0, lng:0},
        });
        for (let i = 0; i < results.length; i++) {
            new window.google.maps.Marker({
                position: results[i].endingLocation,
                map: map,
                title: results[i].name
            });
        }
    }

    const clearGameStorage = () => {
        sessionStorage.removeItem("gameState");
        sessionStorage.removeItem("totalScore");
        sessionStorage.removeItem("gamePosted");
    }

    const postDirectionsGame = async () => {
        if (sessionStorage.getItem("gamePosted") == "true") {
            return;
        }
        const gameState = JSON.parse(sessionStorage.getItem("gameState"));
        const userData = JSON.parse(sessionStorage.getItem("userData"));
        const response = await axios.post("/api/post/directions-game", { user_id: userData.user_id, rounds: gameState.totalRounds, timer: gameState.roundTimer, startingDistance: gameState.startingDistance, map: gameState.map, score: sessionStorage.getItem("totalScore") });
        if (response.code !== 1) {
            console.log("Error");
        }
        sessionStorage.setItem("gamePosted", true);
    }

    useEffect(() => {
        if (results.length < JSON.parse(sessionStorage.getItem("gameState")).totalRounds) {
            return;
        }
        loadMap();
    }, [results])

    useEffect(() => {
        const gameState = JSON.parse(sessionStorage.getItem("gameState"));
        const tempResults = [...results];
        let totalScore = 0;
        const distance = parseInt(gameState.startingDistance, 10);
        let i = 0;
        for (i = 0; i < results.length; i++) {
            tempResults[i].score = 600 - (tempResults[i].roundTimer - tempResults[i].time) + distance;
            totalScore += tempResults[i].score;
        }
        while (i < gameState.totalRounds) {
            tempResults.push({unfinished: "RAN OUT OF TIME", name: gameState.locations[i].location_name, endingLocation: gameState.currLocation, score: 0});
            i++;
        }
        sessionStorage.setItem("totalScore", totalScore);
        postDirectionsGame();
        setResults(tempResults);
    }, []);



    return (
        <div className="h-screen w-full overflow-auto items-center">
            <h1 className="text-center font-orbitron text-3xl">Directions Game Results</h1>
            <Button page={"/games/directions"} text={"Back"} onClick={clearGameStorage}></Button>

            <div id="map" className="h-1/2 w-full items-center justify-center border rounded border-4">
                
            </div>
            {results.map((data, index) => (<DirectionsResultRow round={index + 1} name={data.name} time={data.unfinished || data.roundTimer - data.time} score={data.score}></DirectionsResultRow>))}
        </div>
    );
};

export default DirectionsGameEnd;