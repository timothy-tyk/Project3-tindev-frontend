import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { Button, Container, Box, Typography, Grid, Paper } from "@mui/material";
// import logo from "../images/Tindev.png";

import anime from "animejs";
export default function LandingPage(props) {
  const {
    isAuthenticated,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();
  const navigate = useNavigate();

  const handleLogin = async () => {
    loginWithRedirect();
  };

  const userInfo = async (user) => {
    const accessToken = await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUDIENCE,
      scope: process.env.REACT_APP_SCOPE,
    });
    const response = await axios.post(
      `${BACKEND_URL}/users`,
      {
        username: user.nickname,
        email: user.email,
        profilepicture: user.picture,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    await props.handleSignIn(response.data);
    navigate("/dashboard");
  };

  useEffect(() => {
    if (isAuthenticated) {
      userInfo(user);
    } else {
      console.log("not authenticated");
    }
  }, [isAuthenticated]);

  return (
    <div className="container">
      <Grid container spacing={12}>
        <Grid item xs={12}>
          <Typography variant="h3" color="primary">
            Code-llaborate with Devs, Urgently.
          </Typography>
          <br />
          <Button
            variant="outlined"
            onClick={() => {
              handleLogin();
            }}
          >
            Get Started
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
