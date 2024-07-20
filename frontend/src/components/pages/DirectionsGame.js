import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from '../Popup';

const DirectionsGame = () => {

    const [timer, setTimer] = useState(() => {
        return JSON.parse(sessionStorage.getItem("gameState")).roundTimer;
    });
    const [round, setRound] = useState(1);

    const intervalRef = useRef(null); 

    const [nextRoundPopup, setNextRoundPopup] = useState(false);
    const [timeoutPopup, setTimeoutPopup] = useState(false);

    const [currMap, setCurrMap] = useState("");
    const [currTarget, setCurrTarget] = useState("");

    const navigate = useNavigate();

    const handleGameFailed = () => {
        navigate("/play/directions/endscreen");
    }

    const startCountdown = () => {
        intervalRef.current = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer === 0) {
                    clearInterval(intervalRef.current);
                    const gameState = JSON.parse(sessionStorage.getItem("gameState"));
                    gameState.finishedRound = true;
                    gameState.failed = true;
                    sessionStorage.setItem("gameState", JSON.stringify(gameState));
                    setTimeoutPopup(true);
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
        setCurrMap(gameState.locations[gameState.round - 1].map_name);
        setCurrTarget(gameState.locations[gameState.round - 1].location_name);
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
                setNextRoundPopup(true);
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
        setTimer(gameState.roundTimer);
        startCountdown();
        gameState.currTimer = gameState.roundTimer;

        setNextRoundPopup(false);

        setCurrMap(gameState.locations[gameState.round - 1].map_name);
        setCurrTarget(gameState.locations[gameState.round - 1].location_name);


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

        for (let i = 0; i < 4; i++) {
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
                            setNextRoundPopup(true);
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
                setNextRoundPopup(true);
            }

            if (gameState.failed) {
                setTimeoutPopup(true);
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
        <div className="flex h-7/8 w-full justify-between font-orbitron">
            <div className="flex w-2/3 justify-start items-center">
                {currMap && currTarget && (<p>You are in {currMap}! Make your way to the {currTarget} within the time limit</p>)}
            </div>
            <div className="flex w-1/3 justify-between items-center">
                {round && (<div className="border rounded border-4 float-left">Round: {round}</div>)}
                {(timer !== null) && (<div className="border rounded border-4">Timer: {timer} seconds left</div>)}
            </div>
        </div>
        <div className="relative h-1/8 w-full flex justify-center">
            {nextRoundPopup && (<Popup text="You have found the location!" buttonText="Next" onClick={generateRound}></Popup>)}
            {timeoutPopup && (<Popup text="You ran out of time!" buttonText="End" onClick={handleGameFailed}></Popup>)}
            <div id="map" className="relative h-full w-full z-10"> 
            </div>
        </div>
      </div>
    );
};

export default DirectionsGame;
