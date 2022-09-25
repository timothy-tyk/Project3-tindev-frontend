import React, { createContext, useContext } from "react";
import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import SingleLobby from "./components/SingleLobby";
import Questions from "./components/xSingleQuestion";
import EditProfile from "./components/EditProfile";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import { useAuth0 } from "@auth0/auth0-react";
import Auth0ProviderWithHistory from "./auth/auth0-provider-with-history.js";
import PostQuestion from "./components/xPostQuestion";
import SingleQuestion from "./components/SingleQuestion";
import Chatroom from "./components/Chatroom";
import axios from "axios";
import { BACKEND_URL } from "./constants";
import SingleQuestionTwo from "./components/SingleQuestionTwo";

export const UserContext = createContext();

export default function App() {
  const { isAuthenticated, user, loginWithRedirect, login, loading, logout } =
    useAuth0();
  const navigate = useNavigate();
  const [userData, setUserData] = useState();

  const handleUserData = (data) => {
    setUserData(data);
  };

  const updateUserLocationOnLogOut = async () => {
    const body = {
      userId: userData.id,
    };
    axios.put(`${BACKEND_URL}/lobbies/logout`, body).then((res) => {
      console.log("res success", res.data);
      logout();
    });
  };

  const handleLogout = () => {
    updateUserLocationOnLogOut();
  };

  return (
    <UserContext.Provider value={userData}>
      <div className="App">
        <header className="App-header">
          <div className="main"> </div>
          <nav className="topNav">
            <Link to="/">Landing Page</Link>
            <Link to="/dashboard">Dashboard</Link>
            {/* <Link to="/editprofile">Profile</Link> */}
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
              path="/editprofile"
              element={<EditProfile handleSignIn={handleUserData} />}
            />
            <Route
              path="/users/:profileId"
              element={<Profile handleUpdateUser={handleUserData} />}
            />
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
