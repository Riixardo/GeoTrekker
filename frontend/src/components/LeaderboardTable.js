import React from 'react';
import LeaderboardRow from './LeaderboardRow';

const LeaderboardTable = ({ map, games }) => {
    return (
        <div className="flex flex-col items-center border rounded border-black border-2 w-full font-orbitron mb-4">
            <h3 className="w-full text-center font-bold">{map}</h3>
            <div className="flex w-full border-t border-black">
                <div className="w-1/3">
                    <h3 className="w-full text-center">Rank</h3>
                </div>
                <div className="w-1/3">
                    <h3 className="w-full text-center">Username</h3>
                </div>
                <div className="w-1/3">
                    <h3 className="w-full text-center">Score</h3>
                </div>
            </div>
            {games && games.map((data, index) => (<LeaderboardRow rank={index + 1} username={data.username} score={data.score}></LeaderboardRow>))}
        </div>
    );
}

export default LeaderboardTable;