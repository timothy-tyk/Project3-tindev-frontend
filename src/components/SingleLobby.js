import React from "react";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../App.js";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import PostQuestion from "./PostQuestion.js";

export default function SingleLobby() {
  const [questionsList, setQuestionsList] = useState();
  const { user } = useAuth0();
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(useContext(UserContext));
  const [lobbyData, setLobbyData] = useState([]);
  const [questionsData, setQuestionsData] = useState([]);
  const [userAsMenteeData, setUserAsMenteeData] = useState([]);
  const [userAsMentorData, setUserAsMentorData] = useState([]);
  const [posted, setPosted] = useState();
  const [numberOnline, setNumberOnline] = useState(0);

  const getLobbyData = async () => {
    const response = await axios.get(`${BACKEND_URL}/lobbies/${lobbyId}`);
    setLobbyData(response.data);
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      getLobbyData();
    }
  }, []);

  const updateUserLocation = async () => {
    const body = {
      userId: userData.id,
      lobbyName: lobbyData.name,
    };
    axios
      .put(`${BACKEND_URL}/lobbies/${lobbyId}/${userData.id}`, body)
      .then((res) => {
        // console.log("res", res.data);
      });
  };

  useEffect(() => {
    updateUserLocation();
    getNumberOnline();

    const interval = setInterval(() => {
      getNumberOnline();
    }, 10000);
  }, [lobbyData]);

  const getNumberOnline = async () => {
    const lobbyName = lobbyData.name;
    const response = await axios.get(
      `${BACKEND_URL}/lobbies/${lobbyId}/${lobbyName}/numberOnline`
    );
    setNumberOnline(response.data.length);
  };

  const getQuestionsData = async () => {
    const response = await axios.get(
      `${BACKEND_URL}/lobbies/${lobbyId}/questions`
    );
    setQuestionsData(response.data);
  };

  useEffect(() => {
    getQuestionsData();
  }, [lobbyData, posted]);

  const getUserStatsData = async () => {
    const responseAsMentee = await axios.get(
      `${BACKEND_URL}/lobbies/${lobbyId}/mentee/${userData.id}`
    );

    const responseAsMentor = await axios.get(
      `${BACKEND_URL}/lobbies/${lobbyId}/mentor/${userData.id}`
    );

    setUserAsMenteeData(responseAsMentee.data.length);
    setUserAsMentorData(responseAsMentor.data.length);
  };

  useEffect(() => {
    // console.log("qd:", questionsData);
    // console.log("ld", lobbyData);
    // console.log("ud", userData);
    getUserStatsData();
  }, [questionsData]);

  useEffect(() => {}, [questionsData]);

  return (
    <div>
      {" "}
      <h1>{lobbyData.name} Lobby</h1>
      <h4>{numberOnline} People Online</h4>
      <div>
        {questionsData &&
          questionsData.map((question, i) => {
            return (
              !question.solved && (
                <div key={question.id}>
                  {question.menteeIdAlias.username}: {question.title} tokens
                  offered: {question.tokensOffered}
                  {/* darren this is a button to link to each individual question */}
                  <Link
                    to={`/lobbies/${lobbyId}/questions/${question.id}`}
                    key={question.id}
                  >
                    <button> Question{i + 1}</button>
                  </Link>
                  <br />
                  <br />
                </div>
              )
            );
          })}
      </div>
      <div>
        <PostQuestion
          lobbyId={lobbyId}
          userData={userData}
          posted={posted}
          setPosted={setPosted}
        />
      </div>
      <br /> <br />
      <div>general chat</div>
      <br /> <br />
      <div>
        {userData ? (
          <p>
            your current tokens: {userData.tokens} <br />
            questions answered: {userAsMentorData}
            <br />
            questions asked: {userAsMenteeData}
          </p>
        ) : (
          <p>loading...</p>
        )}
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
