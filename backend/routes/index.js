const express = require("express");
const { Pool } = require("pg");
const router = express.Router();
const dbconfig = require("../config/dbconfig.js");
// just for testing
const crypto = require('crypto');

const pool = new Pool(dbconfig.postgres);


// code 1 = success, code 2 = invalid password, code 3 = no account found, code 4 = other error
router.post("/api/login", async (req, res) => {
    
    const { email, password } = req.body;
    const lowercase_email = email.toLowerCase();
    
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT * FROM users WHERE email = $1", [lowercase_email]);
        if (result.rows.length == 1 && result.rows[0].password == password) {
            const user = result.rows[0].username;
            res.json({code: 1, userData: {user}, token: crypto.randomBytes(32).toString('hex')});
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

});

// code 1 = success, code 2 = account already exists, code 3 = other error
router.post("/api/signup", async (req, res) => {

    const { username, email, password } = req.body;
    const lowercase_email = email.toLowerCase();

    try {
        const client = await pool.connect();
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

});


// api testing
router.get("/api/testing", (req, res) => {
    res.send("Hello, World!"); 
    console.log("testing");
});

// database testing
router.get("/api/db-testing", async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT * FROM users ORDER BY created_at DESC");
        if (result.rows.length > 0) {
            const user = result.rows[0];
            res.json(user);
        } else {
            res.json({ message: "No users found" });
        }
        client.release();
    } catch (err) {
        console.error("Error fetching message", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;