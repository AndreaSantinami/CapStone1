// backend/server.js
require("dotenv/config");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const passport = require("passport");

const app = express();

// Inizializza Passport e carica la configurazione
app.use(passport.initialize());
require("./config/passport");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connessione a MongoDB
connectDB();

// Monta le rotte API
app.use("/api/auth", require("./routes/auth"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/blogPosts", require("./routes/blogPosts"));
app.use("/api/movies", require("./routes/movies"));
app.use("/api/profile", require("./routes/profile"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
