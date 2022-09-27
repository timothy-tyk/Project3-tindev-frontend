import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../constants";

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
    }, 5000);

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
