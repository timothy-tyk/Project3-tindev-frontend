import React, { createContext, useContext } from "react";
import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import SingleLobby from "./components/SingleLobby";
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

import SingleQuestionTwo from "./components/xSingleQuestionTwo";

//MUI
import { AppBar, Typography, Grid, Button } from "@mui/material";
import EditProfileModalDialogs from "./components/EditProfileModal";

export const UserContext = createContext();

export default function App() {
  const { isAuthenticated, user, loginWithRedirect, login, loading, logout } =
    useAuth0();
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [refresh, setRefresh] = useState();
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
          <AppBar className="topNav" color="black">
            <Grid container>
              <Grid item xs={6} className="links left-link">
                <Button>
                  <Link className="links left-link" to="/dashboard">
                    <Typography color="primary">Tindev</Typography>
                  </Link>
                </Button>
              </Grid>
              <Grid item xs={6} className="links right-link">
                {user ? (
                  <Button
                    className="links"
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    Logout
                  </Button>
                ) : null}
              </Grid>
            </Grid>
          </AppBar>

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
              element={
                <EditProfileModalDialogs handleSignIn={handleUserData} />
              }
            />
            <Route
              path="/users/:profileId"
              element={<Profile handleUpdateUser={handleUserData} />}
            />
            <Route
              path="/lobbies/:lobbyId"
              element={
                <SingleLobby refresh={refresh} setRefresh={setRefresh} />
              }
            />
            <Route
              path="/lobbies/:lobbyId/questions/:questionId"
              element={
                <SingleQuestion refresh={refresh} setRefresh={setRefresh} />
              }
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
