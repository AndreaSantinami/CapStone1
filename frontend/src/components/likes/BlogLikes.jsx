// frontend/src/components/likes/BlogLikes.jsx
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { AiOutlineLike } from "react-icons/ai";

const yourUserId = "123"; // Sostituisci con la logica utente reale

const BlogLikes = ({ defaultLikes, onChange }) => {
  const [likes, setLikes] = useState(defaultLikes);
  const iLikedThisArticle = likes.includes(yourUserId);

  const toggleLike = () => {
    if (iLikedThisArticle) {
      setLikes(likes.filter((id) => id !== yourUserId));
    } else {
      setLikes([...likes, yourUserId]);
    }
    onChange && onChange(likes);
  };

  useEffect(() => {
    onChange && onChange(likes);
  }, [iLikedThisArticle]);

  return (
    <Button onClick={toggleLike} variant={iLikedThisArticle ? "dark" : "outline-dark"}>
      <AiOutlineLike /> {`${likes.length} like`}
    </Button>
  );
};

export default BlogLikes;
