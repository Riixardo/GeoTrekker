import React from 'react';
import Button from '../PageButton';

const DirectionsGameEnd = () => {
    return (
        <div>
        <h1>Directions Game Results</h1>
        <Button page={"/games/directions"} text={"Back"}></Button>
        </div>
    );
};

export default DirectionsGameEnd;