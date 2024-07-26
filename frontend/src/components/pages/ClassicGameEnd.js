import React, { useState, useEffect } from 'react';
import Button from '../PageButton';
import ClassicResultRow from '../ClassicResultRow';

const ClassicGameEnd = () => {

    const [results, setResults] = useState(() => {return JSON.parse(sessionStorage.getItem("gameState")).results;})

    useEffect(() => {
        
    }, []);



    return (
        <div className="h-screen w-full overflow-auto items-center">
            <h1 className="text-center font-orbitron text-3xl">Classic Game Results</h1>
            <Button page={"/games/classic"} text={"Back"}></Button>

            <div id="map" className="h-1/2 w-full items-center justify-center border rounded border-4">
                
            </div>
        </div>
    );
};

export default ClassicGameEnd;