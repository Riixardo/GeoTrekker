import React, { useState, useEffect } from 'react';
import Button from '../PageButton';
import ClassicResultRow from '../ClassicResultRow';
import axios from 'axios';

const ClassicGameEnd = () => {

    const [results, setResults] = useState(() => {return JSON.parse(sessionStorage.getItem("gameState")).results;})

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const loadMap = async () => {
        await sleep(1000);
        const map = new window.google.maps.Map(document.getElementById("map"), {
            zoom: 2,
            center: {lat:0, lng:0}
        });
        console.log(results.length)
        for (let i = 0; i < results.length; i++) {
            new window.google.maps.Marker({
                position: results[i].guessLocation,
                map: map,
            });
            console.log("IM HERE")
            new window.google.maps.Marker({
                position: results[i].targetLocation,
                map: map,
            });
        }
    }

    const clearGameStorage = () => {
        sessionStorage.removeItem("gameState");
        sessionStorage.removeItem("totalScore");
        sessionStorage.removeItem("gamePosted");
    }

    const postClassicGame = async () => {
        if (sessionStorage.getItem("gamePosted") == "true") {
            return;
        }
        const gameState = JSON.parse(sessionStorage.getItem("gameState"));
        const userData = JSON.parse(sessionStorage.getItem("userData"));
        const response = await axios.post("/api/post/classic-game", { user_id: userData.user_id, rounds: gameState.totalRounds, timer: gameState.roundTimer, map: gameState.map, score: sessionStorage.getItem("totalScore") });
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
        let i = 0;
        for (i = 0; i < results.length; i++) {
            tempResults[i].score = Math.max(5000 - (tempResults[i].roundTimer - tempResults[i].time) - tempResults[i].distance, 0);
            totalScore += tempResults[i].score;
        }
        while (i < gameState.totalRounds) {
            tempResults.push({time: 0, roundTimer: gameState.roundTimer, targetLocation: gameState.locations[i], distance: "NO GUESS", score: 0});
            i++;
        }
        sessionStorage.setItem("totalScore", totalScore);
        postClassicGame();
        setResults(tempResults);
    }, []);

    return (
        <div className="h-screen w-full overflow-auto items-center">
            <h1 className="text-center font-orbitron text-3xl">Classic Game Results</h1>
            <Button page={"/games/classic"} text={"Back"} onClick={clearGameStorage}></Button>

            <div id="map" className="h-1/2 w-full items-center justify-center border rounded border-4">
            </div>
            {results.map((data, index) => (<ClassicResultRow round={index + 1} time={data.roundTimer - data.time} distance={data.distance} score={data.score}></ClassicResultRow>))}
        </div>
    );
};

export default ClassicGameEnd;