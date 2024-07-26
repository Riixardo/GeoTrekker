import React, { useState, useEffect } from 'react';
import Button from '../PageButton';
import ClassicResultRow from '../ClassicResultRow';

const ClassicGameEnd = () => {

    const [results, setResults] = useState(() => {return JSON.parse(sessionStorage.getItem("gameState")).results;})

    const loadMap = () => {
        const map = new window.google.maps.Map(document.getElementById("map"), {
            zoom: 2,
            center: {lat:0, lng:0}
        });
        for (let i = 0; i < results.length; i++) {
            new window.google.maps.Marker({
                position: results[i].guessLocation,
                map: map,
            });
            new window.google.maps.Marker({
                position: results[i].targetLocation,
                map: map,
            });
        }
    }

    useEffect(() => {
        loadMap();
        const tempResults = [...results];
        for (let i = 0; i < results.length; i++) {
            tempResults[i].score = Math.max(5000 - (tempResults[i].roundTimer - tempResults[i].time) - tempResults[i].distance, 0);
        }
        setResults(tempResults);
        
    }, []);



    return (
        <div className="h-screen w-full overflow-auto items-center">
            <h1 className="text-center font-orbitron text-3xl">Classic Game Results</h1>
            <Button page={"/games/classic"} text={"Back"}></Button>

            <div id="map" className="h-1/2 w-full items-center justify-center border rounded border-4">
            </div>
            {results.map((data, index) => (<ClassicResultRow round={index + 1} time={data.roundTimer - data.time} distance={data.distance} score={data.score}></ClassicResultRow>))}
        </div>
    );
};

export default ClassicGameEnd;