import React, { useState, useEffect } from 'react';
import Button from '../PageButton';
import DirectionsResultRow from '../DirectionsResultRow';

const DirectionsGameEnd = () => {

    const [results, setResults] = useState(() => {return JSON.parse(sessionStorage.getItem("gameState")).results;})

    const loadMap = () => {
        const map = new window.google.maps.Map(document.getElementById("map"), {
            zoom: 2,
            center: {lat:0, lng:0}
        });
        for (let i = 0; i < results.length; i++) {
            const newMarker = new window.google.maps.Marker({
                position: results[i].endingLocation,
                map: map,
                title: results[i].name
            });
        }
    }

    useEffect(() => {
        loadMap();
        const tempResults = [...results];
        for (let i = 0; i < results.length; i++) {
            const distance = JSON.parse(sessionStorage.getItem("gameState")).startingDistance;
            tempResults[i].score = 600 - (tempResults[i].roundTimer - tempResults[i].time) + distance;
        }
        setResults(tempResults);
    }, []);



    return (
        <div className="h-screen w-full overflow-auto items-center">
            <h1 className="text-center font-orbitron text-3xl">Directions Game Results</h1>
            <Button page={"/games/directions"} text={"Back"}></Button>

            <div id="map" className="h-1/2 w-full items-center justify-center border rounded border-4">
                
            </div>
            {results.map((data, index) => (<DirectionsResultRow round={index + 1} name={data.name} time={data.roundTimer - data.time} score={data.score}></DirectionsResultRow>))}
        </div>
    );
};

export default DirectionsGameEnd;