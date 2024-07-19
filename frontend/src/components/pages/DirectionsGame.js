import React, { useEffect, useState } from 'react';

const DirectionsGame = () => {

    const [err, setErr] = useState("");

    useEffect(() => {

        const gameState = JSON.parse(sessionStorage.getItem("gameState"));
        if (!gameState) {
            setErr("Game Creation Error");
            return;
        }

        if (gameState.started) {
          return;
        }

        const targetLocations = gameState.locations.map((location) => ({lat: location.latitude, lng: location.longitude}));
        const streetViewService = new window.google.maps.StreetViewService();

        const getRandomHeading = (from, to) => {
            if (from > to) {
                return (Math.floor(Math.random() * Math.abs(360 - from + to + 1)) + from) % 360;
            }
            return (Math.floor(Math.random() * Math.abs(from - to + 1)) + from) % 360;
        }

        const targetLocation = new window.google.maps.LatLng(targetLocations[gameState.round - 1]);

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
                        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(currentPosition, new window.google.maps.LatLng(targetLocation));
                        
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
        // const map = new window.google.maps.Map(document.getElementById('map'), {
        //     center: position,
        //     zoom: 15, // Adjust the zoom level as needed
        // });
        // map.setStreetView(panorama);

    }, []);

    return (
      <div>
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
        {err && (<p>Error: {err}</p>)}
        defaultwdw <br></br>
        <div id="map" className="h-[600px] w-full"> 
        </div>
      </div>
    );
};

export default DirectionsGame;
