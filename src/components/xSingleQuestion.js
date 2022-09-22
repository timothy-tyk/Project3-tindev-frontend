import React from "react";
import { useEffect, useState, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App";
import EditSingleQuestion from "./EditSingleQuestion";
import EditMentor from "./EditMentor";
import EditSolved from "./EditSolved";
import {
  Editor,
  EditorState,
  editorState,
  getDefaultKeyBinding,
  RichUtils,
} from "draft-js";
//draft.js
import "./RichText.css";
import "../../node_modules/draft-js/dist/Draft.css";
import { convertFromRaw } from "draft-js";

export default function Questions() {
  const [userData, setUserData] = useState(useContext(UserContext));
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [questionId, setQuestionId] = useState();
  const [question, setQuestion] = useState();
  const [userIsMentee, setUserIsMentee] = useState();
  const [solved, setSolved] = useState();
  const [edited, setEdited] = useState();
  const [lobbyId, setLobbyId] = useState();
  const [mentorExist, setMentorExist] = useState();
  // Update question index in state if needed to trigger data retrieval
  const params = useParams();
  if (questionId !== params.questionId) {
    setQuestionId(params.questionId);

    if (lobbyId !== params.lobbyId) {
      setLobbyId(params.lobbyId);
    }
  }
  useEffect(() => {
    console.log(user);
    if (!user) {
      navigate("/");
    }
    // If there is a questionId, retrieve the question data
    if (questionId) {
      axios
        .get(`http://localhost:3000/question/${questionId}`)
        .then((response) => {
          console.log(response, "response");
          console.log(response.data, "response.data");
          setQuestion(response.data[0]);

          if (response.data[0].solved === true) {
            setSolved(true);
          }
          if (response.data[0].mentorId !== null) {
            //there is a mentor so both parties cant edit and cant accept
            setMentorExist(true);
          }
          if (response.data[0].mentorId === userData.id) {
            alert("u are the mentor for this question! routing to chatroom");
            navigate(`/lobbies/${lobbyId}/questions/${questionId}/chatroom`);
          }
          if (response.data[0].menteeId === userData.id) {
            setUserIsMentee(true);
          }
        });
    }
  }, [edited]);

  let displayText;
  if (question) {
    console.log(question, "question");
    displayText = editorState.createWithContent(
      convertFromRaw(JSON.parse(question.details))
    );
  }

  //EditorState.createWithContent(question.details)
  return (
    <div>
      {" "}
      <p>
        {question && (
          <div>
            <h1>
              {question.title} by Id{question.menteeId}: Username:
              {question.menteeIdAlias.username}
            </h1>
            {displayText}
            {/* convertFromRaw(JSON.parse(content here)) */}
            {/* <h6> {convertFromRaw(JSON.parse(question.details))} </h6> */}
            {/* {displayText} */}
            <h6>Question Id: {questionId}</h6>
            <p>
              status:{question.solved ? "Solved" : "Not solved"}, tokens Offer:{" "}
              {question.tokensOffered}{" "}
            </p>
            {question.imgUrl && (
              <img
                className="questionpic"
                alt="qns img"
                src={question.imgUrl}
              />
            )}
          </div>
        )}
      </p>
      {/* if u are the mentee, u can edit
        but if there is a mentor, cannot be edited, editable=false
        if it is solved, unable to accept any mentors, available=false */}
      <div>
        {userIsMentee && !mentorExist && (
          <EditSingleQuestion
            question={question}
            edited={edited}
            setEdited={setEdited}
          />
        )}
        {userIsMentee && !solved && <EditSolved question={question} />}{" "}
      </div>
      {!mentorExist && !userIsMentee && !solved && (
        <EditMentor question={question} />
      )}
      {mentorExist && solved && "Question has been solved! CLOSED"}
      {userIsMentee && mentorExist && (
        <div>
          You already have a mentor{" "}
          <button
            onClick={(e) =>
              navigate(`/lobbies/${lobbyId}/questions/${questionId}/chatroom`)
            }
          >
            Go to chatroom
          </button>
        </div>
      )}
      <button onClick={(e) => navigate(-1)}>Go back</button>
    </div>
  );
}
