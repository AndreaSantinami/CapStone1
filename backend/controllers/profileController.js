const Author = require("../models/Author");

// Aggiunge o sposta un film nella watchlist specificata (toWatchMovies o watchedMovies)
exports.addMovieToWatchlist = async (req, res) => {
  try {
    const { movie, listType } = req.body; // listType: "watchedMovies" oppure "toWatchMovies"
    if (!["watchedMovies", "toWatchMovies"].includes(listType)) {
      return res.status(400).json({ msg: "Invalid list type" });
    }

    const author = await Author.findById(req.user.id);
    if (!author) return res.status(404).json({ msg: "User not found" });

    // Determino la lista opposta
    const otherList = listType === "watchedMovies" ? "toWatchMovies" : "watchedMovies";

    // Rimuovo il film dalla lista opposta, se presente
    author[otherList] = author[otherList].filter((m) => m.id !== movie.id);

    // Aggiungo il film alla lista scelta solo se non già presente
    if (!author[listType].some((m) => m.id === movie.id)) {
      author[listType].push(movie);
    }

    await author.save();
    // Ritorno entrambe le liste per aggiornare il front-end
    res.json({
      watchedMovies: author.watchedMovies,
      toWatchMovies: author.toWatchMovies
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Errore nell'aggiunta del film alla watchlist" });
  }
};

// Rimuove un film da una watchlist specificata
exports.removeMovieFromWatchlist = async (req, res) => {
  try {
    const { listType, movieId } = req.body;
    if (!["watchedMovies", "toWatchMovies"].includes(listType)) {
      return res.status(400).json({ msg: "Invalid list type" });
    }

    const author = await Author.findById(req.user.id);
    if (!author) return res.status(404).json({ msg: "User not found" });

    author[listType] = author[listType].filter((m) => m.id !== movieId);
    await author.save();

    // Ritorno lista aggiornata
    res.json({
      watchedMovies: author.watchedMovies,
      toWatchMovies: author.toWatchMovies
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Errore nella rimozione del film dalla watchlist" });
  }
};
