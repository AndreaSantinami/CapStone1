// frontend/src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./views/home/Home";
import Blog from "./views/blog/Blog";
import NewBlogPost from "./views/new/NewBlogPost";
import Profile from "./views/profile/Profile";            // Profilo del loggato (privato)
import ProfileDetail from "./views/profile/ProfileDetail"; // Profilo pubblico degli altri utenti
import Search from "./views/search/Search";
import GoogleSuccess from "./views/GoogleSuccess";
import BlogNavbar from "./components/navbar/BlogNavbar";
import Login from "./views/Login";
import Register from "./views/Register";
import MovieDetail from "./views/movie/MovieDetail";

function App() {
  return (
    <>
      <BlogNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/new" element={<NewBlogPost />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<ProfileDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/google/success" element={<GoogleSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </>
  );
}

export default App;
