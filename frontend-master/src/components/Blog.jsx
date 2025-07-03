// Blog.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Blog.css";
import { FiBell } from "react-icons/fi";
import { MdAdd } from "react-icons/md";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState("forYou");
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/blog")
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleCreateClick = () => {
    setIsEditing(true);
    setTitle("");
    setContent("");
  };

  const handleSave = () => {
    const newBlog = { title, content, author: "currentUser", likes: 0, comments: [], image: "", featured: false };
    axios.post("http://localhost:5000/api/blog", newBlog)
      .then((res) => {
        setBlogs([...blogs, res.data]);
        setIsEditing(false);
      })
      .catch((err) => console.error(err));
  };

  if (isEditing) {
    return (
      <div className="editor-page">
        <div className="editor-nav">
          <h1 className="logo">WRITE YOURS....</h1>
          {/* <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#dashboard">Dashboard</a>
            <a href="#blog">blog</a>
            <a href="#history">History</a>
            <button className="login-btn">Login</button>
          </div> */}
        </div>
        <div className="editor-container">
          <input
            type="text"
            className="editor-title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="editor-content"
            placeholder="Tell your story..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {/* <div className="editor-toolbar">
            <button>B</button>
            <button>I</button>
            <button onClick={() => document.execCommand("insertHTML", false, "<s></s>")}>S</button>
            <button onClick={() => document.execCommand("createLink", false, prompt("Enter URL"))}>Link</button>
            <button onClick={() => document.execCommand("insertOrderedList")}>OL</button>
            <button onClick={() => document.execCommand("insertUnorderedList")}>UL</button>
          </div> */}
          <div className="editor-actions">
            <button className="publish-btn" onClick={handleSave}>Publish</button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      {/* Top Navigation Bar */}
      <div className="top-nav">
        <h1 className="logo">SmartFarm Feeds</h1>
        <input type="text" className="search-bar" placeholder="Search..." />
        <div className="top-icons">
          <button className="create-btn" onClick={handleCreateClick}>
            <MdAdd size={20} /> Create Yours
          </button>
          <FiBell size={24} className="bell-icon" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs">
        <span
          className={`tab ${activeTab === "forYou" ? "active" : ""}`}
          onClick={() => handleTabClick("forYou")}
        >
          For You
        </span>
        <span
          className={`tab ${activeTab === "featured" ? "active" : ""}`}
          onClick={() => handleTabClick("featured")}
        >
          Featured
        </span>
      </div>

      {/* Blog Cards */}
      <div className="blog-list">
        {blogs
          .filter((blog) => {
            if (activeTab === "forYou") return true;
            if (activeTab === "featured") return blog.featured || false;
            return true;
          })
          .map((blog) => (
            <div className="blog-entry hover-card" key={blog._id}>
              <div className="blog-text">
                <div className="blog-meta-top">
                  <span className="blog-author">In SmartFarm by @{blog.author}</span>
                </div>
                <h2 className="blog-title">{blog.title || blog.content.slice(0, 50)}</h2>
                <p className="blog-description">
                  {blog.content.length > 100
                    ? blog.content.slice(0, 100) + "..."
                    : blog.content}
                </p>
                <div className="blog-meta">
                  <span>❤️ {blog.likes || 0}</span>
                  <span>💬 {blog.comments?.length || 0}</span>
                </div>
              </div>
              <div className="blog-image-wrapper">
                <img
                  src={blog.image || "https://via.placeholder.com/150"}
                  alt="Blog Visual"
                  className="blog-image-preview"
                />
              </div>
              {activeTab === "forYou" && (
                <span className="show-less" onClick={() => handleTabClick("featured")}>
                  Show less this
                </span>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Blog;