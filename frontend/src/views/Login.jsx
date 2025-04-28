// frontend/src/views/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import GoogleLoginButton from "../components/GoogleLoginButton";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.msg || "Errore nel login");
        return;
      }
      // Salva il token in localStorage
      localStorage.setItem("accessToken", data.token);
      // Recupera i dati utente
      const meRes = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const meData = await meRes.json();
      localStorage.setItem("userId", meData._id);
      localStorage.setItem("userName", meData.nome + " " + meData.cognome);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Errore nel login");
    }
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </Form.Group>
        <Button type="submit">Accedi</Button>
      </Form>
      <hr />
      <GoogleLoginButton />
    </Container>
  );
};

export default Login;
