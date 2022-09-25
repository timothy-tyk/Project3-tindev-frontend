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
import tokenImage from "../images/token.png";
//draft.js
import "./RichText.css";
import "../../node_modules/draft-js/dist/Draft.css";
import { convertFromRaw, ContentState } from "draft-js";
import RichTextEditor from "./RichTextEditor";
import RichTextDisplay from "./RichTextDisplay";
import KickMentor from "./KickMentor";
import { Container, Avatar } from "@mui/material";
import {
  ButtonGroup,
  Button,
  Card,
  Paper,
  Grid,
  Chip,
  Typography,
} from "@mui/material";
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

  function time_ago(time) {
    switch (typeof time) {
      case "number":
        break;
      case "string":
        time = +new Date(time);
        break;
      case "object":
        if (time.constructor === Date) time = time.getTime();
        break;
      default:
        time = +new Date();
    }
    var time_formats = [
      [60, "seconds", 1], // 60
      [120, "1 minute ago", "1 minute from now"], // 60*2
      [3600, "minutes", 60], // 60*60, 60
      [7200, "1 hour ago", "1 hour from now"], // 60*60*2
      [86400, "hours", 3600], // 60*60*24, 60*60
      [172800, "Yesterday", "Tomorrow"], // 60*60*24*2
      [604800, "days", 86400], // 60*60*24*7, 60*60*24
      [1209600, "Last week", "Next week"], // 60*60*24*7*4*2
      [2419200, "weeks", 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, "Last month", "Next month"], // 60*60*24*7*4*2
      [29030400, "months", 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, "Last year", "Next year"], // 60*60*24*7*4*12*2
      [2903040000, "years", 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, "Last century", "Next century"], // 60*60*24*7*4*12*100*2
      [58060800000, "centuries", 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
      token = "ago",
      list_choice = 1;

    if (seconds == 0) {
      return "Just now";
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = "from now";
      list_choice = 2;
    }
    var i = 0,
      format;
    while ((format = time_formats[i++]))
      if (seconds < format[0]) {
        if (typeof format[2] == "string") return format[list_choice];
        else
          return (
            Math.floor(seconds / format[2]) + " " + format[1] + " " + token
          );
      }
    return time;
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
    <Container maxWidth="sm">
      <Grid container>
        <Grid
          item
          sx={{
            padding: 5,
            border: 1,
            borderColor: "secondary",
            borderRadius: "10px",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {question && (
            <div>
              <Typography variant="h1">{question.title} </Typography>
              <Typography variant="subtitle">
                by {question.menteeIdAlias.username}
              </Typography>
              <Typography variant="caption">
                {" "}
                {`${time_ago(new Date(question.createdAt))}`}
              </Typography>
              <Grid container pt={4}>
                <Grid item xs sx={{ pr: 3 }}>
                  <Typography variant="subtitle">
                    status:
                    <span
                      className={question.solved ? "dotSolved" : "dotNotSolved"}
                    ></span>
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Chip
                    avatar={
                      <Avatar
                        alt="token"
                        src={tokenImage}
                        sx={{ width: 0.08, height: 0.7 }}
                      />
                    }
                    label={`Tokens Offer:${question.tokensOffered}`}
                    variant="outlined"
                    color="secondary"
                  />
                </Grid>
              </Grid>
              <h6>Description: </h6>
              <RichTextDisplay richText={question.details} />

              {question.imgUrl && (
                <img
                  className="questionpic"
                  alt="qns img"
                  src={question.imgUrl}
                />
              )}
            </div>
          )}{" "}
        </Grid>
      </Grid>
      <div>
        {/* if u are the mentee, u can edit
        but if there is a mentor, cannot be edited, editable=false
        if it is solved, unable to accept any mentors, available=false */}
        <div>
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
    </Container>
  );
}
