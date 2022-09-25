import React, { useEffect, useState } from "react";
import { UserContext } from "../App";
import { BACKEND_URL } from "../constants";
import { Link } from "react-router-dom";
import axios from "axios";

//MUI
import { Card, Grid, Typography, Avatar, Badge, Box } from "@mui/material";

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
      setUserFriends(friends);
    }
  };

  return (
    <div>
      {userFriends && userFriends.length > 0 ? (
        userFriends.map((friend, index) => {
          return (
            <Box
              key={index}
              className="friend-box"
              sx={{
                overflow: "auto",
                overflowY: "scroll",
              }}
            >
              <div key={friend.id} className="friend-row">
                <Grid container>
                  <Grid item xs={2}>
                    <Avatar
                      alt="profile"
                      src={friend.profilepicture}
                      className="friend-avatar"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Link to={`/users/${friend.id}`}>
                      <Typography>{friend.username}</Typography>
                    </Link>
                  </Grid>

                  <Grid item xs={6}>
                    {friend.online ? (
                      <div>
                        <Typography align="right">
                          <i>In {friend.location} Lobby</i>
                        </Typography>
                      </div>
                    ) : (
                      <Typography align="right">
                        <i>Offline</i>
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </div>
            </Box>
          );
        })
      ) : (
        <p>No Friends Yet</p>
      )}
    </div>
  );
}
