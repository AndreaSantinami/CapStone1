// backend/controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Author = require("../models/Author");

exports.register = async (req, res) => {
  const { nome, cognome, email, dataDiNascita, password } = req.body;
  try {
    let author = await Author.findOne({ email });
    if (author) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    author = new Author({
      nome,
      cognome,
      email,
      dataDiNascita,
      password: hashedPassword,
    });
    await author.save();

    const payload = { user: { id: author.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const author = await Author.findOne({ email });
    if (!author) return res.status(400).json({ msg: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, author.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { user: { id: author.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.getMe = async (req, res) => {
  try {
    const author = await Author.findById(req.user.id).select("-password");
    res.json(author);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
