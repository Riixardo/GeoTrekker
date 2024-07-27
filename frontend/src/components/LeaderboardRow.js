import React from 'react';

const LeaderboardRow = ({ rank, username, score }) => {
    return (
        <div className="flex w-full border-t border-black">
            <div className="w-1/3">
                <h3 className="w-full text-center">{rank}</h3>
            </div>
            <div className="w-1/3">
                <h3 className="w-full text-center">{username}</h3>
            </div>
            <div className="w-1/3">
                <h3 className="w-full text-center">{score}</h3>
            </div>
        </div>
    );
}

export default LeaderboardRow;