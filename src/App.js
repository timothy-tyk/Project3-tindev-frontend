import React, { createContext, useContext } from "react";
import { useEffect, useState } from "react";
import logo from "./logo.png";
import "./App.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import SingleLobby from "./components/SingleLobby";
import Questions from "./components/SingleQuestion";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import { useAuth0 } from "@auth0/auth0-react";
import Auth0ProviderWithHistory from "./auth/auth0-provider-with-history.js";
import PostQuestion from "./components/PostQuestion";
import SingleQuestion from "./components/SingleQuestion";
export const UserContext = createContext();

export default function App() {
  const { isAuthenticated, user, loginWithRedirect, login, loading, logout } =
    useAuth0();
  const navigate = useNavigate();
  const [userData, setUserData] = useState();

  const handleUserData = (data) => {
    console.log("updating user data");
    setUserData(data);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <UserContext.Provider value={userData}>
      <div className="App">
        <header className="App-header">
          <nav className="topNav">
            <Link to="/">Landing Page</Link>
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
            <Route
              path="/"
              element={<LandingPage handleSignIn={handleUserData} />}
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/profile"
              element={<Profile handleSignIn={handleUserData} />}
            />
            <Route path="/questions" element={<PostQuestion />} />
            <Route path="/questions/:questionId" element={<SingleQuestion />} />
            <Route path="/lobby" element={<SingleLobby />} />
          </Routes>
        </header>
      </div>
    </UserContext.Provider>
  );
}
