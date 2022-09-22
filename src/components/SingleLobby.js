import React from "react";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../App.js";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import PostQuestion from "./xPostQuestion.js";
import SingleLobbyNumberDisplay from "./SingleLobbyNumberDisplay.js";
import LobbyChatComponent from "./LobbyChatComponent.js";
import PostQuestionTwo from "./PostQuestionTwo.js";
import { Button, Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";

export default function SingleLobby() {
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
    }
    // eslint-disable-next-line
  }, []);

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

  useEffect(() => {
    getUserStatsData();
    // eslint-disable-next-line
  }, [questionsData]);

  return (
    <Container sx={{ width: 1, height: 1, m: 2 }}>
      <Grid container columnSpacing={{ xs: 4 }} sx={{ border: 1, width: 1 }}>
        <Grid
          item
          xs={8}
          sx={{ border: 1, py: 5 }}
          display="flex"
          alignItems="center"
        >
          <Button color="secondary" onClick={(e) => navigate(-1)}>
            <ChevronLeftIcon fontSize="large" />
            <Typography color="primary">{lobbyData.name} Lobby</Typography>
          </Button>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{ border: 1 }}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Typography color="neongreen.main">
            <SingleLobbyNumberDisplay lobbyData={lobbyData} lobbyId={lobbyId} />
          </Typography>
          <PeopleAltIcon color="primary" sx={{ px: 2 }} />
        </Grid>

        <Grid
          container
          sx={{ border: 1 }}
          display="flex"
          direction="row"
          alignItems="spaced-evenly"
        >
          {questionsData &&
            questionsData.map((question, i) => {
              return (
                <Grid item xs={12} sx={{ border: 1, py: 0 }} key={i}>
                  <Grid container>
                    <Grid
                      item
                      xs={4}
                      sx={{ py: 3 }}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Button variant="outlined">
                        <Link to={`/users/${question.menteeIdAlias.id}`}>
                          <Typography color="hotpink.main">
                            {question.menteeIdAlias.username}
                          </Typography>
                        </Link>
                      </Button>
                    </Grid>
                    <Grid item xs={4} sx={{ py: 3 }}>
                      <Button variant="outlined">
                        <Link
                          to={`/lobbies/${lobbyId}/questions/${question.id}`}
                          key={question.id}
                        >
                          <Typography color="hotpink.main">
                            {question.title}
                          </Typography>
                        </Link>
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{ py: 3 }}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Typography color="hotpink.main">
                        Bounty: {question.tokensOffered}
                      </Typography>
                      <LocalActivityIcon color="primary" sx={{ px: 1 }} />
                    </Grid>
                    {/* darren this is a button to link to each individual question */}
                  </Grid>
                </Grid>
              );
            })}
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ border: 1, py: 5 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <PostQuestionTwo
            lobbyId={lobbyId}
            userData={userData}
            posted={posted}
            setPosted={setPosted}
          />
        </Grid>
        <Grid container>
          <Grid item xs={5} sx={{ border: 1, p: 10 }}>
            <LobbyChatComponent
              userData={userData}
              lobbyId={lobbyId}
              lobbyData={lobbyData}
            />
          </Grid>
          {userData ? (
            <Grid
              item
              xs={7}
              sx={{ border: 1 }}
              display="flex"
              alignItems="center"
            >
              <Grid
                item
                xs={4}
                sx={{ border: 1, py: 6, px: 1, height: 1 }}
                display="flex"
                alignItems="center"
              >
                your current tokens: {userData.tokens}
              </Grid>
              <Grid
                item
                xs={4}
                sx={{ border: 1, py: 6, px: 1, height: 1 }}
                display="flex"
                alignItems="center"
              >
                questions answered: {userAsMentorData}
              </Grid>
              <Grid
                item
                xs={4}
                sx={{ border: 1, py: 6, px: 1, height: 1 }}
                display="flex"
                alignItems="center"
              >
                questions asked: {userAsMenteeData}
              </Grid>
            </Grid>
          ) : (
            <p>loading...</p>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
