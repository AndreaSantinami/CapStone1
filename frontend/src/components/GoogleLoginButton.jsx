// frontend/src/components/GoogleLoginButton.jsx
import React from "react";
import { Button } from "react-bootstrap";

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Redirige l'utente all'endpoint di Google OAuth nel backend
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <Button variant="danger" onClick={handleGoogleLogin}>
      Continua con Google
    </Button>
  );
};

export default GoogleLoginButton;
