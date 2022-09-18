import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { UserContext } from "../App";

export default function SingleLobby() {
  const { user } = useAuth0();
  const { lobbyId } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(useContext(UserContext));
  const [lobbyData, setLobbyData] = useState([]);
  const [questionsData, setQuestionsData] = useState([]);
  const [userAsMenteeData, setUserAsMenteeData] = useState([]);
  const [userAsMentorData, setUserAsMentorData] = useState([]);

  const getLobbyData = async () => {
    const response = await axios.get(`${BACKEND_URL}/lobbies/${lobbyId}`);
    // console.log(response);
    setLobbyData(response.data);
  };

  useEffect(() => {
    console.log(user);
    if (!user) {
      navigate("/");
    } else {
      getLobbyData();
    }
  }, []);

  const getQuestionsData = async () => {
    const response = await axios.get(
      `${BACKEND_URL}/lobbies/${lobbyId}/questions`
    );
    setQuestionsData(response.data);
  };

  useEffect(() => {
    getQuestionsData();
  }, [lobbyData]);

  const getUserStatsData = async () => {
    const responseAsMentee = await axios.get(
      `${BACKEND_URL}/lobbies/${lobbyId}/mentee/${userData.id}`
    );

    const responseAsMentor = await axios.get(
      `${BACKEND_URL}/lobbies/${lobbyId}/mentor/${userData.id}`
    );
    // const responseAsMentor = await axios.get(
    //   `${BACKEND_URL}/lobbies/${lobbyId}/usermentor`,
    //   {
    //     userId: userData.id,
    //   }
    // );

    console.log(responseAsMentee.data);
    console.log(responseAsMentor.data);
    setUserAsMenteeData(responseAsMentee.data.length);
    setUserAsMentorData(responseAsMentor.data.length);
  };

  useEffect(() => {
    console.log("qd:", questionsData);
    getUserStatsData();
  }, [questionsData]);

  return (
    <div>
      {" "}
      <h1>{lobbyData.name} Lobby</h1>
      <h4>{lobbyData.numberOnline} People Online</h4>
      <div>
        {questionsData.map((question) => {
          return (
            <div key={question.id}>
              {question.menteeIdAlias.username}: {question.title} tokens
              offered: {question.tokensOffered}
              <button>go to question</button>
              <br />
              <br />
            </div>
          );
        })}
      </div>
      <div>
        <button>post a new question!</button>
      </div>
      <br /> <br />
      <div>general chat</div>
      <br /> <br />
      <div>
        your current tokens: {userData.tokens} <br />
        questions answered: {userAsMentorData}
        <br />
        questions asked: {userAsMenteeData}
      </div>
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
