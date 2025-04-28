// backend/controllers/blogPostsController.js
const BlogPost = require("../models/BlogPost");
const cloudinary = require("../config/cloudinary");

// Crea un nuovo post
exports.createBlogPost = async (req, res) => {
  try {
    const authorId = req.user.id;
    const { category, title, content, coverUrl } = req.body;
    const cover = coverUrl || "";

    const newPost = new BlogPost({
      category,
      title,
      content,
      cover,
      author: authorId,
      likes: [],
      comments: [],
    });

    const savedPost = await newPost.save();
    return res.status(201).json(savedPost);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Errore nella creazione del post" });
  }
};

// Ottieni tutti i post
exports.getBlogPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .populate("author", "-password")
      .sort({ createdAt: -1 });
    return res.json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Dettaglio di un singolo post
exports.getBlogPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate(
      "author",
      "-password"
    );
    if (!post) return res.status(404).json({ msg: "Post not found" });
    return res.json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Aggiorna un post
exports.updateBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not authorized" });

    const { category, title, content, coverUrl } = req.body;
    if (category) post.category = category;
    if (title) post.title = title;
    if (content) post.content = content;
    if (coverUrl) post.cover = coverUrl;

    const updated = await post.save();
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Elimina un post
exports.deleteBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not authorized to delete this post" });

    await BlogPost.findByIdAndDelete(req.params.id);
    return res.json({ msg: "Post deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Aggiungi commento
exports.addComment = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    post.comments.push({
      text: req.body.text,
      authorName: req.body.authorName,
      authorId: req.user.id,
    });
    await post.save();
    return res.status(201).json(post.comments.at(-1));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Modifica commento
exports.updateComment = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });
    if (comment.authorId.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not authorized to edit this comment" });

    comment.text = req.body.text || comment.text;
    await post.save();
    return res.json(comment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Elimina commento
exports.deleteComment = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });
    if (comment.authorId.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not authorized to delete this comment" });

    await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $pull: { comments: { _id: comment._id } } },
    );
    return res.json({ msg: "Comment deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Toggle like atomico
exports.toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const hasLiked = await BlogPost.exists({ _id: postId, likes: userId });
    const update = hasLiked
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } };

    const updatedPost = await BlogPost.findByIdAndUpdate(
      postId,
      update,
      { new: true }
    ).select("likes");

    if (!updatedPost) {
      return res.status(404).json({ msg: "Post not found" });
    }
    return res.json(updatedPost.likes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};
