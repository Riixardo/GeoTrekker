const pool = require('../db/pool');
const crypto = require('crypto');

// code 1 = success, code 2 = error occured
const getDirectionsMaps = async (req, res) => {
    try {
        const client = await pool.connect();
        await client.query("SET search_path TO GeoTrekker");
        const result = await client.query("SELECT map_name FROM directions_maps");
        if (result.rows == 0) {
            res.json({code: 2})
            client.release();
            return;
        }
        res.json({code: 1, maps: result.rows});
        client.release();
    } catch (err) {
        console.error("Error fetching message", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// code 1 = success, code 2 = error occured
const getClassicMaps = async (req, res) => {
    try {
        const client = await pool.connect();
        await client.query("SET search_path TO GeoTrekker");
        const result = await client.query("SELECT map_name FROM classic_maps ORDER BY map_id ASC");
        if (result.rows == 0) {
            res.json({code: 2})
            client.release();
            return;
        }
        res.json({code: 1, maps: result.rows});
        client.release();
    } catch (err) {
        console.error("Error fetching message", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


// code 1 = success, code 2 = invalid password, code 3 = no account found, code 4 = other error
const handleLogin = async (req, res) => {
    
    const { email, password } = req.body;
    const lowercase_email = email.toLowerCase();
    
    try {
        const client = await pool.connect();
        await client.query("SET search_path TO GeoTrekker");
        const result = await client.query("SELECT * FROM users WHERE email = $1", [lowercase_email]);
        if (result.rows.length == 1 && result.rows[0].password == password) {
            const user = result.rows[0].username;
            // identifies a current session
            const token = crypto.randomBytes(32).toString("hex");
            const user_id = result.rows[0].id;
            const insert_result = await client.query("INSERT INTO sessions VALUES ($1, $2) RETURNING *", [token, user_id]);
            if (insert_result.rows.length > 0) {
                res.json({code: 1, userData: {user, user_id}, token});
                return;
            }
        } 
        else if (result.rows.length == 1 && result.rows[0].password != password) {
            res.json({code: 2});
        }
        else if (result.rows.length == 0) {
            res.json({code: 3})
        }
        else {
            console.log("More than 1 account found with same email, please fix immediately");
            res.json({code: 4})
        }
        client.release();
    } catch (err) {
        console.error("Error fetching message", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// code 1 = success, code 2 = account already exists, code 3 = other error
const handleSignup = async (req, res) => {

    const { username, email, password } = req.body;
    const lowercase_email = email.toLowerCase();

    try {
        const client = await pool.connect();
        await client.query("SET search_path TO GeoTrekker");
        const result = await client.query("SELECT * FROM users WHERE email = $1", [lowercase_email]);
        if (result.rows.length == 0) {

            const result = await client.query("INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING *", [username, lowercase_email, password]);
            if (result.rows.length > 0) {
                res.json({code: 1});
            }
            else {
                console.log("Error: Problem with inserting account data")
            }
        } 
        else if (result.rows.length == 1) {
            res.json({code: 2});
        }
        else {
            console.log("Error: More than 1 account found with same email");
            res.json({code: 3})
        }
        client.release();
    } catch (err) {
        console.error("Error fetching message", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const createDirectionsGame = async (req, res) => {

    const map = req.body.map;
    const rounds = parseInt(req.body.rounds, 10);

    try {
        const client = await pool.connect();
        await client.query("SET search_path TO GeoTrekker");
        let result;
        if (map == "Random") {
            const query = "SELECT location_name, latitude, longitude, map_name, heading_from, heading_to \
            FROM directions_maps \
            JOIN directions_map_location ON map_id = map \
            JOIN directions_locations ON location = location_id \
            ORDER BY RANDOM() LIMIT $1"
            result = await client.query(query, [rounds]);
            console.log(result.rows);
        }
        else {
            const query = "SELECT location_name, latitude, longitude, map_name, heading_from, heading_to \
            FROM directions_maps \
            JOIN directions_map_location ON map_id = map \
            JOIN directions_locations ON location = location_id \
            WHERE map_name = $1 \
            ORDER BY RANDOM() LIMIT $2"
            result = await client.query(query, [map, rounds]);
            console.log(result.rows);
        }
        if (result.rows.length == rounds) {
            res.json({code: 1, locations: result.rows});
        } 
        else {
            let i = 0;
            while (result.rows.length < rounds) {
                result.rows.push(result.rows[i]);
                i++;
            }
            res.json({code: 1, locations: result.rows});
        }
        client.release();
    } catch (err) {
        console.error("Error fetching message", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const createClassicGame = async (req, res) => {

    const map = req.body.map;
    const rounds = parseInt(req.body.rounds, 10);

    try {
        const client = await pool.connect();
        await client.query("SET search_path TO GeoTrekker");
        let result;
        if (map == "World") {
            const query = "SELECT latitude AS lat, longitude AS lng \
            FROM classic_locations \
            ORDER BY RANDOM() LIMIT $1"
            result = await client.query(query, [rounds]);
            console.log(result.rows);
        }
        else {
            const query = "SELECT latitude AS lat, longitude AS lng\
            FROM classic_maps \
            JOIN classic_map_location ON map_id = map \
            JOIN classic_locations ON location = location_id \
            WHERE map_name = $1 \
            ORDER BY RANDOM() LIMIT $2"
            result = await client.query(query, [map, rounds]);
            console.log(result.rows);
        }
        if (result.rows.length == rounds) {
            res.json({code: 1, locations: result.rows});
        } 
        else {
            let i = 0;
            while (result.rows.length < rounds) {
                result.rows.push(result.rows[i]);
                i++;
            }
            res.json({code: 1, locations: result.rows});
        }
        client.release();
    } catch (err) {
        console.error("Error fetching message", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const handleLogout = async (req, res) => {
    const { token } = req.body;
    
    try {
        const client = await pool.connect();
        await client.query("SET search_path TO GeoTrekker");
        const result = await client.query("DELETE FROM sessions WHERE session_id = $1 RETURNING *", [token]);
        if (result.rows.length > 0) {
            res.json({code: 1});
            console.log("Logged out of " + token);
        } 
        else {
            console.log("Deleted non-existing session");
            res.json({code: 2});
        }
        client.release();
    } catch (err) {
        console.error("Error fetching message", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const resumeSession = async (req, res) => {
    const { token, user_id } = req.body;
    
    try {
        const client = await pool.connect();
        await client.query("SET search_path TO GeoTrekker");
        const result = await client.query("INSERT INTO sessions VALUES ($1, $2) RETURNING *", [token, user_id]);
        if (result.rows.length > 0) {
            res.json({code: 1});
            console.log("Resumed Session " + token);
        } 
        else {
            console.log("Insertion failed");
            res.json({code: 2});
        }
        client.release();
    } catch (err) {
        console.error("Error fetching message", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const postClassicGame = async (req, res) => {
    console.log("Body: " + req.body);
    const { user_id, rounds, timer, score, map } = req.body;
    try {
        const client = await pool.connect();
        await client.query("SET search_path TO GeoTrekker");
        const result = await client.query("INSERT INTO classic_games(user_id, rounds, timer, score, map) VALUES ($1, $2, $3, $4, $5) RETURNING *", [user_id, rounds, timer, score, map]);
        if (result.rows.length > 0) {
            res.json({code: 1});
        } 
        else {
            console.log("Insertion failed");
            res.json({code: 2});
        }
        client.release();
    } catch (err) {
        console.error("Error fetching message", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getTopTenClassicGamesLB = async (req, res) => {
    const map_name = req.body.map;
    try {
        const client = await pool.connect();
        await client.query("SET search_path TO GeoTrekker");
        const result = await client.query("SELECT username, score FROM users JOIN classic_games ON id = user_id WHERE rounds = 5 AND timer = 180 AND map = $1 ORDER BY score DESC LIMIT 10", [map_name]);
        if (result.rows.length > 0) {
            res.json({code: 1, games: result.rows});
        } 
        else {
            console.log("Insertion failed");
            res.json({code: 2});
        }
        client.release();
    } catch (err) {
        console.error("Error fetching message", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


module.exports = {
    getDirectionsMaps,
    handleLogin,
    handleSignup,
    createDirectionsGame,
    handleLogout,
    resumeSession,
    getClassicMaps,
    createClassicGame,
    postClassicGame,
    getTopTenClassicGamesLB
}