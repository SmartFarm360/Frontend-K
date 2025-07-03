"use client";

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import MainLayout from "./components/MainLayout";
import About from "./components/About";
import Dashboard from "./components/Dashboard";
import DroneDashboard from "./components/DroneDashboard";
import History from "./components/History";
import Language from "./components/Language";
import Profile from "./components/Profile";
import Blog from "./components/Blog"; 

import axios from "axios";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    const savedLang = localStorage.getItem("selectedLanguage");

    if (authStatus === "true") setIsAuthenticated(true);
    if (role) setUserRole(role);
    if (savedLang) setCurrentLanguage(savedLang);
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        credentials
      );
      if (response.data?.token && response.data?.role) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", response.data.role);
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        setUserRole(response.data.role);
      } else {
        alert("Login failed: Invalid response from server.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(
        "Login failed: " + (error.response?.data?.message || "Server error")
      );
    }
  };

  const handleRegister = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data?.message) {
        alert("Registration successful. You can now login.");
      } else {
        alert("Registration failed: Invalid response from server.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(
        "Registration failed: " +
          (error.response?.data?.message || "Server error")
      );
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole("");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
  };

  const redirectDashboard = () => {
    switch (userRole) {
      // case "admin":
      //   return "/AdminDashboard";
      case "drone_controller":
        return "/DroneDashboard";
      case "farmer":
        return "/dashboard";
      default:
        return "/login";
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login
                  onLogin={handleLogin}
                  currentLanguage={currentLanguage}
                />
              ) : (
                <Navigate to={redirectDashboard()} />
              )
            }
          />

          <Route
            path="/register"
            element={
              !isAuthenticated ? (
                <Register
                  onRegister={handleRegister}
                  currentLanguage={currentLanguage}
                />
              ) : (
                <Navigate to={redirectDashboard()} />
              )
            }
          />

          <Route
            path="/language"
            element={
              <Language
                currentLanguage={currentLanguage}
                setCurrentLanguage={setCurrentLanguage}
                onClose={() => {}}
              />
            }
          />

          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <MainLayout
                  isAuthenticated={isAuthenticated}
                  onLogout={handleLogout}
                  currentLanguage={currentLanguage}
                  setCurrentLanguage={setCurrentLanguage}
                >
                  <Profile currentLanguage={currentLanguage} />
                </MainLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/blog"
            element={
              <MainLayout
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
                currentLanguage={currentLanguage}
                setCurrentLanguage={setCurrentLanguage}
              >
                <Blog currentLanguage={currentLanguage} />
              </MainLayout>
            }
          />

          <Route
            path="/dashboard"
            element={
              isAuthenticated && userRole === "farmer" ? (
                <MainLayout
                  isAuthenticated={isAuthenticated}
                  onLogout={handleLogout}
                  currentLanguage={currentLanguage}
                  setCurrentLanguage={setCurrentLanguage}
                >
                  <Dashboard currentLanguage={currentLanguage} />
                </MainLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/DroneDashboard"
            element={
              isAuthenticated && userRole === "drone_controller" ? (
                <MainLayout
                  isAuthenticated={isAuthenticated}
                  onLogout={handleLogout}
                  currentLanguage={currentLanguage}
                  setCurrentLanguage={setCurrentLanguage}
                >
                  <DroneDashboard currentLanguage={currentLanguage} />
                </MainLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/"
            element={
              <MainLayout
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
                currentLanguage={currentLanguage}
                setCurrentLanguage={setCurrentLanguage}
              >
                <Home currentLanguage={currentLanguage} />
              </MainLayout>
            }
          />

          <Route
            path="/about"
            element={
              <MainLayout
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
                currentLanguage={currentLanguage}
                setCurrentLanguage={setCurrentLanguage}
              >
                <About currentLanguage={currentLanguage} />
              </MainLayout>
            }
          />

          <Route
            path="/history"
            element={
              <MainLayout
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
                currentLanguage={currentLanguage}
                setCurrentLanguage={setCurrentLanguage}
              >
                <History currentLanguage={currentLanguage} />
              </MainLayout>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
