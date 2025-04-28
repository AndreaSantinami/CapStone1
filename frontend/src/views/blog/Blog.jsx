// frontend/src/views/blog/Blog.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // ← Link importato
import {
  Container,
  Button,
  Form,
  Card,
  ListGroup,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import BlogLike from "../../components/likes/BlogLikes";

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const token = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  // Carica dettagli del post
  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/blogPosts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Errore fetch post");
      const data = await res.json();
      setPost(data);
      setComments(data.comments || []);
      setEditData({ title: data.title, content: data.content });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Carica il profilo dell'utente loggato
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Errore fetch utente");
      const data = await res.json();
      setCurrentUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
      fetchPost();
    }
  }, [id, token]);

  if (loading)
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );
  if (!post) return <Container className="my-5">Post non trovato</Container>;

  const isAuthor = post.author._id === userId;

  // elimina post
  const handleDelete = async () => {
    if (!window.confirm("Sei sicuro di voler cancellare?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/blogPosts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.msg || "Errore eliminazione");
        return;
      }
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Errore nella cancellazione");
    }
  };

  // salva modifica post
  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/blogPosts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error("Errore modifica");
      setEditMode(false);
      fetchPost();
    } catch (err) {
      console.error(err);
      alert("Errore nella modifica");
    }
  };

  // invio commento
  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    try {
      const authorName = `${currentUser.nome} ${currentUser.cognome}`;
      const res = await fetch(
        `http://localhost:5000/api/blogPosts/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: newComment, authorName }),
        }
      );
      if (!res.ok) throw new Error("Errore invio commento");
      const created = await res.json();
      setComments((prev) => [...prev, created]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("Errore invio commento");
    }
  };

  // inizia modifica commento
  const startEditComment = (c) => {
    setEditingId(c._id);
    setEditingText(c.text);
  };

  // salva commento modificato
  const saveEditedComment = async (commentId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/blogPosts/${id}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: editingText }),
        }
      );
      if (!res.ok) throw new Error("Errore modifica commento");
      const updated = await res.json();
      setComments((prev) => prev.map((c) => (c._id === commentId ? updated : c)));
      setEditingId(null);
      setEditingText("");
    } catch (err) {
      console.error(err);
      alert("Errore modifica commento");
    }
  };

  // cancella commento
  const deleteComment = async (commentId) => {
    if (!window.confirm("Eliminare questo commento?")) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/blogPosts/${id}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Errore cancellazione commento");
      await res.json();
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
      alert("Errore cancellazione commento");
    }
  };

  return (
    <Container className="my-5">
      {/* copertina */}
      {post.cover && (
        <img
          src={
            post.cover.startsWith("http")
              ? post.cover
              : `https://image.tmdb.org/t/p/w500${post.cover}`
          }
          alt={post.category}
          className="img-fluid mb-4 rounded"
        />
      )}

      {/* categoria */}
      <h5 className="text-muted">{post.category}</h5>

      {/* edit mode / read mode */}
      {editMode ? (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Titolo</Form.Label>
            <Form.Control
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contenuto</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={editData.content}
              onChange={(e) => setEditData({ ...editData, content: e.target.value })}
            />
          </Form.Group>
          <Button variant="success" onClick={handleSave} className="me-2">
            Salva
          </Button>
          <Button variant="secondary" onClick={() => setEditMode(false)}>
            Annulla
          </Button>
        </>
      ) : (
        <>
          <h2>{post.title}</h2>
          <p>
            <strong>Autore:</strong>{" "}
            <Link to={`/profile/${post.author._id}`} className="text-decoration-none">
              {post.author.nome} {post.author.cognome}
            </Link>
          </p>
          <hr />
          <p>{post.content}</p>

          <BlogLike
            defaultLikes={post.likes || []}
            onChange={async () => {
              await fetch(`http://localhost:5000/api/blogPosts/${id}/likes`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
              });
              fetchPost();
            }}
          />

          {isAuthor && (
            <div className="mt-3">
              <Button variant="warning" className="me-2" onClick={() => setEditMode(true)}>
                Modifica
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Elimina
              </Button>
            </div>
          )}
        </>
      )}

      <hr className="my-4" />

      {/* commenti */}
      <h4>Commenti</h4>
      <ListGroup className="mb-3">
        {comments.length === 0 && <p>Nessun commento.</p>}
        {comments.map((c) => (
          <ListGroup.Item key={c._id}>
            {editingId === c._id ? (
              <InputGroup>
                <Form.Control
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <Button variant="success" onClick={() => saveEditedComment(c._id)}>
                  Salva
                </Button>
                <Button variant="secondary" onClick={() => setEditingId(null)}>
                  Annulla
                </Button>
              </InputGroup>
            ) : (
              <>
                {/* qui rendiamo cliccabile il nome */}
                <strong>
                  <Link to={`/profile/${c.authorId}`} className="text-decoration-none">
                    {c.authorName}
                  </Link>
                </strong>
                : {c.text}
                {c.authorId === userId && (
                  <span className="float-end">
                    <Button
                      size="sm"
                      variant="outline-warning"
                      className="me-1"
                      onClick={() => startEditComment(c)}
                    >
                      Modifica
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => deleteComment(c._id)}
                    >
                      Elimina
                    </Button>
                  </span>
                )}
              </>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* form nuovo commento */}
      <Form onSubmit={submitComment} className="mb-5">
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Scrivi un commento..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-2">
          Invia Commento
        </Button>
      </Form>

      {/* torna indietro */}
      <Button variant="secondary" onClick={() => navigate(-1)}>
        ← Torna indietro
      </Button>
    </Container>
  );
};

export default Blog;
