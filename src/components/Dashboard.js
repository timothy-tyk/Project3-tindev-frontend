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
  const [userRating, setUserRating] = useState();

  const { logout, user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      props.handleUpdateUser(userData);

      newUserData();
      getRatings();
      updateUserLocation();
    }
  }, [props.refresh]);

  const newUserData = async () => {
    const newData = await axios.get(`${BACKEND_URL}/users/${userData.id}`);
    setUserData(newData.data);
    console.log("get new user data!");
  };

  const getRatings = async () => {
    const ratings = await axios.get(
      `${BACKEND_URL}/review/user/${userData.id}`
    );
    console.log(ratings.data);
    let ratingsData = ratings.data.filter(
      (rating) => rating.revieweeIdAlias.id == userData.id
    );
    console.log(ratingsData);
    let total = 0;
    ratingsData.forEach((data) => {
      total += data.rating;
    });
    console.log(total);

    let ratingData = total / ratingsData.length;
    setUserRating(ratingData);
  };

  const updateUserLocation = async () => {
    const updatedLocation = await axios.put(
      `${BACKEND_URL}/users/${userData.id}/updateLocation`,
      { location: "Dashboard" }
    );
    console.log(updatedLocation);
  };

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
                marginBottom="1vh"
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
                          sx={{
                            marginLeft: "1vw",
                            marginTop: "2vw",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          ({userData.email})
                        </Typography>
                      </Grid>
                      <Grid item xs={4} display="flex">
                        <Typography
                          variant="h4"
                          align="right"
                          sx={{
                            display: "flex",
                            alignItems: "end",
                            marginRight: "1vw",
                            display: "flex",
                          }}
                        >
                          {userRating ? (
                            <p>Rating: {userRating} / 5.0</p>
                          ) : (
                            <i>No Rating Yet</i>
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
                  <Grid
                    container
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="h3" marginTop="2vh" color="#FFFFFF">
                      {userData.tokens}
                    </Typography>
                  </Grid>
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
