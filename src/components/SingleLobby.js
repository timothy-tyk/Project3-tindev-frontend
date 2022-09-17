import React from "react";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants";
export default function SingleLobby() {
  const { user } = useAuth0();
  const { lobbyId } = useParams();
  const navigate = useNavigate();

  const [lobbyData, setLobbyData] = useState([]);

  const getLobbyData = async () => {
    const response = await axios.get(`${BACKEND_URL}/lobbies/${lobbyId}`);
    console.log(response);
    setLobbyData(response.data);
  };
  useEffect(() => {
    console.log(user);
    if (!user) {
      navigate("/");
    } else {
      getLobbyData();
    }
  }, []);

  return (
    <div>
      {" "}
      <h1>{lobbyData.name} Lobby</h1>
      <h4>{lobbyData.numberOnline} People Online</h4>
    </div>
  );
}
