// backend/controllers/authorsController.js
const Author = require("../models/Author");

exports.searchAuthors = async (req, res) => {
  try {
    const search = req.query.search;
    if (!search)
      return res.status(400).json({ msg: "Inserisci un termine di ricerca" });

    const query = {
      $or: [
        { nome: { $regex: search, $options: "i" } },
        { cognome: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const authors = await Author.find(query).select("-password");
    res.json(authors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Errore nella ricerca degli utenti" });
  }
};

exports.getAuthorById = async (req, res) => {
  try {
    // Non usiamo authMiddleware per questo endpoint, così il profilo è pubblico.
    const author = await Author.findById(req.params.id).select("-password");
    if (!author) return res.status(404).json({ msg: "Profilo non trovato" });
    res.json(author);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
