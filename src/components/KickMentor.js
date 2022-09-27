import React from "react";

import { useState, useContext } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App.js";
import { Button } from "@mui/material";
function KickMentor(props) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(useContext(UserContext));
  const [lobbyId, setLobbyId] = useState();

  // const params = useParams();
  // if (lobbyId !== params.lobbyId) {
  //   setLobbyId(params.lobbyId);
  // }
  const kickMentor = async () => {
    const submitBody = {
      questionId: props.questionId,
    };

    axios
      .put("http://localhost:3000/question/kickMentor", submitBody)
      .then((res) => {
        alert("You have kicked the mentor!");
        props.setKicked(!props.kicked);
      });
  };
  return (
    <div>
      <Button variant="outlined" color="primary" onClick={kickMentor}>
        Kick Mentor
      </Button>
    </div>
  );
}

export default KickMentor;
