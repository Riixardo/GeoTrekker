import React, { useEffect, useState } from 'react';

const DirectionsGame = () => {

    const [err, setErr] = useState("");

    const reRenderRoundOnRefresh = () => {
        const gameState = JSON.parse(sessionStorage.getItem("gameState"));
        const panorama = new window.google.maps.StreetViewPanorama(
            document.getElementById('map'), { position: gameState.currLocation, pov: { heading: 270, pitch: 0 } });
        
        panorama.setVisible(true);
        panorama.addListener('position_changed', () => {
            const currentPosition = panorama.getPosition();
            const gameStateAlter = JSON.parse(sessionStorage.getItem("gameState"));
            gameStateAlter.currLocation = currentPosition;
            const distance = window.google.maps.geometry.spherical.computeDistanceBetween(currentPosition, gameStateAlter.currTargetLocation);
            sessionStorage.setItem("gameState", JSON.stringify(gameStateAlter));
            
            // If within 15 meters of the target location, alert the user
            if (distance < 100) {
                alert('You have found supplies!');
            }
        });
    }

    const generateRound = () => {
        const gameState = JSON.parse(sessionStorage.getItem("gameState"));
        gameState.started = true;

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
                        sessionStorage.setItem("gameState", JSON.stringify(gameStateAlter));
                        
                        console.log(distance);
                        // If within 15 meters of the target location, alert the user
                        if (distance < 100) {
                            alert('You have found supplies!');
                        }
                    });
                } else {
                    console.error('Street View data not found for this location.');
                }
            });
        }
        sessionStorage.setItem("gameState", JSON.stringify(gameState));
    }

    useEffect(() => {

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const waitForMapsLoad = async () => {
            console.log("waiting about 2 seconds");

            await sleep(2000);

            console.log("2 seconds are over");

            const gameState = JSON.parse(sessionStorage.getItem("gameState"));
            if (gameState.started) {
                reRenderRoundOnRefresh();
                return;
            }
            generateRound();

        }

        waitForMapsLoad();
    }, []);

    return (
      <div className="h-screen">
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
        {err && (<p>Error: {err}</p>)}
        defaultwdw <br></br>
        <div id="map" className="h-3/4 w-full"> 
        </div>
      </div>
    );
};

export default DirectionsGame;
