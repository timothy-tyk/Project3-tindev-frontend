import React, { useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { BACKEND_URL } from "../constants";
import axios from "axios";
import DashboardFriends from "./DashboardFriends";

//Mui
import { Typography, Card, Grid, Button, Avatar } from "@mui/material";

//Sub Components
import DashboardLobbies from "./DashboardLobbies";
import DashboardQuestions from "./DashboardQuestions";
import DashboardReviews from "./DashboardReviews";

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
  const { logout, user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      props.handleUpdateUser(userData);
      // joinedLobbies();
      // getUserQuestions();
    }
  }, []);

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

  return (
    <div className="container">
      <Card>
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <Card className="dashboard-top-left" variant="outlined">
              <Typography variant="h1" color="primary">
                Dashboard
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card className="dashboard-top-right" variant="outlined">
              <Card className="dashboard-top-right-row1">
                <Button variant="contained">Friends</Button>
                <Button variant="contained">Leaderboard</Button>
                <Button variant="contained">Logout</Button>
              </Card>
              <Card className="dashboard-top-right-row2" variant="outlined">
                <Typography variant="h3" color="primary" align="left">
                  Friends
                </Typography>
                <DashboardFriends user={userData} />
              </Card>
            </Card>
          </Grid>
        </Grid>
      </Card>
      {userData ? (
        <Card>
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <Card variant="outlined" className="dashboard-bottom-left">
                    <div>
                      <Typography variant="h1" color="primary" align="left">
                        Profile
                      </Typography>
                      {/* <Card> */}

                      <Avatar
                        className="profilepic"
                        alt={userData.profilepicture}
                        src={userData.profilepicture}
                        sx={{
                          width: "5vw",
                          height: "auto",
                          marginLeft: "2vw",
                        }}
                      />
                      <Grid container>
                        <Typography
                          variant="h2"
                          align="left"
                          marginTop="1vw"
                          marginLeft="1vw"
                        >
                          {userData.username}
                        </Typography>
                        {/* </Card> */}
                        {/* <Card sx={{ marginTop: "1vh" }}> */}
                        <Typography
                          variant="h6"
                          align="left"
                          sx={{ marginLeft: "1vw", marginTop: "2vw" }}
                        >
                          ({userData.email})
                        </Typography>
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
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Button
                          variant="outlined"
                          onClick={() => {
                            navigate("/editprofile");
                          }}
                        >
                          Edit Profile
                        </Button>
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
                    {/* <div>
                    <h3>Reviews</h3>
                    {userReviews && userReviews.length > 0 ? (
                      <div>
                        <h5>As Reviewer</h5>
                        {userReviewsListReviewer.map((review) => {
                          return (
                            <div>
                              <p>Question Id:{review.questionId}</p>
                              <p>Reviewee:{review.revieweeIdAlias.username}</p>
                              <p>Details:{review.reviewContent}</p>
                            </div>
                          );
                        })}
                        <h5>As Reviewee</h5>
                        {userReviewsListReviewee.map((review) => {
                          return (
                            <div>
                              <p>Question Id:{review.questionId}</p>
                              <p>Reviewer:{review.reviewerIdAlias.username}</p>
                              <p>Details:{review.reviewContent}</p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p>No Reviews Yet</p>
                    )}
                  </div> */}
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
                  >
                    <Typography variant="h3" align="left" color="primary">
                      Tokens
                    </Typography>
                    <Typography variant="h5">{userData.tokens}</Typography>
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
        </Card>
      ) : null}
    </div>
  );
}
