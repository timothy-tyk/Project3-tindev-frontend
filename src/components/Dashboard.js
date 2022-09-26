import React, { useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { BACKEND_URL } from "../constants";
import axios from "axios";
import DashboardFriends from "./DashboardFriends";

//Mui
import { Typography, Card, Grid, Button, Avatar } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

//Sub Components
import DashboardLobbies from "./DashboardLobbies";
import DashboardQuestions from "./DashboardQuestions";
import DashboardReviews from "./DashboardReviews";
import EditProfileModalDialogs from "./EditProfileModal";

export default function Dashboard(props) {
  const [userData, setUserData] = useState(useContext(UserContext));
  const [userQuestions, setUserQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questionsList, setQuestionsList] = useState();
  const [availableLobbies, setAvailableLobbies] = useState([]);
  const [lobbiesJoined, setLobbiesJoined] = useState([]);
  const [showAvailableLobbies, setShowAvailableLobbies] = useState(false);
  const [lobbyInfo, setLobbyInfo] = useState({});
  const [showLobbyInfo, setShowLobbyInfo] = useState();
  const [userFriends, setUserFriends] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [editModalClose, setEditModalClose] = useState(false);
  const { logout, user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      props.handleUpdateUser(userData);
      joinedLobbies();
      getUserQuestions();
      getFriends();
      getReviews();
      newUserData();
    }
  }, [props.refresh]);

  const newUserData = async () => {
    const newData = await axios.get(`${BACKEND_URL}/users/${userData.id}`);
    setUserData(newData.data);
    console.log("get new user data!");
  };

  // Get Questions associated to the current User
  // const getUserQuestions = async () => {
  //   const response = await axios.get(
  //     `${BACKEND_URL}/question/users/${userData.id}`
  //   );
  //   let questions = response.data;
  //   let questionsData = [];
  //   for (let question of questions) {
  //     question = await axios.get(`${BACKEND_URL}/question/${question.id}`);
  //     questionsData.push(question.data[0]);
  //   }
  //   setUserQuestions(questionsData);
  // };

  // let questionsAnswered = userQuestions.filter(
  //   (question) => question.mentorId == userData.id
  // );
  // let questionsAsked = userQuestions.filter(
  //   (question) => question.menteeId == userData.id
  // );

  // const openQuestionsList = (type) => {
  //   if (type == "answered") {
  //     setQuestionsList(questionsAnswered);
  //   } else {
  //     setQuestionsList(questionsAsked);
  //   }
  // };

  // Lobby Join Functionality
  // const openLobbyList = async () => {
  //   const lobbies = await axios.get(`${BACKEND_URL}/lobbies`);
  //   console.log("lobbies", lobbies);
  //   if (userData.lobbiesJoin) {
  //     let availLobbies = lobbies.data.filter(
  //       (lobby) => !userData.lobbiesJoin.includes(lobby.id)
  //     );
  //     console.log(availLobbies, "availLobbies");
  //     setAvailableLobbies(availLobbies);
  //   } else {
  //     setAvailableLobbies(lobbies.data);
  //   }
  // };
  // const joinedLobbies = async () => {
  //   const response = await axios.get(
  //     `${BACKEND_URL}/users/${userData.id}/lobbies`
  //   );
  //   setLobbiesJoined(response.data);
  // };
  // const joinLobby = async (lobbyId) => {
  //   const updatedUserData = await axios.post(
  //     `${BACKEND_URL}/users/${userData.id}/joinlobby/${lobbyId}`,
  //     { prevLobbies: userData.lobbiesJoin }
  //   );
  //   setUserData(updatedUserData.data);
  //   joinedLobbies();
  //   openLobbyList();
  //   setShowAvailableLobbies(false);
  //   props.handleUpdateUser(updatedUserData.data);
  // };

  // const getLobbyInfo = async (lobbyId) => {
  //   const response = await axios.get(`${BACKEND_URL}/lobbies/${lobbyId}`);
  //   setLobbyInfo(response.data);
  // };

  // const getFriends = async () => {
  //   let friends = [];
  //   if (userData.friendsList.length > 0) {
  //     for (let friendId of userData.friendsList) {
  //       const response = await axios.get(`${BACKEND_URL}/users/${friendId}`);
  //       friends.push(response.data);
  //     }
  //     setUserFriends(friends);
  //   }
  // };

  const refreshData = (data) => {
    setUserData(data);
  };

  return (
    <div className="container">
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <Card className="dashboard-top-left" variant="outlined">
            <Typography variant="h1" color="primary" marginLeft="0.5vw">
              Dashboard
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <div className="dashboard-top-right">
            <Card className="dashboard-top-right-row1">
              <Button variant="contained" fullWidth sx={{ borderRadius: 50 }}>
                Friends
              </Button>
              <Button variant="outlined" fullWidth sx={{ borderRadius: 50 }}>
                Leaderboard
              </Button>
              <Button variant="outlined" fullWidth sx={{ borderRadius: 50 }}>
                Logout
              </Button>
            </Card>
            <Card
              className="dashboard-top-right-row2 scroll"
              variant="outlined"
              sx={{ maxHeight: "29vh", overflowY: "auto", marginBottom: "1vh" }}
            >
              <Typography
                variant="h2"
                color="primary"
                align="left"
                marginLeft="0.5vw"
              >
                Friends
              </Typography>
              <DashboardFriends user={userData} />
            </Card>
          </div>
        </Grid>
      </Grid>

      {userData ? (
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <Grid container spacing={1}>
              <Grid item xs={8}>
                <Card variant="outlined" className="dashboard-bottom-left">
                  <div>
                    <Typography
                      variant="h1"
                      color="primary"
                      align="left"
                      marginLeft="0.5vw"
                    >
                      Profile
                    </Typography>
                    {/* <Card> */}

                    <Avatar
                      className="profilepic"
                      alt={userData.profilepicture}
                      src={userData.profilepicture}
                      sx={{
                        width: "10vw",
                        height: "auto",
                        marginLeft: "2vw",
                      }}
                    />
                    <Grid container>
                      <Grid item xs={8} sx={{ display: "flex" }}>
                        <Typography
                          variant="h2"
                          align="left"
                          marginTop="1vw"
                          marginLeft="1vw"
                        >
                          {userData.username}
                        </Typography>

                        <Typography
                          variant="h6"
                          align="left"
                          sx={{ marginLeft: "1vw", marginTop: "2vw" }}
                        >
                          ({userData.email})
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          variant="h4"
                          align="right"
                          sx={{
                            display: "flex",
                            alignItems: "end",
                            marginRight: "1vw",
                          }}
                        >
                          {userData.rating ? (
                            <p>Rating: {userData.rating} / 5.0</p>
                          ) : (
                            <i>No Rating yet</i>
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                    {/* </Card> */}
                    {/* <Card sx={{ marginTop: "1vh" }}> */}
                    <Typography
                      variant="h5"
                      align="left"
                      sx={{ marginLeft: "1vw" }}
                    >
                      <i>{userData.bio}</i>
                    </Typography>
                    {/* </Card> */}

                    <br />
                    <Grid
                      className="dashboard-edit-profile"
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      {/* <Button>
                        <EditIcon fontSize="large" />
                      </Button> */}
                      <EditProfileModalDialogs
                        userData={userData}
                        handleSignIn={props.handleUpdateUser}
                        handleRefreshData={refreshData}
                      />
                    </Grid>
                  </div>
                </Card>
              </Grid>

              <Grid item xs={4}>
                <Card
                  variant="outlined"
                  className="dashboard-bottom-left-right"
                >
                  <DashboardReviews user={userData} />
                </Card>
                <Card
                  variant="outlined"
                  className="dashboard-bottom-left-right"
                >
                  <DashboardQuestions user={userData} />
                </Card>
                <Card
                  variant="outlined"
                  className="dashboard-bottom-left-right"
                  sx={{ maxHeight: "17vh", position: "relative" }}
                >
                  <Typography
                    variant="h2"
                    align="left"
                    color="primary"
                    marginLeft="0.5vw"
                  >
                    Tokens
                  </Typography>
                  <Typography variant="h4">{userData.tokens}</Typography>
                  <Grid container className="token-add">
                    <Button>
                      {/* <Typography fontWeight="500" fontSize={20}>
                        + Add
                      </Typography> */}
                      <AddCircleIcon fontSize="large" />
                    </Button>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Card variant="outlined" className="dashboard-bottom-right">
              <DashboardLobbies user={userData} />
            </Card>
          </Grid>
        </Grid>
      ) : null}
    </div>
  );
}
