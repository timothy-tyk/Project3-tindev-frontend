import React from "react";

import { useState, useContext } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App.js";
import { Button } from "@mui/material";
function EditSolved(props) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(useContext(UserContext));

  const updateMentor = async () => {
    const submitBody = {
      //backend solved will be true!
      questionId: props.question.id,
    };
    axios
      .put("http://localhost:3000/question/updateStatus", submitBody)
      .then((res) => {
        alert("You have marked it as solved! question is closed");
        navigate(-1);
      });
  };
  return (
    <div>
      <Button
        variant="outlined"
        color="secondary"
        onClick={updateMentor}
        sx={{ m: 2 }}
      >
        Solved
      </Button>
    </div>
  );
}

export default EditSolved;
