import React from "react";
import { useEffect, useState, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App";
import EditSingleQuestion from "./EditSingleQuestion";
import EditMentor from "./EditMentor";
import EditSolved from "./EditStatus";
export default function Questions() {
  const [userData, setUserData] = useState(useContext(UserContext));
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [questionId, setQuestionId] = useState();
  const [question, setQuestion] = useState();
  const [editable, setEditable] = useState();
  const [edited, setEdited] = useState();
  const [lobbyId, setLobbyId] = useState();
  const [available, setAvailable] = useState(true);
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
            setAvailable(false);
          }
          if (response.data[0].menteeId === userData.id) {
            setEditable(true);
          }
          if (response.data[0].mentorId !== null) {
            //there is a mentor so both parties cant edit and cant accept
            setAvailable(false);
          }
          if (response.data[0].mentorId === userData.id) {
            alert("u are the mentor for this question! routing to chatroom");
            navigate(`/lobbies/${lobbyId}/questions/${questionId}/chatroom`);
          }
        });
    }
  }, [edited]);

  // useEffect(() => {
  //   // If there is a questionId, retrieve the question data
  //   if (questionId) {
  //     axios
  //       .get(`http://localhost:3000/question/${questionId}`)
  //       .then((response) => {
  //         setQuestion(response.data);
  //       });

  // axios
  //   .get(`http://localhost:3000/sightings/${sightingIndex}/comments`)
  //   .then((response) => {
  //     setComments(response.data);
  //   });
  // }
  // Only run this effect on change to sightingIndex
  // }, [sightingIndex, sentComment, updatedComment]);

  // Store a new JSX element for each property in question
  // let questionDetails;
  // if (question) {
  //   console.log(question);
  //   questionDetails = question.map((item, i) => {
  //     return (
  //       <div>
  //         <h1>
  //           {question.title} by Id{question.menteeId}: Username:
  //           {question.menteeIdAlias.username}
  //         </h1>
  //         <h6> {question.details} </h6>
  //         <h6>Question Id: {questionId}</h6>
  //         <p>
  //           {" "}
  //           status:{question.status}, tokens Offer: {question.tokensOffered}{" "}
  //         </p>
  //       </div>
  //     );
  //   });
  // }

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
            <h6> {question.details} </h6>
            <h6>Question Id: {questionId}</h6>
            <p>
              {" "}
              status:{question.solved ? "Solved" : "Not solved"}, tokens Offer:{" "}
              {question.tokensOffered}{" "}
            </p>
          </div>
        )}
      </p>
      {/* if u are the mentee, u can edit
        but if there is a mentor, cannot be edited, editable=false
        if it is solved, unable to accept any mentors, available=false */}
      <div>
        {editable && available && (
          <EditSingleQuestion
            question={question}
            edited={edited}
            setEdited={setEdited}
          />
        )}
        {editable && available && (
          <EditSolved question={question} setAvailable={setAvailable} />
        )}{" "}
      </div>
      {available && <EditMentor question={question} />}
      {!available && "Question has been solved! CLOSED"}
      <button onClick={(e) => navigate(-1)}>Go back</button>
    </div>
  );
}
