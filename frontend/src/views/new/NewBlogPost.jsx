// frontend/src/views/new/NewBlogPost.jsx
import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NewBlogPost = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  // Stati per il form dell'articolo
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    content: "",
    coverUrl: "",
  });

  // Stati per la ricerca film
  const [movieQuery, setMovieQuery] = useState("");
  const [movieResults, setMovieResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Cerca film tramite la tua API
  const handleMovieSearch = async (e) => {
    e.preventDefault();
    if (!movieQuery.trim()) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/movies/search?query=${encodeURIComponent(
          movieQuery
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setMovieResults(data.results || []);
    } catch (err) {
      console.error("Errore ricerca film:", err);
    }
  };

  // Seleziona un film dai risultati
  const selectMovie = (movie) => {
    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "";
    setSelectedMovie(movie);
    setFormData({
      ...formData,
      category: movie.title,
      coverUrl: poster,
    });
    setMovieResults([]);
    setMovieQuery("");
  };

  // Submit del post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Devi essere loggato per creare un articolo");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/blogPosts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) {
        console.error("Server error:", json);
        alert("Errore nella creazione del post");
        return;
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Errore nella creazione del post");
    }
  };

  return (
    <Container className="my-5">
      <h2>Nuovo Articolo</h2>

      {/* 1) Sezione di ricerca film */}
      <Form onSubmit={handleMovieSearch} className="mb-4">
        <Form.Group className="d-flex">
          <Form.Control
            type="text"
            placeholder="Cerca un film per usarne titolo e poster"
            value={movieQuery}
            onChange={(e) => setMovieQuery(e.target.value)}
          />
          <Button type="submit" variant="info" className="ms-2">
            Cerca film
          </Button>
        </Form.Group>
      </Form>

      {/* 2) Lista risultati film */}
      {movieResults.length > 0 && (
        <Row className="mb-4">
          {movieResults.map((m) => (
            <Col md={3} key={m.id} className="mb-3">
              <Card
                onClick={() => selectMovie(m)}
                style={{ cursor: "pointer" }}
              >
                {m.poster_path && (
                  <Card.Img
                    variant="top"
                    src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                    alt={m.title}
                  />
                )}
                <Card.Body>
                  <Card.Title className="fs-6">{m.title}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* 3) Preview del film selezionato */}
      {selectedMovie && (
        <div className="mb-4">
          <h5>Film selezionato:</h5>
          <p>
            <strong>{selectedMovie.title}</strong> (
            {selectedMovie.release_date})
          </p>
          {formData.coverUrl && (
            <img
              src={formData.coverUrl}
              alt={selectedMovie.title}
              style={{ maxWidth: 200, marginBottom: 10 }}
            />
          )}
        </div>
      )}

      {/* 4) Form vero e proprio per titolo e contenuto */}
      <Form onSubmit={handleSubmit}>
        {/* Categoria (disabilitata, arriva dal film) */}
        <Form.Group className="mt-2">
          <Form.Label>Categoria (film)</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={formData.category}
            disabled
          />
        </Form.Group>

        {/* Titolo dell'articolo */}
        <Form.Group className="mt-2">
          <Form.Label>Titolo dell'articolo</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </Form.Group>

        {/* Contenuto */}
        <Form.Group className="mt-2">
          <Form.Label>Contenuto</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            name="content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            required
          />
        </Form.Group>

        <Button type="submit" className="mt-3" variant="primary">
          Pubblica
        </Button>
      </Form>
    </Container>
  );
};

export default NewBlogPost;
