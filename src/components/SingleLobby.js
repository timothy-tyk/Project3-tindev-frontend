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
    //dummy data from question routersss
    // const listQuestions = async () => {
    //   try {
    //     const data = await axios.get("http://localhost:3000/question");
    //     console.log(data.data);
    //     setQuestionsList(data.data);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // listQuestions();
  }, []);

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
        {questionsData &&
          questionsData.map((question, i) => {
            return (
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
