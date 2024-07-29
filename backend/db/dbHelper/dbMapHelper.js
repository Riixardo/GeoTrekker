/**
 * @module dbMapHelper
 * 
 * @description This file contains helper functions for interacting with the map and location tables. Run this file for a CLI. 
 * 
 * @version 1.0.0
 * @date 2024-07-25
 * @author Richard Chen
 */


const pool = require('../pool');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const prompt = async (query) => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
}

/**
 * Inserts a directions mode location and specified a relationship with the given directions mode map
 * 
 * @async
 * @function insertDirectionsLocation
 * @param {number} mapID the map_id of the map of this location
 * @param {number} lat the latitude
 * @param {number} lng the longitude
 * @param {string} name the name of the location
 * @param {number} from randomized starting locations will generate in the heading range of [from, to]. The range is 0-360 and goes clockwise from North.
 * @param {number} to randomized starting locations will generate in the heading range of [from, to]. The range is 0-360 and goes clockwise from North.
 * @returns {void}
 */
const insertDirectionsLocation = async ({mapID, lat, lng, name, from, to}) => {
    try {
        const client = await pool.connect();
        await client.query("SET search_path TO GeoTrekker");
        const result = await client.query("INSERT INTO directions_locations(latitude, longitude, location_name, heading_from, heading_to) VALUES " 
            + "($1, $2, $3, $4, $5) RETURNING *", [lat, lng, name, from, to]);
        console.log("Inserted int directions_locations: " + JSON.stringify(result.rows, null, 2));
        const locationID = result.rows[0].location_id;
        const result2 = await client.query("INSERT INTO directions_map_location VALUES ($1, $2) RETURNING *", [mapID, locationID]);
        console.log("Inserted into directions_map_location: " + JSON.stringify(result2.rows, null, 2));
        client.release();
    } catch (err) {
        console.error("Error fetching message", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

/**
 * Deletes the given directions location and its map association
 * @async
 * @function deleteDirectionsLocations
 * @param {string} location_name the name of the location
 * @returns {void}
 */
const deleteDirectionsLocations = async (location_name) => {
    try {
        const client = await pool.connect();
        await client.query("SET search_path TO GeoTrekker");

        const query = "DELETE FROM directions_map_location \
                        WHERE location IN \
                        (SELECT location_id FROM directions_locations \
                        WHERE location_name = $1) \
                        RETURNING *";
        const result = await client.query(query, [location_name]);
        console.log("Deleted From directions_map_location: " + JSON.stringify(result.rows, null, 2));
        const result2 = await client.query("DELETE FROM directions_locations WHERE location_name = $1 RETURNING *", [location_name]);
        console.log("Deleted from directions_locations: " + JSON.stringify(result2.rows, null, 2));
        client.release();
    } catch (err) {
        console.error("Error fetching message", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

/**
 * Inserts a classic mode location and specified a relationship with the given classic mode map
 * 
 * @async
 * @function insertClassicLocation 
 * @param {number} mapID the map_id of the map of this location
 * @param {number} lat the latitude
 * @param {number} lng the longitude
 * @returns {void}
 */
const insertClassicLocation = async ({mapID, lat, lng}) => {
    try {
        const client = await pool.connect();
        await client.query("SET search_path TO GeoTrekker");
        const result = await client.query("INSERT INTO classic_locations(latitude, longitude) VALUES " 
            + "($1, $2) RETURNING *", [lat, lng]);
        console.log("Inserted into classic_locations: " + JSON.stringify(result.rows, null, 2));
        const locationID = result.rows[0].location_id;
        const result2 = await client.query("INSERT INTO classic_map_location VALUES ($1, $2) RETURNING *", [mapID, locationID]);
        console.log("Inserted into classic_map_location: " + JSON.stringify(result2.rows, null, 2));
        client.release();
    } catch (err) {
        console.error("Error fetching message", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

/**
 * Deletes the given classic location and its map association
 * @async
 * @function deleteDirectionsLocations
 * @param {string} location_name the name of the location
 * @returns {void}
 */
const deleteClassicLocations = async (location_name) => {
    try {
        const client = await pool.connect();
        await client.query("SET search_path TO GeoTrekker");

        const query = "DELETE FROM classic_map_location \
                        WHERE location IN \
                        (SELECT location_id FROM classic_locations \
                        WHERE location_name = $1) \
                        RETURNING *";
        const result = await client.query(query, [location_name]);
        console.log("Deleted From classic_map_location: " + JSON.stringify(result.rows, null, 2));
        const result2 = await client.query("DELETE FROM classic_locations WHERE location_name = $1 RETURNING *", [location_name]);
        console.log("Deleted from classic_locations: " + JSON.stringify(result2.rows, null, 2));
        client.release();
    } catch (err) {
        console.error("Error fetching message", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const main = async() => {
    while (true) {
        const response = await prompt("__________________________________________\n\nType 1 for insertDirectionsLocation\nType 2 for insertClassicLocation\nType 3 for deleteDirectionsLocation\nType 4 for deleteClassicLocation");

        if (response == "3") {
            const params = await prompt("__________________________________________\n\nType in the location name");
            await deleteDirectionsLocations(params);
            continue;
        }

        if (response == "4") {
            const params = await prompt("__________________________________________\n\nType in the location name");
            await deleteClassicLocations(params);
            continue;
        }

        const params = await prompt("__________________________________________\n\nType in the parameters as a list of JSON objects (use double quotes for keys and strings): ");
        const parsedParams = JSON.parse(params);
        
        if (response == "1") {
            for (let i = 0; i < parsedParams.length; i++) {
                await insertDirectionsLocation(parsedParams[i]);;
            }
        }
        else if (response == "2") {
            for (let i = 0; i < parsedParams.length; i++) {
                await insertClassicLocation(parsedParams[i]);
            }
        }
    }
}

main();

// {"mapID": , "lat": 52.2865234361675, "lng": 21.024142232351448}
// 48.861034631502136, 2.3358509397056455
// {"mapID": 2, "lat": 48.861034631502136, "lng": 2.3358509397056455, "name": "Louvre Pyramid", "from": 0, "to": 360}