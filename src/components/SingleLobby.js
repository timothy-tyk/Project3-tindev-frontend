import React from "react";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../App.js";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import SingleLobbyNumberDisplay from "./SingleLobbyNumberDisplay.js";
import LobbyChatComponent from "./LobbyChatComponent.js";
import PostQuestionTwo from "./PostQuestionTwo.js";
import { Avatar, Button, Grid, Typography, Card } from "@mui/material";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import { Container } from "@mui/system";
import tokenImage from "../images/token.png";
import backIcon from "../images/backIcon.png";
import onlineUsersIcon from "../images/onlineUsersIcon.png";
import PostQuestionPopup from "./PostQuestionPopup.js";

import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function SingleLobby(props) {
  const { user } = useAuth0();
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [userData, setUserData] = useState(useContext(UserContext));
  const [lobbyData, setLobbyData] = useState([]);
  const [questionsData, setQuestionsData] = useState([]);
  const [userAsMenteeData, setUserAsMenteeData] = useState([]);
  const [userAsMentorData, setUserAsMentorData] = useState([]);
  const [posted, setPosted] = useState();

  const getLobbyData = async () => {
    const response = await axios.get(`${BACKEND_URL}/lobbies/${lobbyId}`);
    setLobbyData(response.data);
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      getLobbyData();
      newUserData();
      socket.emit("join_room", { room: lobbyId });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on("update_the_frontend", (data) => {
      getQuestionsData();
    });
  }, [socket]);

  const updateUserLocation = async () => {
    if (userData) {
      const body = {
        userId: userData.id,
        lobbyName: lobbyData.name,
      };
      axios
        .put(`${BACKEND_URL}/lobbies/${lobbyId}/${userData.id}`, body)
        .then((res) => {});
    } else console.log("loading user");
  };

  useEffect(() => {
    updateUserLocation();
    // eslint-disable-next-line
  }, [lobbyData]);

  const getQuestionsData = async () => {
    const response = await axios.get(
      `${BACKEND_URL}/lobbies/${lobbyId}/questions`
    );
    setQuestionsData(response.data);
  };

  useEffect(() => {
    getQuestionsData();
    // eslint-disable-next-line
  }, [lobbyData, posted]);

  const getUserStatsData = async () => {
    if (userData) {
      const responseAsMentee = await axios.get(
        `${BACKEND_URL}/lobbies/${lobbyId}/mentee/${userData.id}`
      );

      const responseAsMentor = await axios.get(
        `${BACKEND_URL}/lobbies/${lobbyId}/mentor/${userData.id}`
      );

      setUserAsMenteeData(responseAsMentee.data.length);
      setUserAsMentorData(responseAsMentor.data.length);
    } else console.log("loading user");
  };

  const newUserData = async () => {
    const newData = await axios.get(`${BACKEND_URL}/users/${userData.id}`);
    setUserData(newData.data);
  };

  useEffect(() => {
    getUserStatsData();
    newUserData();
    // eslint-disable-next-line
  }, [questionsData]);

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

  function returnQuestions() {
    return (
      <Grid
        container
        className="scroll"
        sx={{
          p: 4,
          overflowY: "auto",
          maxHeight: "400px",
          borderTop: 1,
          borderBottom: 1,
          borderColor: "#555",
        }}
      >
        {questionsData &&
          questionsData.map((question, i) => {
            return question.solved ? (
              <Grid container>
                <Grid
                  container
                  key={question.id}
                  className="singleQuestionDisplayContainerSolved"
                  sx={{ border: 1, p: 2, mb: 2 }}
                  alignItems="center"
                  wrap="nowrap"
                  borderRadius="10px"
                  onClick={() =>
                    navigate(`/lobbies/${lobbyId}/questions/${question.id}`)
                  }
                >
                  <Grid item xs={1}>
                    <EscalatorWarningIcon sx={{ display: "none" }} />
                  </Grid>

                  <Grid
                    item
                    xs={3}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      pl: 3,
                      mr: 5,
                    }}
                  >
                    <Typography color="tertiary.lighter" fontSize={"0.5em"}>
                      Posted by {question.menteeIdAlias.username}
                      <br />
                      {`${time_ago(new Date(question.createdAt))}`}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      pl: 1,
                    }}
                  >
                    <Avatar
                      alt="token"
                      src={tokenImage}
                      sx={{ width: 0.08, height: 0.7, mr: 2 }}
                    />
                    <Typography color="tertiary.lighter" fontSize={"0.7em"}>
                      {question.tokensOffered}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    display="flex"
                    alignContent="flex-start"
                    sx={{ pl: 7 }}
                  >
                    <Typography color="tertiary.lighter" fontSize={"0.5em"}>
                      Subject Title: {question.title}
                    </Typography>
                  </Grid>
                  <Grid item xs sx={{ pr: 3 }}>
                    <span className="dotSolved" />
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <Grid
                container
                key={question.id}
                className="singleQuestionDisplayContainer"
                sx={{ border: 1, p: 2, mb: 2 }}
                alignItems="center"
                wrap="nowrap"
                borderRadius="10px"
                onClick={() =>
                  navigate(`/lobbies/${lobbyId}/questions/${question.id}`)
                }
              >
                {question.mentorId ? (
                  <Grid item xs={1}>
                    <EscalatorWarningIcon />
                  </Grid>
                ) : (
                  <Grid item xs={1}>
                    <EscalatorWarningIcon sx={{ display: "none" }} />
                  </Grid>
                )}
                <Grid
                  item
                  xs={3}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    pl: 3,
                    mr: 5,
                  }}
                >
                  <Typography fontSize={"0.5em"}>
                    Posted by {question.menteeIdAlias.username}
                    <br />
                    {`${time_ago(new Date(question.createdAt))}`}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    pl: 1,
                  }}
                >
                  <Avatar
                    alt="token"
                    src={tokenImage}
                    sx={{ width: 0.08, height: 0.7, mr: 2 }}
                  />
                  <Typography fontSize={"0.7em"}>
                    {question.tokensOffered}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={6}
                  display="flex"
                  alignContent="flex-start"
                  sx={{ pl: 7 }}
                >
                  <Typography fontSize={"0.5em"}>
                    Subject Title: {question.title}
                  </Typography>
                </Grid>
                <Grid item xs sx={{ pr: 3 }}>
                  <span className="dotNotSolved" />
                </Grid>
              </Grid>
            );
          })}
      </Grid>
    );
  }

  return (
    <Container sx={{ height: "100%" }}>
      {/* Lobby Header container */}
      <Grid
        container
        sx={{
          height: "6.5vh",
          display: "flex",
          justifyContent: "space-between",
          mt: 5,
          mb: 5,
        }}
        wrap="nowrap"
      >
        <Button onClick={(e) => navigate(-1)}>
          <Avatar alt="back" src={backIcon} size="100%" />
        </Button>
        {/* Lobby Name */}
        <Grid
          item
          xs={8}
          sx={{
            border: 1,
            borderColor: "#e8dacc",
            backgroundColor: "#22212198",
            borderRadius: "10px",
            mx: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pl: 4,
          }}
        >
          <Typography color="primary" variant="h2">
            {lobbyData.name} Lobby
          </Typography>
        </Grid>
        {/* Number of people online */}
        <Grid
          item
          xs={2}
          sx={{
            border: 1,
            borderColor: "#e8dacc",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#22212198",
            justifyContent: "flex-end",
          }}
        >
          <Avatar
            alt="people"
            src={onlineUsersIcon}
            sx={{ height: 0.7, width: 0.2 }}
          />
          <Typography color="offwhite.main" fontSize={"0.5em"} sx={{ m: 2 }}>
            <SingleLobbyNumberDisplay lobbyData={lobbyData} lobbyId={lobbyId} />
          </Typography>
        </Grid>
      </Grid>
      {/* User info container */}
      <Grid
        container
        sx={{
          width: 1,
          height: "15vh",
          display: "flex",
          justifyContent: "space-between",
          borderRadius: "20px",
          // backgroundColor: "#333333",
        }}
      >
        <Grid container className="userInfoHolder">
          <Grid item className="userNameDisplay">
            {/* if userName.length < 13 */}
            <Typography color="secondary" variant="h2">
              {userData && userData.username}
            </Typography>
          </Grid>
          <Grid
            className="userStatsDisplay"
            container
            sx={{
              width: 1,
              height: "25vh",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                alignItems: "center",
                pl: 5,
              }}
            >
              <Avatar
                alt="token"
                src={tokenImage}
                sx={{ width: 0.08, height: 0.7, mr: 2 }}
              />
              <Typography color="offwhite.main" variant="h4">
                {userData.tokens}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Typography color="offwhite.main" variant="h4">
                {userAsMentorData}
                {userAsMentorData === 1 ? (
                  <span> Question Answered</span>
                ) : (
                  <span> Questions Answered</span>
                )}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{ display: "flex", justifyContent: "flex-end", pr: 3 }}
            >
              <Typography color="offwhite.main" variant="h4">
                {userAsMenteeData}
                {userAsMenteeData === 1 ? (
                  <span> Question Posted</span>
                ) : (
                  <span> Questions Posted</span>
                )}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          mt: 7,
          backgroundColor: "#22212198",
        }}
        display="flex"
        className="questionDisplayContainer"
      >
        <Grid container alignItems="center" justifyContent="space-evenly">
          <Grid
            item
            xs={4}
            display="flex"
            sx={{ mb: 3 }}
            alignItems="center"
            justifyContent="center"
          >
            <span className="dotNotSolved" />
            <Typography sx={{ ml: 2 }}>Available Questions</Typography>
          </Grid>
          <Grid
            item
            xs={4}
            display="flex"
            sx={{ mb: 3 }}
            justifyContent="center"
            alignItems="center"
          >
            <span className="dotSolved" />
            <Typography sx={{ ml: 2 }}>Question has been solved</Typography>
          </Grid>
          <Grid
            item
            xs={4}
            display="flex"
            sx={{ mb: 3 }}
            justifyContent="center"
            alignItems="center"
          >
            <EscalatorWarningIcon />
            <Typography sx={{ ml: 2 }}>Question in progress</Typography>
          </Grid>
        </Grid>
        {returnQuestions()}
      </Grid>

      <Grid item xs={12} sx={{ my: 3, borderRadius: "10px", py: 3 }}>
        <PostQuestionPopup
          setPosted={setPosted}
          posted={posted}
          userData={userData}
          lobbyId={lobbyId}
        />
      </Grid>
      <Grid
        container
        sx={{ border: 1, p: 2, mb: 2, backgroundColor: "#22212198" }}
        borderRadius="10px"
      >
        <Grid
          item
          xs
          bgcolor="#22212198"
          sx={{ p: 2, mb: 2 }}
          borderRadius="10px"
        >
          <LobbyChatComponent
            userData={userData}
            lobbyId={lobbyId}
            lobbyData={lobbyData}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
