// backend/routes/movies.js
const express = require("express");
const router = express.Router();
const moviesController = require("../controllers/moviesController");
const authMiddleware = require("../middleware/auth");

// backend/routes/movies.js
router.get("/search", authMiddleware, moviesController.searchMovies);
router.get("/details/:id", authMiddleware, moviesController.getMovieById);

module.exports = router;
