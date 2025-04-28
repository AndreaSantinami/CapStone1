// frontend/src/views/GoogleSuccess.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    if (token) {
      localStorage.setItem("accessToken", token);
      fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((meData) => {
          localStorage.setItem("userId", meData._id);
          localStorage.setItem("userName", meData.nome + " " + meData.cognome);
          navigate("/");
        })
        .catch((err) => {
          console.error("Errore nel recupero /me:", err);
          navigate("/");
        });
    } else {
      navigate("/");
    }
  }, [location, navigate]);

  return null;
};

export default GoogleSuccess;
