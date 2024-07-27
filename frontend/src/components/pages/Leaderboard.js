import React, { useEffect, useState } from 'react';
import Button from '../PageButton';
import LeaderboardTable from '../LeaderboardTable';
import axios from 'axios';

const Leaderboard = () => {

    const [classicMaps, setClassicMaps] = useState(null);
    const [classicGames, setClassicGames] = useState([]);

    useEffect(() => {
        const getClassicMaps = async () => {
            const response = await axios.get("/api/db/classic-maps");
            setClassicMaps(response.data.maps);
        }

        getClassicMaps();
    }, []);

    useEffect(() => {
        if (!classicMaps) {
            return;
        }
        const getClassicGamesByMap = async (map) => {
            const response = await axios.post("/api/db/classic-games-lb", {map});
            setClassicGames((prev) => [...prev,{map, games: response.data.games}]);
        }

        for (let i = 0; i < classicMaps.length; i++) {
            getClassicGamesByMap(classicMaps[i].map_name);
        }
        
    }, [classicMaps]);



    return (
        <div className="flex flex-col h-screen w-full">
            <div className="w-full mb-10">  
                <div className="inline-block w-1/3 float-left border-box">
                    <Button page={"/"} text={"Back"}></Button>
                </div>
                <div className="inline-block w-1/3 float-left border-box text-center font-orbitron ">
                    <h1 className="text-3xl mb-10 font-bold" >Leaderboard</h1>
                    <p>Leaderboard qualified games must be on 5 rounds and 3 minutes</p>
                </div>
                <div className="inline-block w-1/3 float-left border-box text-right"> 
                </div>
            </div>
            <div className="flex flex-col w-[40%] items-center ml-4">
                <h2 className="font-orbitron font-bold mb-10">Classic</h2>
                {classicMaps && classicGames.length == classicMaps.length && classicGames.map((data) => (<LeaderboardTable map={data.map} games={data.games}></LeaderboardTable>))}
            </div>
        </div>
    );
};

export default Leaderboard;