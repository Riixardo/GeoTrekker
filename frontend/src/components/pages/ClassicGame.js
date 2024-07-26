import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from '../Popup';

const ClassicGame = () => {

    const [timer, setTimer] = useState(() => {
        return JSON.parse(sessionStorage.getItem("gameState")).roundTimer;
    });
    const [round, setRound] = useState(1);
    const totalRounds = JSON.parse(sessionStorage.getItem("gameState")).totalRounds;

    const intervalRef = useRef(null); 

    const [timeoutPopup, setTimeoutPopup] = useState(false);

    const [loadMiniMapExpander, setLoadMiniMapExpander] = useState(false);
    const [miniMapSize, setMiniMapSize] = useState(1);

    const navigate = useNavigate();

    const handleGameEnd = () => {
        navigate("/play/classic/endscreen");
    }

    const expandMiniMapSize = () => { setMiniMapSize((prevSize) => {return prevSize + 0.3})} ;

    const addPanoramaPositionListener = (panorama) => {
        panorama.addListener('position_changed', () => {
            const currentPosition = panorama.getPosition();
            const gameStateAlter = JSON.parse(sessionStorage.getItem("gameState"));
            gameStateAlter.currLocation = currentPosition;
            sessionStorage.setItem("gameState", JSON.stringify(gameStateAlter));
        });
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

    const updateGameRoundResults = () => {
        const gameState = JSON.parse(sessionStorage.getItem("gameState"));
        if (gameState.round === 0) {
            return;
        }
        gameState.results.push({time: timer, roundTimer: gameState.roundTimer, targetLocation: gameState.locations[gameState.round - 1], chosenLocation: gameState.currLocation});
        sessionStorage.setItem("gameState", JSON.stringify(gameState));
    }

    const reRenderRoundOnRefresh = () => {

        const gameState = JSON.parse(sessionStorage.getItem("gameState"));
        if (!gameState.finishedRound) {
            startCountdown();
        }
        setRound(gameState.round);

        const panoramaOptions = {
            position: gameState.currLocation, 
            pov: { heading: 270, pitch: 0 }
        }
        const panorama = new window.google.maps.StreetViewPanorama(document.getElementById('map'), panoramaOptions);
        
        panorama.setVisible(true);
        panorama.setOptions({
            disableDefaultUI: true,
            clickToGo: true,        
            linksControl: true
        })
        const mapOptions = {
            center: {lat:0, lng:0}, 
            zoom: 2,
            disableDefaultUI: true,
            zoomControl: true,
            draggableCursor: 'default', // Change the cursor to default
        };

        const map = new window.google.maps.Map(document.getElementById("mini-map"), mapOptions);

        map.addListener('click', (event) => {
            const clickedLocation = event.latLng;
            console.log('Clicked location:', clickedLocation.toString());
        });
    }

    const generateRound = () => {
        updateGameRoundResults();
        const gameState = JSON.parse(sessionStorage.getItem("gameState"));
        if (gameState.round >= parseInt(gameState.totalRounds, 10)) {
            console.log("Game End.");
            handleGameEnd();
            return;
        }
        gameState.round++;
        gameState.finishedRound = false;
        setRound(gameState.round);

        gameState.started = true;

        clearInterval(intervalRef.current);
        setTimer(gameState.roundTimer);
        startCountdown();
        gameState.currTimer = gameState.roundTimer;

        const targetLocation = new window.google.maps.LatLng(gameState.locations[gameState.round - 1]);

        const panoramaOptions = {
            position: targetLocation, 
            pov: { heading: 270, pitch: 0 }
        }
        
        const panorama = new window.google.maps.StreetViewPanorama(document.getElementById('map'), panoramaOptions);
        panorama.setVisible(true);
        panorama.setOptions({
            disableDefaultUI: true,
            clickToGo: true,        
            linksControl: true
        })
        addPanoramaPositionListener(panorama);

        const mapOptions = {
            center: {lat:0, lng:0}, 
            zoom: 2,
            disableDefaultUI: true,
            zoomControl: true,
            draggableCursor: 'default', // Change the cursor to default
        };

        const map = new window.google.maps.Map(document.getElementById("mini-map"), mapOptions);
        map.addListener('click', (event) => {
            const clickedLocation = event.latLng;
            console.log('Clicked location:', clickedLocation.toString());
        });

        sessionStorage.setItem("gameState", JSON.stringify(gameState));
    }

    useEffect(() => {

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const waitForMapsLoad = async () => {
            console.log("waiting about 2 seconds");

            await sleep(2000);

            console.log("2 seconds are over");

            const gameState = JSON.parse(sessionStorage.getItem("gameState"));

            setLoadMiniMapExpander(true);

            if (gameState.currTimer !== null) {
                setTimer(gameState.currTimer);
                console.log("Timer: " + gameState.currTimer);
            }

            if (gameState.finishedRound) {
                
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
        <div className="flex h-1/8 w-full justify-between font-orbitron">
            <div className="flex w-1/3 justify-start items-center">
                <p>Click where you think you are on the mini-map</p>
            </div>
            <div className="flex w-2/3 justify-between items-center">
                {round && (<div className="border rounded border-4 float-left">Round: {round} / {totalRounds}</div>)}
                {(timer !== null) && (<div className="border rounded border-4">Timer: {timer} seconds left</div>)}
            </div>
        </div>
        <div className="relative h-7/8 w-full flex justify-center">
            {timeoutPopup && (<Popup text="You ran out of time!" buttonText="End" onClick={handleGameEnd}></Popup>)}
            <div id="map" className="relative h-full w-full z-10"> 
            </div>
            <div id="mini-map" className="absolute w-96 h-60 z-50 bottom-2 right-2 transform transition-transform duration-100 origin-bottom-right cursor-default hover:cursor-default" style={{ transform: `scale(${miniMapSize})` }} onMouseEnter={expandMiniMapSize} onMouseLeave={() => setMiniMapSize(1)}>
                {loadMiniMapExpander && (<div className="absolute w-8 h-8 bg-blue-500 cursor-pointer z-60" onClick={expandMiniMapSize}>
                </div>)}
            </div>
        </div>
      </div>
    );
};

export default ClassicGame;
