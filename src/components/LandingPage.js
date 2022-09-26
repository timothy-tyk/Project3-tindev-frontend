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
    console.log("login");
    loginWithRedirect();
  };

  const animationEffect = () => {
    anime({
      targets: "#demo-svg polygon",
      points: [
        {
          value:
            "64 68.64 8.574 100 63.446 67.68 64 4 64.554 67.68 119.426 100",
        },
        {
          value: "64 128 8.574 96 8.574 32 64 0 119.426 32 119.426 96",
        },
      ],
      easing: "easeInOutExpo",
      baseFrequency: 0,
      scale: 1,
      duration: 2500,
      loop: true,
      direction: "alternate",
    });
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
    // animationEffect();
    if (isAuthenticated) {
      userInfo(user);
    } else {
      console.log("not authenticated");
    }
  }, [isAuthenticated]);

  return (
    <div className="container">
      <Grid container spacing={4}>
        <Grid item xs={4}>
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
        <Grid item xs={8}>
          <div className="svg-container">
            <svg
              id="demo-svg"
              width="100%"
              height="100%"
              viewBox="0 0 300 300"
              preserveAspectRatio="xMaxYMax"
            >
              <polygon
                stroke="none"
                fill="#CFFF04"
                points="64 128 8.574 96 8.574 32 64 0 119.426 32 119.426 96"
              />
            </svg>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
