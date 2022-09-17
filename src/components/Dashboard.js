import React, { useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { BACKEND_URL } from "../constants";
import axios from "axios";

export default function Dashboard() {
  const [userData, setUserData] = useState(useContext(UserContext));
  const [availableLobbies, setAvailableLobbies] = useState([]);
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
      console.log(userData);
    }
  }, []);

  const openLobbyList = async () => {
    const lobbies = await axios.get(`${BACKEND_URL}/lobbies`);
    console.log(lobbies.data);
    setAvailableLobbies(lobbies.data);
  };
  // const lobbies = availableLobbies.map((lobby) => {
  //   return (
  //     <div>
  //       <button>{lobby.name}</button>
  //       <p>{lobby.numberOnline} Online</p>
  //     </div>
  //   );
  // });

  // const lobbiesJoined = userData.lobbiesJoin.map((lobby) => <p>{lobby}</p>);

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
            <button
              onClick={() => {
                openLobbyList();
              }}
            >
              + Add
            </button>
            <div>
              {availableLobbies.length > 0
                ? availableLobbies.map((lobby) => {
                    return (
                      <div key={lobby.id}>
                        <button>{lobby.name}</button>
                        <p>{lobby.numberOnline}</p>
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
