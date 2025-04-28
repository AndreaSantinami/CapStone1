// backend/routes/blogPosts.js
const express = require("express");
const router = express.Router();
const blogPostsController = require("../controllers/blogPostsController");
const authMiddleware = require("../middleware/auth");

// Crea un nuovo post (category, title, content, coverUrl arrivano dal body)
router.post("/", authMiddleware, blogPostsController.createBlogPost);

// Leggi tutti i post
router.get("/", blogPostsController.getBlogPosts);

// Leggi un singolo post
router.get("/:id", blogPostsController.getBlogPostById);

// Aggiorna un post
router.put("/:id", authMiddleware, blogPostsController.updateBlogPost);

// Elimina un post
router.delete("/:id", authMiddleware, blogPostsController.deleteBlogPost);

// Rotte per i commenti
router.post("/:id/comments", authMiddleware, blogPostsController.addComment);
router.put(
  "/:id/comments/:commentId",
  authMiddleware,
  blogPostsController.updateComment
);
router.delete(
  "/:id/comments/:commentId",
  authMiddleware,
  blogPostsController.deleteComment
);

// Toggle dei like
router.post("/:id/likes", authMiddleware, blogPostsController.toggleLike);

module.exports = router;
