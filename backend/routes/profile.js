// backend/routes/profile.js
const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middleware/auth");

router.post("/watchlist/add", authMiddleware, profileController.addMovieToWatchlist);
router.post("/watchlist/remove", authMiddleware, profileController.removeMovieFromWatchlist);

module.exports = router;
