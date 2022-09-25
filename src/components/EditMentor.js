import React from "react";

import { useState, useContext } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App.js";
import { Button } from "@mui/material";

function EditMentor(props) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(useContext(UserContext));
  const [lobbyId, setLobbyId] = useState();

  const params = useParams();
  if (lobbyId !== params.lobbyId) {
    setLobbyId(params.lobbyId);
  }
  const updateMentor = async () => {
    const submitBody = {
      mentorId: userData.id,
      questionId: props.question.id,
    };

    axios
      .put("http://localhost:3000/question/updateMentor", submitBody)
      .then((res) => {
        alert("u have accepted the question! Going to chatroom now!");

        navigate(`/lobbies/${lobbyId}/questions/${props.question.id}/chatroom`);
      });
  };
  return (
    <div>
      <Button variant="outlined" color="secondary" onClick={updateMentor}>
        Accept
      </Button>
    </div>
  );
}

export default EditMentor;
