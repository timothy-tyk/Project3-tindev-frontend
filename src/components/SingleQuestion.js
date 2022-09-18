import React from "react";
import { useEffect, useState, useContext, UserContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function Questions() {
  const [userData, setUserData] = useState(useContext(UserContext));
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [questionId, setQuestionId] = useState();
  const [question, setQuestion] = useState();
  const [editable, setEditable] = useState();
  // Update question index in state if needed to trigger data retrieval
  const params = useParams();
  if (questionId !== params.questionId) {
    setQuestionId(params.questionId);
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
          setQuestion(response.data);
          if (response.data.menteeId === userData.id) {
            setEditable(true);
          }
        });
    }
  }, []);

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
  const questionDetails = [];
  if (question) {
    for (const key in question) {
      questionDetails.push(<div key={key}>{`${key}: ${question[key]}`}</div>);
    }
  }

  return (
    <div>
      {" "}
      <p>{question && questionDetails}</p>
      {editable ? <button> Edit </button> : <button>Accept</button>}
    </div>
  );
}
