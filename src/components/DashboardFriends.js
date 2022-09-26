import React, { useEffect, useState } from "react";
import { UserContext } from "../App";
import { BACKEND_URL } from "../constants";
import { Link } from "react-router-dom";
import axios from "axios";

//MUI
import {
  Card,
  Grid,
  Typography,
  Avatar,
  Badge,
  Box,
  styled,
  Stack,
} from "@mui/material";
import ProfileModalDialog from "./ProfileModal";

export default function DashboardFriends(props) {
  const [userData, setUserData] = useState(props.user);
  const [userFriends, setUserFriends] = useState([]);

  useEffect(() => {
    getFriends();
  }, []);

  const getFriends = async () => {
    let friends = [];
    if (userData.friendsList.length > 0) {
      for (let friendId of userData.friendsList) {
        const response = await axios.get(`${BACKEND_URL}/users/${friendId}`);
        friends.push(response.data);
      }
      let onlinefriends = friends.filter((friend) => friend.online);
      let offlinefriends = friends.filter((friend) => !friend.online);
      setUserFriends([...onlinefriends, ...offlinefriends]);
    }
  };
  //MUI StyledBadge
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      marginTop: 20,
      width: "0.5vw",
      height: "0.5vw",
      borderRadius: 25,
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));

  return (
    <Box className="friend-box">
      {userFriends && userFriends.length > 0 ? (
        userFriends.map((friend, index) => {
          return (
            <Card
              key={index}
              className="friend-row"
              sx={{ border: "solid black 1px" }}
            >
              <Grid container>
                <Grid item xs={2} className="friend-row">
                  <Avatar
                    alt="profile"
                    src={friend.profilepicture}
                    className="friend-avatar"
                    sx={{ height: "8vh", width: "8vh" }}
                  />
                  {friend.online ? (
                    <StyledBadge overlap="circular" variant="dot"></StyledBadge>
                  ) : null}
                </Grid>
                <Grid item xs={6} className="friend-name">
                  <ProfileModalDialog
                    handleUpdateUser={props.handleUserData}
                    profileId={friend.id}
                  />
                </Grid>

                <Grid item xs={4} className="friend-name-end">
                  {friend.online ? (
                    <div>
                      <Typography
                        align="right"
                        variant="h5"
                        marginRight="0.5vw"
                      >
                        <i>In {friend.location} Lobby</i>
                      </Typography>
                    </div>
                  ) : (
                    <Typography align="right" variant="h5" marginRight="0.5vw">
                      <i>Offline</i>
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Card>
          );
        })
      ) : (
        <p>No Friends Yet</p>
      )}
    </Box>
  );
}
