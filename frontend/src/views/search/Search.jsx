// frontend/src/views/search/Search.jsx
import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { useLocation, useNavigate, Link } from "react-router-dom";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [movieResults, setMovieResults] = useState([]);
  const [authorResults, setAuthorResults] = useState([]);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("query");
    if (q) {
      setQuery(q);
      handleSearch(q);
    }
  }, [location.search]);

  const handleSearch = async (searchTerm) => {
    try {
      // Ricerca film tramite TMDB
      const filmRes = await fetch(
        `http://localhost:5000/api/movies/search?query=${encodeURIComponent(
          searchTerm
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const filmData = await filmRes.json();
      setMovieResults(filmData.results || []);

      // Ricerca utenti registrati (CineVerse)
      const authorsRes = await fetch(
        `http://localhost:5000/api/authors?search=${encodeURIComponent(
          searchTerm
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const authorsData = await authorsRes.json();
      setAuthorResults(Array.isArray(authorsData) ? authorsData : []);
    } catch (error) {
      console.error("Errore nella ricerca:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <Container className="my-5">
      <h2>Risultati della ricerca</h2>

      <Form onSubmit={handleSubmit} className="d-flex mb-4">
        <Form.Control
          type="search"
          placeholder="Cerca film o utenti..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" variant="primary" className="ms-2">
          Cerca
        </Button>
      </Form>

      <h4>Utenti Trovati</h4>
      {authorResults.length > 0 ? (
        <ul>
          {authorResults.map((author) => (
            <li key={author._id}>
              <Link to={`/profile/${author._id}`}>
                {author.nome} {author.cognome} - {author.email}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nessun utente trovato.</p>
      )}

      <hr />

      <h4>Film Trovati</h4>
      {movieResults.length > 0 ? (
        <Row>
          {movieResults.map((movie) => (
            <Col md={3} key={movie.id} className="mb-4">
              <Link
                to={`/movie/${movie.id}`}
                className="text-decoration-none text-dark"
              >
                <Card style={{ height: "100%" }}>
                  {movie.poster_path && (
                    <Card.Img
                      variant="top"
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                    />
                  )}
                  <Card.Body>
                    <Card.Title className="fs-6">{movie.title}</Card.Title>
                    <Card.Text className="text-muted small">
                      {movie.release_date}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      ) : (
        <p>Nessun film trovato.</p>
      )}
    </Container>
  );
};

export default Search;
