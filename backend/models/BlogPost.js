// backend/models/BlogPost.js
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    authorName: { type: String, required: true },
    authorId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const BlogPostSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  cover: { type: String, default: "" },
  readTime: {
    value: { type: Number },
    unit: { type: String },
  },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: String }],  // userId che hanno messo like
  createdAt: { type: Date, default: Date.now },
});



module.exports = mongoose.model("BlogPost", BlogPostSchema);
