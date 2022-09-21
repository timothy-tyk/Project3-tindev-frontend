import React from "react";

import { useState, useContext } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App.js";

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
        alert("u have marked it as solved! question is closed");
        navigate(-1);
      });
  };
  return (
    <div>
      <button onClick={updateMentor}>Solved</button>
    </div>
  );
}

export default EditSolved;
