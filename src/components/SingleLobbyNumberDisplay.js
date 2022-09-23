import React from "react";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../App.js";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import PostQuestion from "./xPostQuestion.js";
import { Grid } from "@mui/material";

export default function SingleLobbyNumberDisplay(props) {
  const [numberOnline, setNumberOnline] = useState(0);
  const lobbyData = props.lobbyData;
  const lobbyId = props.lobbyId;

  const getNumberOnline = async () => {
    const lobbyName = lobbyData.name;
    const response = await axios.get(
      `${BACKEND_URL}/lobbies/${lobbyId}/${lobbyName}/numberOnline`
    );
    setNumberOnline(response.data.length);
  };

  useEffect(() => {
    getNumberOnline();

    const interval = setInterval(() => {
      getNumberOnline();
      console.log("refreshing number online");
    }, 10000);

    return () => clearInterval(interval);
  }, [lobbyData]);

  return numberOnline !== 0 ? (
    <span>
      {numberOnline > 0 &&
        (numberOnline > 1
          ? `${numberOnline} People Online`
          : ` ${numberOnline} Person Online`)}
    </span>
  ) : (
    <span>loading...</span>
  );
}
