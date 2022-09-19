import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Chatroom() {
  const [questionId, setQuestionId] = useState();
  const [question, setQuestion] = useState();
  const navigate = useNavigate();
  const params = useParams();
  if (questionId !== params.questionId) {
    setQuestionId(params.questionId);
  }
  useEffect(() => {
    if (questionId) {
      axios
        .get(`http://localhost:3000/question/${questionId}`)
        .then((response) => {
          console.log(response, "response");
          console.log(response.data, "response.data");
          setQuestion(response.data[0]);
        });
    }

    console.log(params, "params");
  }, []);

  return (
    <div>
      <div>
        {question && (
          <div>
            <h1>
              {question.title} by Id{question.menteeId}: Username:
              {question.menteeIdAlias.username}
            </h1>
            <h6> {question.details} </h6>
            <h6>Question Id: {questionId}</h6>
            <p>
              {" "}
              status:{question.solved ? "solved" : "not solved yet"}, tokens
              Offer: {question.tokensOffered}{" "}
            </p>
            <p>** INSERT CHAT MSG / SOCKET IO HERE ***</p>
          </div>
        )}
      </div>

      <button onClick={(e) => navigate(-2)}>Go back to previous lobby</button>
    </div>
  );
}

export default Chatroom;
