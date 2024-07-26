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
    const [miniMapSize, setMiniMapSize] = useState(null);

    const [roundFinished, setRoundFinished] = useState(false);
    const [roundJustStarted, setRoundJustStarted] = useState(false);

    const navigate = useNavigate();

    let mapMarker = null;

    const handleGameEnd = () => {
        navigate("/play/classic/endscreen");
    }

    const expandMiniMapSize = () => { 
        setMiniMapSize((prevSize) => {
            const newWidth = Math.floor(prevSize.width * 1.5);
            const newHeight = Math.floor(prevSize.height * 1.5);
            setMiniMapSize({width: newWidth, height: newHeight});
        });
    }

    const calculateGuessDistance = () => {
        const gameState = JSON.parse(sessionStorage.getItem("gameState"));
        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(gameState.guessLocation, gameState.locations[gameState.round - 1]);
        return Math.round(distance / 10) / 100;
    }

    const addPanoramaPositionListener = (panorama) => {
        panorama.addListener("position_changed", () => {
            const currentPosition = panorama.getPosition();
            const gameStateAlter = JSON.parse(sessionStorage.getItem("gameState"));
            gameStateAlter.currLocation = currentPosition;
            sessionStorage.setItem("gameState", JSON.stringify(gameStateAlter));
        });
    }

    const addMapPositionListener = (map) => {
        map.addListener("click", (event) => {
            if (mapMarker) {
                mapMarker.setMap(null);
            }
            mapMarker = new window.google.maps.Marker({
                position: event.latLng,
                map: map,
            });
            const gameStateAlter = JSON.parse(sessionStorage.getItem("gameState"));
            gameStateAlter.guessLocation = event.latLng;
            sessionStorage.setItem("gameState", JSON.stringify(gameStateAlter));
        });
    }

    const addPanAndMap = (panOptions) => {
        const panorama = new window.google.maps.StreetViewPanorama(document.getElementById('map'), panOptions);
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
        addMapPositionListener(map);
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
        gameState.results.push({time: timer, roundTimer: gameState.roundTimer, targetLocation: gameState.locations[gameState.round - 1], guessLocation: gameState.guessLocation, distance: calculateGuessDistance()});
        sessionStorage.setItem("gameState", JSON.stringify(gameState));
    }

    const reRenderRoundOnRefresh = () => {

        const gameState = JSON.parse(sessionStorage.getItem("gameState"));
        setRound(gameState.round);
        if (gameState.finishedRound) {
            setRoundFinished(true);
            return;
        }
        startCountdown();

        const panoramaOptions = {
            position: gameState.currLocation, 
            pov: { heading: 270, pitch: 0 }
        }
        addPanAndMap(panoramaOptions);
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
        setRoundFinished(false);
        setRoundJustStarted(true);

        gameState.started = true;

        clearInterval(intervalRef.current);
        setTimer(gameState.roundTimer);
        startCountdown();
        gameState.currTimer = gameState.roundTimer;

        sessionStorage.setItem("gameState", JSON.stringify(gameState));
    }

    // Updates the next round, ensures "map" div is loaded before calling
    useEffect(() => {
        if (!roundJustStarted) {
            return;
        }
        const gameState = JSON.parse(sessionStorage.getItem("gameState"));
        const targetLocation = new window.google.maps.LatLng(gameState.locations[gameState.round - 1]);

        const panoramaOptions = {
            position: targetLocation, 
            pov: { heading: 270, pitch: 0 }
        }

        addPanAndMap(panoramaOptions);
        setRoundJustStarted(false);
        setLoadMiniMapExpander(true);

    }, [roundJustStarted]);

    // Updates the round endscreen, ensures "result" div is loaded before calling
    useEffect(() => {

        if (!roundFinished) {
            return;
        }

        const handleGuess = () => {
            const gameState = JSON.parse(sessionStorage.getItem("gameState"));
            gameState.finishedRound = true;
            clearInterval(intervalRef.current);
            setLoadMiniMapExpander(false);
    
            const mapOptions = {
                center: {lat:0, lng:0}, 
                zoom: 2,
                disableDefaultUI: true,
                zoomControl: true,
                draggableCursor: 'default', // Change the cursor to default
            };
    
            const map = new window.google.maps.Map(document.getElementById("result"), mapOptions);
            new window.google.maps.Marker({
                position: gameState.guessLocation,
                map: map,
            });
            new window.google.maps.Marker({
                position: gameState.locations[gameState.round - 1],
                map: map,
            });
            sessionStorage.setItem("gameState", JSON.stringify(gameState));
        }

        handleGuess();
    }, [roundFinished])

    useEffect(() => {

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const waitForMapsLoad = async () => {
            console.log("waiting about 2 seconds");

            await sleep(2000);

            console.log("2 seconds are over");

            const gameState = JSON.parse(sessionStorage.getItem("gameState"));

            setMiniMapSize({width: 376, height: 240});

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
                {!roundFinished && (<p>Click where you think you are on the mini-map</p>)}
                {roundFinished && (<p>Look's like you were {calculateGuessDistance()} kilometers away</p>)}
            </div>
            <div className="flex w-2/3 justify-between items-center">
                {round && (<div className="border rounded border-4 float-left">Round: {round} / {totalRounds}</div>)}
                {roundFinished && (<button className="z-60 w-24 h-8 bg-green-400 border border-1 border-black" onClick={generateRound}>Continue</button>)}
                {(timer !== null) && (<div className="border rounded border-4">Timer: {timer} seconds left</div>)}
            </div>
        </div>
        {!roundFinished && (<div className="relative h-7/8 w-full flex justify-center">
            {timeoutPopup && (<Popup text="You ran out of time!" buttonText="End" onClick={handleGameEnd}></Popup>)}
            <div id="map" className="relative h-full w-full z-10"> 
                {/* {loadMiniMapExpander && (<button className="relative z-60 w-24 h-8 bottom-2, left-2 border border-2 bg-green-400" onClick={() => {setRoundFinished(true)}}>Enter</button>)} */}
            </div>
            {miniMapSize && (<div id="mini-map" className="absolute z-50 bottom-10 right-2 transform transition-transform duration-100 origin-bottom-right cursor-default hover:cursor-default border border-2 border-gray-500" style={{ width: miniMapSize.width || 376, height: miniMapSize.height || 240 }} onMouseEnter={expandMiniMapSize} onMouseLeave={() => setMiniMapSize({width: 376, height: 240})}>
                {loadMiniMapExpander && (<div className="absolute w-8 h-8 bg-blue-500 cursor-pointer z-60" onClick={expandMiniMapSize}>
                </div>)}
                {loadMiniMapExpander && (<button className="absolute z-60 w-24 h-8 bottom-2 left-1/2 transform -translate-x-1/2 bg-green-400 border border-1 border-black" onClick={() => {setRoundFinished(true)}}>Enter</button>)}
            </div>)}
        </div>)}
        {roundFinished && (<div className="relative h-7/8 w-full flex justify-center">
            <div id="result" className="relative h-full w-full z-10">
            </div>
         </div>)}
      </div>
    );
};

export default ClassicGame;
