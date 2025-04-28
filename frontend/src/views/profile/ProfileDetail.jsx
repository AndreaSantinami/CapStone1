// frontend/src/views/profile/ProfileDetail.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Carousel } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

// helper to chunk array into pages
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
};

const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch user profile
        const resUser = await fetch(`/api/authors/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resUser.ok) throw new Error(`Err user: ${resUser.status}`);
        const dataUser = await resUser.json();
        setUser(dataUser);

        // fetch posts
        const resPosts = await fetch(`/api/blogPosts`);
        if (!resPosts.ok) throw new Error(`Err posts: ${resPosts.status}`);
        const all = await resPosts.json();
        setPosts(all.filter(p => p.author._id === id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [id, token]);

  if (!user) return <Container className="my-5 text-center"><Spinner animation="border" /></Container>;

  // render carousel of movies
  const renderCarousel = (movies) => {
    const pages = chunkArray(movies, 4);
    return (
      <Carousel indicators={false} interval={null} className="mb-4"
        prevIcon={<span className="carousel-control-prev-icon" style={{ backgroundColor:'rgba(0,0,0,0.4)',borderRadius:'50%',width:'2rem',height:'2rem' }}/>} 
        nextIcon={<span className="carousel-control-next-icon" style={{ backgroundColor:'rgba(0,0,0,0.4)',borderRadius:'50%',width:'2rem',height:'2rem' }}/>}>
        {pages.map((chunk, idx) => (
          <Carousel.Item key={idx}>
            <Row className="justify-content-start">
              {chunk.map((movie, i) => {
                const img = movie.poster_path ?
                  `https://image.tmdb.org/t/p/w300${movie.poster_path}` : movie.coverUrl;
                return (
                  <Col key={i} xs={6} md={3} className="mb-3">
                    <Card className="h-100" style={{cursor:'pointer'}} onClick={()=>navigate(`/movie/${movie.id}`)}>
                      {img && <Card.Img variant="top" src={img} />}
                      <Card.Body className="p-2">
                        <Card.Title className="fs-6 text-truncate mb-0">{movie.title}</Card.Title>
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
      <img src={user.avatar||"defaultAvatarURL"} alt="Avatar" style={{width:150,borderRadius:'50%'}} className="mb-2"/>
      <p><strong>Email:</strong> {user.email}</p>

      <h3 className="mt-4">Watchlist – Visti</h3>
      {user.watchedMovies?.length>0 ? renderCarousel(user.watchedMovies) : <p>Nessun film segnato come “Visti”.</p>}

      <h3 className="mt-4">Watchlist – Da vedere</h3>
      {user.toWatchMovies?.length>0 ? renderCarousel(user.toWatchMovies) : <p>Nessun film in “Da vedere”.</p>}

      <h3 className="mt-4">I suoi post</h3>
      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : posts.length>0 ? (
        <Row className="gy-4">
          {posts.map(post=> (
            <Col key={post._id} xs={12} md={6} lg={4}>
              <Card className="h-100" style={{cursor:'pointer'}} onClick={()=>navigate(`/blog/${post._id}`)}>
                {post.cover && <Card.Img variant="top" src={post.cover} style={{width:'100%',height:'auto'}} alt={post.title}/>}
                <Card.Body>
                  <Card.Title className="fs-5">{post.title}</Card.Title>
                  <Card.Text className="text-truncate">{post.content}</Card.Text>
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

export default ProfileDetail;
