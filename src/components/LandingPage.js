import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      "http://localhost:3000/users",
      {
        username: user.nickname,
        email: user.email,
        profilepicture: user.picture,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    props.handleSignIn(response.data);
  };

  useEffect(() => {
    if (isAuthenticated) {
      userInfo(user);
      navigate("/dashboard");
    } else {
      console.log("not authenticated");
    }
  }, [isAuthenticated]);

  return (
    <div>
      {" "}
      <p>LANDING PAGE</p>
      <button
        onClick={() => {
          handleLogin();
        }}
      >
        Sign Up / Login
      </button>
    </div>
  );
}
