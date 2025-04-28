// frontend/src/views/home/Home.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/blogPosts");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <Container className="my-5">
      <div className="d-flex align-items-center mb-4">
        <h1 className="me-auto">Benvenuto su CineVerse</h1>
        <Button as={Link} to="/new" variant="success">
          Nuovo Post
        </Button>
      </div>

      <Form onSubmit={handleSearch} className="d-flex mb-4">
        <Form.Control
          type="search"
          placeholder="Cerca film o utenti..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" variant="primary" className="ms-2">
          Cerca
        </Button>
      </Form>

      <Row>
        {posts.map((post) => (
          <Col md={4} key={post._id} className="mb-4">
            <Card
              onClick={() => navigate(`/blog/${post._id}`)}
              style={{ cursor: "pointer", height: "100%" }}
            >
              {/* Copertina del film, se necessario aggiungo il base-url TMDB */}
              {post.cover && (
                <Card.Img
                  variant="top"
                  src={
                    post.cover.startsWith("http")
                      ? post.cover
                      : `https://image.tmdb.org/t/p/w500${post.cover}`
                  }
                  alt={post.category}
                />
              )}

              <Card.Body className="d-flex flex-column">
                {/* Nome del film (categoria) */}
                <Card.Subtitle className="mb-2 text-muted">
                  {post.category}
                </Card.Subtitle>

                {/* Titolo dell'articolo */}
                <Card.Title>{post.title}</Card.Title>

                {/* Contenuto troncato */}
                <Card.Text className="flex-grow-1">
                  {post.content.length > 100
                    ? post.content.slice(0, 100) + "…"
                    : post.content}
                </Card.Text>
              </Card.Body>

              <Card.Footer className="d-flex justify-content-between align-items-center">
                {/* Creatore */}
                <small className="text-muted">
                  di {post.author?.nome} {post.author?.cognome}
                </small>

                {/* Numero di like */}
                <small className="text-muted">
                  {Array.isArray(post.likes) ? post.likes.length : 0} like
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;
