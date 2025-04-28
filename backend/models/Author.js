// backend/models/Author.js
const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Non richiesto per utenti Google
  dataDiNascita: { type: String },
  avatar: { type: String, default: "" },
  watchedMovies: [{ type: Object }],   // Lista film visti
  toWatchMovies: [{ type: Object }],     // Lista film da vedere
});

module.exports = mongoose.model("Author", AuthorSchema);
