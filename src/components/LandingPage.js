import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { Button, Container, Box, Typography } from "@mui/material";
import logo from "../images/Tindev.png";
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
    <div>
      <Container maxWidth="sm">
        <Box>
          <Typography color="secondary"> {`</>`} </Typography>
          <Typography color="primary"> TINDEV </Typography>
          <Typography color="secondary"> TINDEV</Typography>
          <p>LANDING PAGE</p>
          <img className="landinglogo" src={logo} alt="tindev" />
          <button
            onClick={() => {
              handleLogin();
            }}
          >
            Sign Up / Login
          </button>
        </Box>
      </Container>
    </div>
  );
}
