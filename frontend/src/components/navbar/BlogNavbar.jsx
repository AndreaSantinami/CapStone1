// frontend/src/components/navbar/BlogNavbar.jsx
import React from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const BlogNavbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          CineVerse
        </Navbar.Brand>
        <div>
          {token ? (
            <>
              <Button variant="outline-info" onClick={() => navigate("/profile")}>
                Profilo
              </Button>
              <Button variant="outline-danger" onClick={handleLogout} className="ms-2">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline-primary" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button variant="outline-success" onClick={() => navigate("/register")} className="ms-2">
                Registrati
              </Button>
            </>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default BlogNavbar;
