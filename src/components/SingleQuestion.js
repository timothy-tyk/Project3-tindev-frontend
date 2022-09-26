import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App.js";
import { useAuth0 } from "@auth0/auth0-react";
import { Container } from "@mui/system";
import {
  Avatar,
  Chip,
  Grid,
  Typography,
  Box,
  Button,
  Divider,
  Alert,
} from "@mui/material";
import tokenImage from "../images/token.png";
import RichTextDisplay from "./RichTextDisplay.js";
import EditSolved from "./EditSolved.js";
import EditMentor from "./EditMentor.js";
import KickMentor from "./KickMentor.js";
import EditSingleQuestion from "./EditSingleQuestion.js";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import EditQnsPopup from "./EditQnsPopup.js";
function SingleQuestion() {
  const params = useParams();
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(useContext(UserContext));
  const [questionId, setQuestionId] = useState(params.questionId);
  const [lobbyId, setLobbyId] = useState(params.lobbyId);
  const [questionData, setQuestionData] = useState({});
  const [solved, setSolved] = useState();
  const [kicked, setKicked] = useState(false);
  const [editToggle, setEditToggle] = useState();
  const [edited, setEdited] = useState(false);

  const getQuestionData = async () => {
    const response = await axios.get(
      `http://localhost:3000/question/${questionId}`
    );
    setQuestionData(response.data[0]);
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      console.log("re-render qns", edited);
      getQuestionData();
    }
    // eslint-disable-next-line
  }, [edited, kicked]);

  useEffect(() => {
    console.log(questionData);
    if (questionData.solved === true) {
      setSolved(true);
    } else {
      setSolved(false);
    }
  }, [questionData]);

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

  return (
    <Box height="100%" width="100%">
      <div>
        <Grid
          container
          direction="column"
          spacing="2"
          height="100%"
          mt={5}
          sx={{ mt: 8 }}
        >
          <Grid container direction="row">
            {/* start buttons */}
            <Grid item xs={3} alignContent="flex-start">
              <Button
                variant="outlined"
                startIcon={
                  <ArrowBackOutlinedIcon icon={ArrowBackOutlinedIcon} />
                }
                onClick={(e) => navigate(-1)}
              >
                LOBBY
              </Button>
            </Grid>
            {/* end buttons */}
            {/* start qns container */}
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignContent="center"
            >
              {questionData && Object.keys(questionData).length > 0 && (
                <Grid item xs={9}>
                  <Grid container justifyContent="center" alignContent="center">
                    <Grid item>
                      <Typography variant="h3">
                        {" "}
                        {questionData.title}
                      </Typography>{" "}
                    </Grid>
                  </Grid>
                  <Divider variant="middle" color="primary" />
                  <Grid item>
                    <Typography variant="caption">
                      {`Posted by ${questionData.menteeIdAlias.username} `}
                    </Typography>

                    <Typography variant="caption">
                      {`${time_ago(new Date(questionData.createdAt))}`}
                    </Typography>
                  </Grid>

                  <Grid item mt={4} mb={4}>
                    <RichTextDisplay richText={questionData.details} />
                  </Grid>
                  <Grid item>
                    {questionData.imgUrl && (
                      <img
                        className="questionpic"
                        alt="qns img"
                        src={questionData.imgUrl}
                      />
                    )}
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle" mr={3}>
                      Status:{" "}
                      <span
                        className={
                          questionData.solved ? "dotSolved" : "dotNotSolved"
                        }
                      ></span>
                    </Typography>
                    <Chip
                      avatar={
                        <Avatar
                          alt="token"
                          src={tokenImage}
                          sx={{ width: 0.08, height: 0.7 }}
                        />
                      }
                      label={`Bounty: ${questionData.tokensOffered}`}
                      variant="outlined"
                      color="primary"
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
            {/* end container for qns */}
            {/* container for buttons here */}
            <Grid container justifyContent="center" mt={4}>
              {/* grid for not solved */}
              <Grid item>
                {questionData && !solved && (
                  <div>
                    {/* prefix: not yet solved, render if user is the person who asked the question aka mentee */}
                    {questionData && questionData.menteeId === userData.id && (
                      <div>
                        {!questionData.mentorId && (
                          <EditQnsPopup
                            question={questionData}
                            edited={edited}
                            setEdited={setEdited}
                          />
                        )}

                        <EditSolved question={questionData} />
                        {/* render if mentor exists */}
                        {questionData.mentorId &&
                          questionData.mentorId !== userData.id && (
                            <div>
                              <KickMentor
                                questionId={questionData.id}
                                kicked={kicked}
                                setKicked={setKicked}
                              />
                              <Button
                                variant="outlined"
                                color="secondary"
                                onClick={(e) =>
                                  navigate(
                                    `/lobbies/${lobbyId}/questions/${questionId}/chatroom`
                                  )
                                }
                              >
                                Go to chatroom
                              </Button>
                            </div>
                          )}
                      </div>
                    )}
                    {/* .
      .
      .
      .
      .
      . */}
                    {/* prefix: not yet solved, render if user is NOT the person who asked the question, not necessarily mentor YET*/}
                    {questionData.mentorId === null &&
                      questionData.menteeId !== userData.id && (
                        <div>
                          <EditMentor question={questionData} />
                        </div>
                      )}
                    {/* .
      .
      .
      .
      .
      . */}
                    {/* prefix: not yet solved, render if user is the mentor*/}
                    {(questionData.menteeId === userData.id ||
                      questionData.mentorId === userData.id) && (
                      <div>
                        <div>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={(e) =>
                              navigate(
                                `/lobbies/${lobbyId}/questions/${questionId}/chatroom`
                              )
                            }
                          >
                            Go to chatroom
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Grid>
              {/* grid for solved */}
              <Grid item mb={3}>
                {solved &&
                  (questionData.menteeId === userData.id ||
                    questionData.mentorId === userData.id) && (
                    <div>
                      <Alert severity="success">
                        {" "}
                        This question has been solved!
                      </Alert>
                      <div>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={(e) =>
                            navigate(
                              `/lobbies/${lobbyId}/questions/${questionId}/chatroom`
                            )
                          }
                        >
                          Go to chatroom
                        </Button>
                      </div>
                    </div>
                  )}{" "}
              </Grid>
            </Grid>
            {/* GRID CONTAINER FOR SOLVED/ NT SOLVED ends here */}
          </Grid>
        </Grid>

        {/* .
      .
      .
      .
      .
      . */}
        {/* render if question is not yet solved */}
      </div>
    </Box>
  );
}

export default SingleQuestion;
