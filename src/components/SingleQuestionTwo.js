import React from "react";
import { useEffect, useState, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App";
import EditSingleQuestion from "./EditSingleQuestion";
import EditMentor from "./EditMentor";
import EditSolved from "./EditSolved";
import { EditorState, Editor } from "draft-js";
//draft.js
import "./RichText.css";
import "../../node_modules/draft-js/dist/Draft.css";
import { convertFromRaw, ContentState } from "draft-js";
import RichTextEditor from "./RichTextEditor";
import RichTextDisplay from "./RichTextDisplay";
import KickMentor from "./KickMentor";

export default function SingleQuestionTwo() {
  const [userData, setUserData] = useState(useContext(UserContext));
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [questionId, setQuestionId] = useState();
  const [question, setQuestion] = useState();
  const [userIsMentee, setUserIsMentee] = useState();
  const [solved, setSolved] = useState();
  const [edited, setEdited] = useState();
  const [lobbyId, setLobbyId] = useState();
  const [mentorExist, setMentorExist] = useState(false);
  const [kicked, setKicked] = useState(false);

  // Update question index in state if needed to trigger data retrieval
  const params = useParams();
  if (questionId !== params.questionId) {
    setQuestionId(params.questionId);

    if (lobbyId !== params.lobbyId) {
      setLobbyId(params.lobbyId);
    }
  }

  const previousMentors = [];
  const getMentorList = async () => {
    if (question) {
      for (let userId of question.mentorList) {
        console.log(userId, "userId of mentor List");
        previousMentors.push(userId);
      }
    }
  };

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
          console.log(response.data, "response.data");
          console.log(response.data[0].details);

          setQuestion(response.data[0]);

          if (response.data[0].solved === true) {
            setSolved(true);
          }
          if (response.data[0].mentorId !== null) {
            //there is a mentor so both parties cant edit and cant accept
            setMentorExist(true);
          }
          if (response.data[0].mentorId === null) {
            //there is a mentor so both parties cant edit and cant accept
            setMentorExist(false);
          }
          if (response.data[0].mentorId === userData.id) {
            alert("u are the mentor for this question! routing to chatroom");
            navigate(`/lobbies/${lobbyId}/questions/${questionId}/chatroom`);
          }
          if (response.data[0].menteeId === userData.id) {
            setUserIsMentee(true);
          }
          getMentorList();
        });
      console.log(userIsMentee, "user is mentee");
      console.log("mentor exist", mentorExist);
    }
  }, [edited, kicked]);

  useEffect(() => {
    if (question) {
      console.log(question.details);
      const contentState = convertFromRaw(JSON.parse(question.details));
    } else console.log("no question yet");
  }, [question, kicked]);

  return (
    <div>
      {question && (
        <div>
          <h1>
            {question.title} by Id{question.menteeId}: Username:
            {question.menteeIdAlias.username}
          </h1>
          <h6>Question Id: {questionId}</h6>
          <h6>Description: </h6>

          <RichTextDisplay richText={question.details} />
          <p>
            status:{question.solved ? "Solved" : "Not solved"}, tokens Offer:{" "}
            {question.tokensOffered}
          </p>
          {question.imgUrl && (
            <img className="questionpic" alt="qns img" src={question.imgUrl} />
          )}
        </div>
      )}
      {/* if u are the mentee, u can edit
        but if there is a mentor, cannot be edited, editable=false
        if it is solved, unable to accept any mentors, available=false */}
      <div>
        {userIsMentee && !solved && !mentorExist && (
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
      {mentorExist && solved && "Question has been solved!"}
      {userIsMentee && mentorExist && !solved && (
        <KickMentor
          questionId={question.id}
          kicked={kicked}
          setKicked={setKicked}
        />
      )}
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
