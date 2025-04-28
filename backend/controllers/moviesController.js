// backend/controllers/moviesController.js
const fetch = require("node-fetch");

exports.searchMovies = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.status(400).json({ msg: "Inserisci un termine di ricerca" });
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Errore nella ricerca dei film" });
  }
};

// Recupera i dettagli di un film da TMDB
exports.getMovieById = async (req, res) => {
  try {
    const movieId = req.params.id;
    const url = `https://api.themoviedb.org/3/movie/${movieId}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
      },
    });
    if (!response.ok) {
      return res.status(response.status).json({ msg: "TMDB error" });
    }
    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Errore nel recupero dettagli film" });
  }
};

