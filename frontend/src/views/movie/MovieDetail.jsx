// frontend/src/views/movie/MovieDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner, Button, Card, Row, Col } from "react-bootstrap";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // 1) Fetch dettagli film
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/movies/details/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, token]);

  // 2) Fetch articoli correlati
  useEffect(() => {
    if (!movie) return;
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/blogPosts");
        const all = await res.json();
        setPosts(all.filter((p) => p.category === movie.title));
      } catch (err) {
        console.error(err);
      } finally {
        setPostsLoading(false);
      }
    };
    fetchPosts();
  }, [movie]);

  const addToWatchlist = async (listType) => {
    if (!token) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/profile/watchlist/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ movie, listType }),
        }
      );
      if (!res.ok) throw new Error("Failed");
      alert(
        listType === "toWatchMovies"
          ? "Aggiunto alla lista \"Da vedere\"!"
          : "Aggiunto alla lista \"Visti\"!"
      );
    } catch (err) {
      console.error(err);
      alert("Errore durante l'aggiunta alla watchlist");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (!movie) return <div>Film non trovato</div>;

  return (
    <div className="container my-5">
      {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="img-fluid mb-4 rounded"
        />
      )}

      <h2>{movie.title}</h2>
      <p>
        <strong>Data uscita:</strong> {movie.release_date}
      </p>
      <p>
        <strong>Voto:</strong> {movie.vote_average}
      </p>
      <p>{movie.overview}</p>

      {/* Pulsanti per watchlist */}
      <div className="d-flex mb-5">
        <Button
          variant="primary"
          disabled={adding}
          onClick={() => addToWatchlist("toWatchMovies")}
          className="me-2"
        >
          {adding ? "..." : "Aggiungi a Da vedere"}
        </Button>
        <Button
          variant="success"
          disabled={adding}
          onClick={() => addToWatchlist("watchedMovies")}
        >
          {adding ? "..." : "Aggiungi a Visti"}
        </Button>
      </div>

      <hr />

      <h3>Articoli su “{movie.title}”</h3>
      {postsLoading ? (
        <Spinner animation="border" />
      ) : posts.length > 0 ? (
        <Row className="gy-4">
          {posts.map((post) => (
            <Col md={4} key={post._id}>
              <Card>
                {post.cover && (
                  <Card.Img
                    variant="top"
                    src={post.cover}
                    alt={post.title}
                  />
                )}
                <Card.Body>
                  <Card.Title
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/blog/${post._id}`)}
                  >
                    {post.title}
                  </Card.Title>
                  <Card.Text className="text-truncate">
                    {post.content}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>Nessun articolo creato per questo film.</p>
      )}
    </div>
  );
};

export default MovieDetail;
