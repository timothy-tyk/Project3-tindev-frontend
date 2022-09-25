import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";
import { BACKEND_URL } from "../constants";
import { Link } from "react-router-dom";
import axios from "axios";

//MUI
import { Typography, Grid, Box, Avatar, Card, Button } from "@mui/material";

export default function DashboardLobbies(props) {
  const [userData, setUserData] = useState(useContext(UserContext));
  const [availableLobbies, setAvailableLobbies] = useState([]);
  const [lobbiesJoined, setLobbiesJoined] = useState([]);
  const [showAvailableLobbies, setShowAvailableLobbies] = useState(false);
  const [lobbyInfo, setLobbyInfo] = useState({});
  const [showLobbyInfo, setShowLobbyInfo] = useState();
  const [showLobbyInfo2, setShowLobbyInfo2] = useState();

  useEffect(() => {
    joinedLobbies();
  }, []);

  // Lobby Join Functionality
  const openLobbyList = async () => {
    const lobbies = await axios.get(`${BACKEND_URL}/lobbies`);
    console.log("lobbies", lobbies);
    if (userData.lobbiesJoin) {
      let availLobbies = lobbies.data.filter(
        (lobby) => !userData.lobbiesJoin.includes(lobby.id)
      );
      console.log(availLobbies, "availLobbies");
      setAvailableLobbies(availLobbies);
    } else {
      setAvailableLobbies(lobbies.data);
    }
  };
  const joinedLobbies = async () => {
    const response = await axios.get(
      `${BACKEND_URL}/users/${userData.id}/lobbies`
    );
    console.log("getJoinnedLobbies", response.data);
    setLobbiesJoined(response.data);
  };
  const joinLobby = async (lobbyId) => {
    const updatedUserData = await axios.post(
      `${BACKEND_URL}/users/${userData.id}/joinlobby/${lobbyId}`,
      { prevLobbies: userData.lobbiesJoin }
    );
    setUserData(updatedUserData.data);
    joinedLobbies();
    openLobbyList();
    setShowAvailableLobbies(false);
    props.handleUpdateUser(updatedUserData.data);
  };

  const getLobbyInfo = async (lobbyId) => {
    const response = await axios.get(`${BACKEND_URL}/lobbies/${lobbyId}`);
    setLobbyInfo(response.data);
  };

  return (
    <div>
      <Typography variant="h3" color="primary" align="left">
        Lobbies
      </Typography>
      <Box className="lobbies-box">
        {lobbiesJoined && lobbiesJoined.length > 0
          ? lobbiesJoined.map(({ lobby }) => {
              return (
                <Grid
                  container
                  className="lobbies-row"
                  sx={{ display: "inline-block" }}
                >
                  <Card>
                    <Grid
                      container
                      className="lobbies-row"
                      sx={{ display: "block" }}
                    >
                      <div key={lobby.id}>
                        <Typography
                          align="left"
                          variant="h4"
                          onClick={() => {
                            setShowLobbyInfo(lobby.id);
                            setShowLobbyInfo2();
                            getLobbyInfo(lobby.id);
                          }}
                        >
                          {lobby.name}
                        </Typography>
                        {/* <Grid container> */}
                        {lobby.id == showLobbyInfo &&
                        Object.keys(lobbyInfo).length > 0 ? (
                          <>
                            <Link to={`/lobbies/${lobby.id}`} className="links">
                              <Grid item className="lobbies-info">
                                <Typography variant="h6">Online</Typography>
                                <Avatar color="secondary">
                                  {lobbyInfo.numberOnline}
                                </Avatar>
                              </Grid>
                              <Grid item className="lobbies-info">
                                <Typography variant="h6">
                                  Unanswered Questions
                                </Typography>
                                <Avatar color="secondary">
                                  {lobbyInfo.questions.length}
                                </Avatar>
                              </Grid>
                            </Link>
                          </>
                        ) : null}
                        {/* </Grid> */}
                      </div>
                    </Grid>
                  </Card>
                </Grid>
              );
            })
          : null}
        <Grid container className="lobbies-add-button">
          <Button
            onClick={() => {
              openLobbyList();
              setShowAvailableLobbies(true);
            }}
          >
            + Add
          </Button>
        </Grid>
        <Grid
          container
          className="lobbies-row"
          sx={{ display: "inline-block" }}
        >
          {showAvailableLobbies && availableLobbies.length > 0
            ? availableLobbies.map((lobby) => {
                return (
                  <div key={lobby.id}>
                    <Typography
                      align="left"
                      variant="h4"
                      onClick={() => {
                        setShowLobbyInfo2(lobby.id);
                        setShowLobbyInfo();
                        getLobbyInfo(lobby.id);
                      }}
                    >
                      {lobby.name}
                    </Typography>

                    {lobby.id == showLobbyInfo2 &&
                    Object.keys(lobbyInfo).length > 0 ? (
                      <>
                        <Grid container className="lobbies-add-button">
                          <Button
                            onClick={() => {
                              joinLobby(lobby.id);
                            }}
                          >
                            Join
                          </Button>
                        </Grid>
                        <Link to={`/lobbies/${lobby.id}`} className="links">
                          <Grid item className="lobbies-info">
                            <Typography variant="h6">Online</Typography>
                            <Avatar color="secondary">
                              {lobbyInfo.numberOnline}
                            </Avatar>
                          </Grid>
                          <Grid item className="lobbies-info">
                            <Typography variant="h6">
                              Unanswered Questions
                            </Typography>
                            <Avatar color="secondary">
                              {lobbyInfo.questions.length}
                            </Avatar>
                          </Grid>
                        </Link>
                      </>
                    ) : null}
                  </div>
                );
              })
            : null}
        </Grid>
      </Box>
    </div>
  );
}
