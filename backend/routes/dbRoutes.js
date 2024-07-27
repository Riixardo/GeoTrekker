const express = require("express");
const router = express.Router();
const dbController = require('../controllers/dbController');

router.get("/api/db/directions-maps", dbController.getDirectionsMaps);

router.get("/api/db/classic-maps", dbController.getClassicMaps);

router.post("/api/login", dbController.handleLogin);

router.post("/api/signup", dbController.handleSignup);

router.post("/api/create-game/directions", dbController.createDirectionsGame);

router.post("/api/create-game/classic", dbController.createClassicGame);

router.post("/api/logout", dbController.handleLogout);

router.post("/api/resume-session", dbController.resumeSession);

router.post("/api/post/classic-game", dbController.postClassicGame);

router.get("/api/db/classic-games-lb", dbController.getTopTenClassicGamesLB);

module.exports = router;