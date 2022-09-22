import React from "react";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../App.js";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import PostQuestion from "./xPostQuestion.js";

export default function SingleLobbyNumberDisplay(props) {
  const [numberOnline, setNumberOnline] = useState(0);
  const lobbyData = props.lobbyData;
  const lobbyId = props.lobbyId;

  const getNumberOnline = async () => {
    const lobbyName = lobbyData.name;
    const response = await axios.get(
      `${BACKEND_URL}/lobbies/${lobbyId}/${lobbyName}/numberOnline`
    );
    setNumberOnline(response.data.length);
  };

  useEffect(() => {
    getNumberOnline();

    const interval = setInterval(() => {
      getNumberOnline();
      console.log("refreshing number online");
    }, 10000);

    return () => clearInterval(interval);
  }, [lobbyData]);

  return (
    <div>
      {numberOnline > 0 &&
        (numberOnline > 1 ? (
          <h4>{numberOnline} people Online</h4>
        ) : (
          <h4>{numberOnline} person Online</h4>
        ))}
    </div>
  );
}

// export default function SingleLobby() {
//   const [userData, setUserData] = useState(useContext(UserContext));
//   const { user } = useAuth0();
//   const navigate = useNavigate();
//   useEffect(() => {
//     if (!user) {
//       navigate("/");
//     } else {
//       console.log("hello", userData);
//     }
//   }, []);

//   return (
//     <div>
//       {" "}
//       <p>Single Lobby</p>
//     </div>
//   );
// }

//components needed:
// 1) questions + post a new question button
// 2) general chat
// 3) user info - tokens, questions answered and asked
