import React, { useEffect, useState } from "react";
import { UserContext } from "../App";
import { BACKEND_URL } from "../constants";
import { Link } from "react-router-dom";
import axios from "axios";
import ModalDialog from "./DashboardQuestionModals";

//MUI
import { Typography, Grid, Card, Modal, SimpleDialog } from "@mui/material";

export default function DashboardQuestions(props) {
  const [userData, setUserData] = useState(props.user);
  const [userQuestions, setUserQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questionsList, setQuestionsList] = useState();
  const [questionType, setQuestionType] = useState();

  useEffect(() => {
    getUserQuestions();
  }, []);

  // Get Questions associated to the current User
  const getUserQuestions = async () => {
    const response = await axios.get(
      `${BACKEND_URL}/question/users/${userData.id}`
    );
    let questions = response.data;
    let questionsData = [];
    for (let question of questions) {
      question = await axios.get(`${BACKEND_URL}/question/${question.id}`);
      questionsData.push(question.data[0]);
    }
    setUserQuestions(questionsData);
  };

  let questionsAnswered = userQuestions.filter(
    (question) => question.mentorId == userData.id
  );
  let questionsAsked = userQuestions.filter(
    (question) => question.menteeId == userData.id
  );

  const openQuestionsList = (type) => {
    if (type == "answered") {
      setQuestionType("Answered");
      setQuestionsList(questionsAnswered);
    } else {
      setQuestionType("Answered");
      setQuestionsList(questionsAsked);
    }
  };

  return (
    <div>
      <Typography variant="h3" align="left" color="primary">
        Questions
      </Typography>
      <Grid container>
        <Grid item xs={5}>
          <button
            onClick={() => {
              setShowQuestions(!showQuestions);
              getUserQuestions();
              openQuestionsList("answered");
            }}
          >
            <Typography variant="h2">{questionsAnswered.length}</Typography>
          </button>
          <Typography>Questions Answered</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h2">/</Typography>
        </Grid>
        <Grid item xs={5}>
          <button
            onClick={() => {
              setShowQuestions(!showQuestions);
              getUserQuestions();
              openQuestionsList("asked");
            }}
          >
            <Typography variant="h2">{questionsAsked.length}</Typography>
          </button>
          <Typography>Questions Asked</Typography>
        </Grid>
      </Grid>

      <ModalDialog
        open={showQuestions}
        handleClose={() => setShowQuestions(false)}
        questionsList={questionsList}
        type={questionType}
      />

      {/* {showQuestions && questionsList
        ? questionsList.map((question) => {
            return (
              <Grid container key={question.id} className="questions-column">
                <Card>
                  <p>Asked By: {question.menteeIdAlias.username}</p>
                  <p>
                    Answered By:
                    {question.mentorIdAlias ? (
                      question.mentorIdAlias.username
                    ) : (
                      <p>None</p>
                    )}
                  </p>
                  <p>Title: {question.title}</p>
                  <Link
                    to={`/lobbies/${question.lobbyId}/questions/${question.id}`}
                  >
                    Go To Question
                  </Link>
                </Card>
              </Grid>
            );
          })
        : null} */}
    </div>
  );
}
