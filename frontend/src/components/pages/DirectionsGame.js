import React, { useEffect, useState, useRef } from 'react';
import Popup from '../Popup';

const DirectionsGame = () => {

    const [timer, setTimer] = useState(() => {
        return JSON.parse(sessionStorage.getItem("gameState")).roundTimer;
    });
    const [round, setRound] = useState(1);
    const [err, setErr] = useState("");

    const intervalRef = useRef(null); 

    const [openPopup, setOpenPopup] = useState(false);

    const startCountdown = () => {
        intervalRef.current = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer === 0) {
                    clearInterval(intervalRef.current);
                    return prevTimer;
                }
                console.log(prevTimer);
                const gameState = JSON.parse(sessionStorage.getItem("gameState"));
                gameState.currTimer = prevTimer - 1;
                sessionStorage.setItem("gameState", JSON.stringify(gameState));
                return prevTimer - 1;
            });
        }, 1000)
    }

    const reRenderRoundOnRefresh = () => {
        const gameState = JSON.parse(sessionStorage.getItem("gameState"));
        if (!gameState.finishedRound) {
            startCountdown();
        }
        setRound(gameState.round);
        const panorama = new window.google.maps.StreetViewPanorama(
            document.getElementById('map'), { position: gameState.currLocation, pov: { heading: 270, pitch: 0 } });
        
        panorama.setVisible(true);
        if (gameState.finishedRound) {
            return;
        }
        panorama.addListener('position_changed', () => {
            const currentPosition = panorama.getPosition();
            const gameStateAlter = JSON.parse(sessionStorage.getItem("gameState"));
            gameStateAlter.currLocation = currentPosition;
            const distance = window.google.maps.geometry.spherical.computeDistanceBetween(currentPosition, gameStateAlter.currTargetLocation);
            
            // If within 15 meters of the target location, alert the user
            if (distance < 100) {
                setOpenPopup(true);
                gameStateAlter.finishedRound = true;
                clearInterval(intervalRef.current);
                //alert('You have found supplies!');
            }
            sessionStorage.setItem("gameState", JSON.stringify(gameStateAlter));
        });
    }

    const generateRound = () => {
        const gameState = JSON.parse(sessionStorage.getItem("gameState"));
        gameState.round++;
        gameState.finishedRound = false;
        setRound(gameState.round);

        gameState.started = true;

        clearInterval(intervalRef.current);
        console.log("POKPOK");
        setTimer(gameState.roundTimer);
        startCountdown();
        gameState.currTimer = gameState.roundTimer;

        setOpenPopup(false);

        const targetLocations = gameState.locations.map((location) => ({lat: location.latitude, lng: location.longitude}));
        const streetViewService = new window.google.maps.StreetViewService();

        const getRandomHeading = (from, to) => {
            if (from > to) {
                return (Math.floor(Math.random() * Math.abs(360 - from + to + 1)) + from) % 360;
            }
            return (Math.floor(Math.random() * Math.abs(from - to + 1)) + from) % 360;
        }

        const targetLocation = new window.google.maps.LatLng(targetLocations[gameState.round - 1]);
        gameState.currTargetLocation = targetLocation;

        for (let i = 0; i < 8; i++) {
            const heading = getRandomHeading(gameState.locations[0].heading_from, gameState.locations[0].heading_to);
            const tempStartingPosition = window.google.maps.geometry.spherical.computeOffset(targetLocation, gameState.startingDistance, heading);
            streetViewService.getPanorama({ location: tempStartingPosition, radius: 15, source: window.google.maps.StreetViewSource.OUTDOOR}, (data, status) => {
                if (status === window.google.maps.StreetViewStatus.OK) {
                    const panorama = new window.google.maps.StreetViewPanorama(
                        document.getElementById('map')
                    );
                    panorama.setPano(data.location.pano);
                    panorama.setPov({
                        heading: 270,
                        pitch: 0
                    });
                    panorama.setVisible(true);
                    panorama.addListener('position_changed', () => {
                        const currentPosition = panorama.getPosition();
                        const gameStateAlter = JSON.parse(sessionStorage.getItem("gameState"));
                        gameStateAlter.currLocation = currentPosition;
                        console.log(currentPosition);
                        console.log(gameStateAlter.currTargetLocation);
                        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(currentPosition, gameStateAlter.currTargetLocation);
                        
                        console.log(distance);
                        // If within 15 meters of the target location, alert the user
                        if (distance < 100) {
                            setOpenPopup(true);
                            gameStateAlter.finishedRound = true;
                            clearInterval(intervalRef.current);
                            //alert('You have found supplies!');
                        }
                        sessionStorage.setItem("gameState", JSON.stringify(gameStateAlter));
                    });
                } else {
                    console.error('Street View data not found for this location.');
                }
            });
        }
        sessionStorage.setItem("gameState", JSON.stringify(gameState));
    }

    useEffect(() => {

        console.log("Hello");
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const waitForMapsLoad = async () => {
            console.log("waiting about 2 seconds");

            await sleep(2000);

            console.log("2 seconds are over");

            const gameState = JSON.parse(sessionStorage.getItem("gameState"));

            if (gameState.currTimer !== null) {
                setTimer(gameState.currTimer);
                console.log("Timer: " + gameState.currTimer);
            }

            if (gameState.finishedRound) {
                setOpenPopup(true);
            }

            // const panorama = new window.google.maps.StreetViewPanorama(
            //     document.getElementById('map')
            // );
            // panorama.setVisible(true);
            // return;

            if (gameState.started) {
                reRenderRoundOnRefresh();
                return;
            }
            generateRound();

        }

        waitForMapsLoad();

        return () => clearInterval(intervalRef.current);
    }, []);

    return (
      <div className="h-screen">
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
        {round && (<p>Round: {round}</p>)}
        {(timer !== null) && (<p>Seconds Left: {timer}</p>)}
        {err && (<p>Error: {err}</p>)}
        <div className="relative h-screen w-full flex justify-center">
            {openPopup && (<Popup text="You have found the location!" buttonText="Next" onClick={generateRound}></Popup>)}
            <div id="map" className="relative h-3/4 w-full z-10"> 
            </div>
        </div>
      </div>
    );
};

export default DirectionsGame;
