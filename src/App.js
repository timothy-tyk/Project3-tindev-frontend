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
import Chatroom from "./components/Chatroom";
export const UserContext = createContext();

export default function App() {
  const { isAuthenticated, user, loginWithRedirect, login, loading, logout } =
    useAuth0();
  const navigate = useNavigate();
  const [userData, setUserData] = useState();

  const handleUserData = (data) => {
    console.log("updating user data", data);
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
            {/* Questions accessed from dashboard */}
            {/* <Link to="/questions">Questions</Link> */}
            {/* /lobby path not needed here */}
            {/* <Link to="/lobby">Lobby</Link> */}
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
            <Route
              path="/dashboard"
              element={<Dashboard handleUpdateUser={handleUserData} />}
            />
            <Route
              path="/profile"
              element={<Profile handleSignIn={handleUserData} />}
            />
            {/*Tim: i change the /question route element here to PostQuestion & added questionId}
            {/* <Route path="/questions" element={<Questions />} /> */}
            {/* /lobby path not needed here */}
            {/* <Route path="/lobby" element={<SingleLobby />} /> */}
            {/* <Route path="/lobbies/:lobbyId" element={<SingleLobby />} />
            <Route path="/questions/:questionId" element={<SingleQuestion />} />
            <Route
              path="/questions/:questionId/chatroom"
              element={<Chatroom />}
            /> */}
            {/* Proposed new routes */}
            <Route path="/lobbies/:lobbyId" element={<SingleLobby />} />
            <Route
              path="/lobbies/:lobbyId/questions/:questionId"
              element={<SingleQuestion />}
            />
            <Route
              path="/lobbies/:lobbyId/questions/:questionId/chatroom"
              element={<Chatroom />}
            />
          </Routes>
        </header>
      </div>
    </UserContext.Provider>
  );
}
