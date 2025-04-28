// frontend/src/views/profile/Profile.jsx
import React, { useEffect, useState } from "react";
import { Container, Card, Button, Spinner, Carousel, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Err: ${res.status}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Errore fetch profile:", err);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/blogPosts");
        if (!res.ok) throw new Error(`Err: ${res.status}`);
        const all = await res.json();
        setPosts(all.filter((p) => p.author._id === userId));
      } catch (err) {
        console.error("Errore fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
      fetchPosts();
    }
  }, [token, userId]);

  const handleDelete = async (postId) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo post?")) return;
    try {
      const res = await fetch(`/api/blogPosts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Err: ${res.status}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Errore delete post:", err);
    }
  };

  if (!user) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  const renderCarousel = (movies) => {
    const chunks = chunkArray(movies, 4);
    return (
      <Carousel
        indicators={false}
        interval={null}
        className="mb-4"
        prevIcon={
          <span
            className="carousel-control-prev-icon"
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderRadius: '50%',
              width: '2rem',
              height: '2rem'
            }}
          />
        }
        nextIcon={
          <span
            className="carousel-control-next-icon"
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderRadius: '50%',
              width: '2rem',
              height: '2rem'
            }}
          />
        }
      >
        {chunks.map((group, idx) => (
          <Carousel.Item key={idx}>
            <Row className="justify-content-start">
              {group.map((movie, i) => {
                const img = movie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : movie.coverUrl;
                return (
                  <Col key={i} xs={6} md={3} className="d-flex mb-3">
                    <Card
                      className="flex-fill"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                      {img && <Card.Img variant="top" src={img} />}
                      <Card.Body className="p-2">
                        <Card.Title className="fs-6 text-truncate mb-0">
                          {movie.title}
                        </Card.Title>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
    );
  };

  return (
    <Container className="my-5">
      <h2>{user.nome} {user.cognome}</h2>
      <img
        src={user.avatar || "defaultAvatarURL"}
        alt="Avatar"
        style={{ width: 150, borderRadius: '50%' }}
      />
      <p className="mt-2"><strong>Email:</strong> {user.email}</p>

      {/* Watchlist – Visti */}
      <h3 className="mt-4">Watchlist – Visti</h3>
      {user.watchedMovies?.length > 0 ? (
        renderCarousel(user.watchedMovies)
      ) : (
        <p>Nessun film segnato come “Visti”.</p>
      )}

      {/* Watchlist – Da vedere */}
      <h3 className="mt-4">Watchlist – Da vedere</h3>
      {user.toWatchMovies?.length > 0 ? (
        renderCarousel(user.toWatchMovies)
      ) : (
        <p>Nessun film in “Da vedere”.</p>
      )}

      {/* I miei post */}
      <h3 className="mt-4">I miei post</h3>
      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : posts.length > 0 ? (
        <Row className="gy-4">
          {posts.map((post) => (
            <Col key={post._id} xs={12} md={6} lg={4}>
              <Card className="h-100">
                {post.cover && (
                  <Card.Img
                    variant="top"
                    src={post.cover}
                    alt={post.title}
                    style={{ width: '100%', height: 'auto' }}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title
                    className="fs-5"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/blog/${post._id}`)}
                  >{post.title}</Card.Title>
                  <Card.Text className="flex-grow-1 text-truncate">
                    {post.content}
                  </Card.Text>
                  <div className="mt-auto d-flex justify-content-between">
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => navigate(`/blog/${post._id}`)}
                    >Modifica</Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(post._id)}
                    >Elimina</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>Nessun post creato.</p>
      )}
    </Container>
  );
};

export default Profile;
