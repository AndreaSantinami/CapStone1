// backend/routes/authors.js
const express = require("express");
const router = express.Router();
const authorsController = require("../controllers/authorsController");
const authMiddleware = require("../middleware/auth");

// Rotta per cercare autori (protetta, l'utente deve essere autenticato)
router.get("/", authMiddleware, authorsController.searchAuthors);

// Rotta per ottenere un autore per ID (profilo pubblico)
router.get("/:id", authorsController.getAuthorById);

module.exports = router;
