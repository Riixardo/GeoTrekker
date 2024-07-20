const express = require("express");
const router = express.Router();
const dbController = require('../controllers/dbController');

router.get("/api/db/maps", dbController.getMaps);

router.post("/api/login", dbController.handleLogin);

router.post("/api/signup", dbController.handleSignup);

router.post("/api/create-game/directions", dbController.createDirectionsGame);

module.exports = router;