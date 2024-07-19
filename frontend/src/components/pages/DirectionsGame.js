import React, { useEffect, useState } from 'react';
import API_KEY from './apiConfig.js';

const DirectionsGame = () => {

    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [round, setRound] = useState(0);
    const [timer, setTimer] = useState(() => { return JSON.parse(sessionStorage.getItem("gameState")).currTimer });
    const [err, setErr] = useState("");

    const fetchNextRound = (gameState) => {

        if (gameState.round === 3) {
            return;
        }
        gameState.round++;
        setRound(gameState.round);
        const targetLocations = gameState.locations.map((location) => ({lat: location.latitude, lng: location.longitude}));

        const getRandomHeading = (from, to) => {
            if (from > to) {
                return (Math.floor(Math.random() * Math.abs(360 - from + to + 1)) + from) % 360;
            }
            return (Math.floor(Math.random() * Math.abs(from - to + 1)) + from) % 360;
        }

        const targetLocation = new window.google.maps.LatLng(targetLocations[gameState.round - 1]);
        gameState.currTargetLocation = targetLocation;

        const generatePanorama = (times) => {
            console.log("in loop");
            console.log("in loop again");
            if (times >= 8) {
              console.log("in loop again");
              console.log("Could not find a panorama");
              return;
            }
            console.log("in loop After");
            const heading = getRandomHeading(gameState.locations[0].heading_from, gameState.locations[0].heading_to);
            console.log("after heading");
            const tempStartingPosition = window.google.maps.geometry.spherical.computeOffset(targetLocation, gameState.startingDistance, heading);
            console.log(tempStartingPosition);
            const streetViewService = new window.google.maps.StreetViewService();
            streetViewService.getPanorama({ location: tempStartingPosition, radius: 15, source: window.google.maps.StreetViewSource.OUTDOOR}, (data, status) => {
                console.log("In Here");
                if (status === window.google.maps.StreetViewStatus.OK) {
                    console.log("In wdwdwHere");
                    const panorama = new window.google.maps.StreetViewPanorama(
                        document.getElementById("map")
                    );
                    panorama.setPano(data.location.pano);
                    panorama.setPov({
                        heading: 270,
                        pitch: 0
                    });
                    console.log("Supercalifragiladwdw");
                    panorama.setVisible(true);
                    console.log("POKPOK");
                    panorama.addListener('position_changed', () => {
                        const currentPosition = panorama.getPosition();
                        const gameStateAlter = JSON.parse(sessionStorage.getItem("gameState"));
                        gameStateAlter.currLocation = currentPosition;
                        sessionStorage.setItem("gameState", JSON.stringify(gameStateAlter));
                        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(currentPosition, gameStateAlter.currTargetLocation);
                        
                        // If within 15 meters of the target location, alert the user
                        if (distance < 100) {
                            alert('You have found supplies!');
                        }
                    });
                } else {
                    console.log("generate again");
                    generatePanorama(times + 1);
                }
                console.log("wdpwkdwdkwdwdwdwd");
            });
            console.log("pleecece");
        }
        
        generatePanorama(1);
        console.log("pokpoklop");

        sessionStorage.setItem("gameState", JSON.stringify(gameState));
    };

    useEffect(() => {

        window.initMap = () => {
            console.log("Google Maps API loaded and initialized.");
            // Any other initialization code can go here
            // For example, you could create a default map here
        };

        const script = window.document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?key=" + API_KEY + "&loading=async&callback=initMap&libraries=maps,streetView,geometry";
        script.async = true;
    
        script.onload = () => {
            setScriptLoaded(true);
            console.log("Hurrah");
        };
    
        window.document.body.appendChild(script);
    
        return () => {
            window.document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {

        if (!scriptLoaded) {
            console.log("Still loading script...");
            return;
        }

        let gameState = JSON.parse(sessionStorage.getItem("gameState"));
        if (!gameState) {
            setErr("Game Creation Error");
            return;
        }

        let timer;

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const waitHalfSecond = async () => {
            console.log('Before sleep');

            // Wait for 2000 milliseconds
            await sleep(5000);

            console.log('After sleep');
            // 49.15337153779258, -122.65704176638343
            const streetViewService = new window.google.maps.StreetViewService();
            streetViewService.getPanorama((data, status) => {
                console.log("In Here");
                if (status === window.google.maps.StreetViewStatus.OK) {
                    console.log("In wdwdwHere");
                } else {
                    console.log("generate again");
                }
                console.log("wdpwkdwdkwdwdwdwd");
            });
            return;





            if (gameState.started) {
                console.log(window.google.maps.StreetViewSource.OUTDOOR);
                timer = setInterval(() => {
                    setTimer((prevCount) => prevCount - 1);
                }, 1000);
                setRound(gameState.round);
                const panorama = new window.google.maps.StreetViewPanorama(document.getElementById('map'), 
                {
                  position: gameState.currLocation, 
                  pov: { heading: 270, pitch: 0}
                });
                panorama.setVisible(true);
                panorama.addListener('position_changed', () => {
                    const currentPosition = panorama.getPosition();
                    const gameStateAlter = JSON.parse(sessionStorage.getItem("gameState"));
                    gameStateAlter.currLocation = currentPosition;
                    sessionStorage.setItem("gameState", JSON.stringify(gameStateAlter));
                    const distance = window.google.maps.geometry.spherical.computeDistanceBetween(currentPosition, gameStateAlter.currTargetLocation);
                    
                    // If within 15 meters of the target location, alert the user
                    if (distance < 100) {
                        alert('You have found supplies!');
                    }
                });
                return;
            }
          

            fetchNextRound(gameState);
            timer = setInterval(() => {
                setTimer((prevCount) => prevCount - 1);
            }, 1000);

            gameState = JSON.parse(sessionStorage.getItem("gameState"));
            gameState.started = true;
            sessionStorage.setItem("gameState", JSON.stringify(gameState));
        };

        waitHalfSecond();

        return () => clearInterval(timer);
    }, [scriptLoaded]);

    return (
      <div className="h-screen">
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
        <div>{round}</div>
        <div>{timer}</div>
        {err && (<p>Error: {err}</p>)}
        defaultwdw <br></br>
        <div id="map" className="h-3/4 w-full"> 
        </div>
      </div>
    );
};

export default DirectionsGame;
