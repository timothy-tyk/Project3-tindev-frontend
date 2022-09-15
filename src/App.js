import React from "react";
import { useEffect } from "react";
import logo from "./logo.png";
import "./App.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import SingleLobby from "./components/SingleLobby";
import Questions from "./components/Questions";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import { useAuth0 } from "@auth0/auth0-react";
import Auth0ProviderWithHistory from "./auth/auth0-provider-with-history.js";

export default function App() {
  const { isAuthenticated, user, loginWithRedirect, login, loading, logout } =
    useAuth0();
  // useEffect(() => {
  //   console.log(isAuthenticated);
  // }, []);

  const navigate = useNavigate();

  // const checkUser = async () => {
  //   if (isAuthenticated) {
  //     console.log(user);
  //     await navigate("/landing");
  //   } else {
  //     loginWithRedirect();
  //   }
  // };
  const handleLogout = () => {
    logout();
  };

  // useEffect(() => {
  //   checkUser();
  // }, [isAuthenticated, loginWithRedirect]);

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <Link to="/">Landing Page</Link>
          <Link to="/landing">Landing Page</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/questions">Questions</Link>
          <Link to="/lobby">Lobby</Link>
          {user ? (
            <button
              onClick={() => {
                handleLogout();
              }}
            >
              Logout
            </button>
          ) : null}
        </nav>

        <Routes>
          <Route path="/" element={<LandingPage user={user} />} />
          <Route path="/landing" element={<LandingPage user={user} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/questions" element={<Questions user={user} />} />
          <Route path="/lobby" element={<SingleLobby user={user} />} />
        </Routes>
      </header>
    </div>
  );
}
