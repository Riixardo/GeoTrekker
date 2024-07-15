import React, { useEffect } from 'react';

const StreetView = () => {

  useEffect(() => {

      // 49.18434437723747, -122.79135237153017
    const position = { lat: 49.18434437723747, lng: -122.79135237153017 };
    const targetLocation = { lat: 49.1778914621349, lng: -122.79139107312709 }
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: position,
      zoom: 14,
    });

    const panorama = new window.google.maps.StreetViewPanorama(
      document.getElementById("map"),
      {
        position: position,
        pov: {
          heading: 34,
          pitch: 10,
        },
        visible: true,
      }
    );

    panorama.addListener('position_changed', () => {
      const currentPosition = panorama.getPosition();
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(currentPosition, new window.google.maps.LatLng(targetLocation));
      
      // If within 15 meters of the target location, alert the user
      if (distance < 15) {
        alert('You have found supplies!');
      }
    });

    map.setStreetView(panorama);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      defaultwdw <br></br>
      defaultwdwdwd<br></br>
      widthd<br></br>
      defaultwdwdwdd<br></br>
      windowd<br></br>
      widthwd<br></br>
      wdw<br></br>
      <div id="map" className="h-[600px] w-full"> 
      </div>
    </div>
  );
};

export default StreetView;
