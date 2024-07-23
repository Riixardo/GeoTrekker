import React from 'react';

const DirectionsResultRow = ({round, name, time, score}) => {
    return (
        <div className="flex h-1/8 border rounded w-1/2 text-center mx-auto font-orbitron font-bold">
            <div className="flex items-center justify-center h-full w-1/4 text-center">
                Round {round}
            </div>
            <div className="flex items-center justify-center h-full w-1/4 text-center">
                {name}
            </div>
            <div className="flex items-center justify-center h-full w-1/4 text-center">
                Time Taken: {time}
            </div>
            <div className="flex items-center justify-center h-full w-1/4 text-center">
                Score: {score}
            </div>
        </div>
    );
}

export default DirectionsResultRow;