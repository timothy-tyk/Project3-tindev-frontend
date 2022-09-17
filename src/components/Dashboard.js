import React, { useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { BACKEND_URL } from "../constants";
import axios from "axios";

export default function Dashboard(props) {
  const [userData, setUserData] = useState(useContext(UserContext));
  const [userUpdate, setUserUpdate] = useState(false);
  const [availableLobbies, setAvailableLobbies] = useState([]);
  const [lobbiesJoined, setLobbiesJoined] = useState([]);
  const [showAvailableLobbies, setShowAvailableLobbies] = useState(false);
  const { logout, user } = useAuth0();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("logout");
    logout();
  };
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      props.handleUpdateUser(userData);
      joinedLobbies();
    }
  }, []);

  // Lobby Join Functionality
  const openLobbyList = async () => {
    const lobbies = await axios.get(`${BACKEND_URL}/lobbies`);
    if (userData.lobbiesJoin) {
      let availLobbies = lobbies.data.filter(
        (lobby) => !userData.lobbiesJoin.includes(lobby.id)
      );
      setAvailableLobbies(availLobbies);
    } else {
      setAvailableLobbies(lobbies.data);
    }
  };
  const joinedLobbies = async () => {
    const response = await axios.get(
      `${BACKEND_URL}/users/${userData.id}/lobbies`
    );
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

  return (
    <div>
      {" "}
      <p>DASHBOARD</p>
      {userData ? (
        <div>
          <img
            className="profilepic"
            alt={userData.profilepicture}
            src={userData.profilepicture}
          />
          <p>Username : {userData.username}</p>
          <p>Email : {userData.email}</p>
          <p>Bio : {userData.bio}</p>
          <p>Tokens : {userData.tokens}</p>
          <br />
          <button
            onClick={() => {
              navigate("/profile");
            }}
          >
            Edit Profile
          </button>
          <div>
            <h4>Lobbies</h4>
            {lobbiesJoined.length > 0
              ? lobbiesJoined.map(({ lobby }) => {
                  return (
                    <div key={lobby.id}>
                      <button>
                        <Link to={`/lobbies/${lobby.id}`}>{lobby.name}</Link>
                      </button>
                    </div>
                  );
                })
              : null}
            <button
              onClick={() => {
                openLobbyList();
                setShowAvailableLobbies(true);
              }}
            >
              + Add
            </button>
            <div>
              {showAvailableLobbies && availableLobbies.length > 0
                ? availableLobbies.map((lobby) => {
                    return (
                      <div key={lobby.id}>
                        <button>
                          <Link to={`/lobbies/${lobby.id}`}>{lobby.name}</Link>
                        </button>
                        <button
                          onClick={() => {
                            joinLobby(lobby.id);
                          }}
                        >
                          Join
                        </button>
                        <p>{lobby.numberOnline} online</p>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
