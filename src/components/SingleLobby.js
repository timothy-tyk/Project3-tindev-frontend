import React from "react";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../App.js";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import PostQuestion from "./PostQuestion.js";
import SingleLobbyNumberDisplay from "./SingleLobbyNumberDisplay.js";
import LobbyChatComponent from "./LobbyChatComponent.js";
import PostQuestionTwo from "./PostQuestionTwo.js";

export default function SingleLobby() {
  const { user } = useAuth0();
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [userData, setUserData] = useState(useContext(UserContext));
  const [lobbyData, setLobbyData] = useState([]);
  const [questionsData, setQuestionsData] = useState([]);
  const [userAsMenteeData, setUserAsMenteeData] = useState([]);
  const [userAsMentorData, setUserAsMentorData] = useState([]);
  const [posted, setPosted] = useState();

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
    // eslint-disable-next-line
  }, []);

  const updateUserLocation = async () => {
    const body = {
      userId: userData.id,
      lobbyName: lobbyData.name,
    };
    axios
      .put(`${BACKEND_URL}/lobbies/${lobbyId}/${userData.id}`, body)
      .then((res) => {});
  };

  useEffect(() => {
    updateUserLocation();
    // eslint-disable-next-line
  }, [lobbyData]);

  const getQuestionsData = async () => {
    const response = await axios.get(
      `${BACKEND_URL}/lobbies/${lobbyId}/questions`
    );
    setQuestionsData(response.data);
  };

  useEffect(() => {
    getQuestionsData();
    // eslint-disable-next-line
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
    getUserStatsData();
    // eslint-disable-next-line
  }, [questionsData]);

  return (
    <div>
      {" "}
      <h1>{lobbyData.name} Lobby</h1>
      <SingleLobbyNumberDisplay lobbyData={lobbyData} lobbyId={lobbyId} />
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
        <PostQuestionTwo
          lobbyId={lobbyId}
          userData={userData}
          posted={posted}
          setPosted={setPosted}
        />
      </div>
      <br /> <br />
      <div>
        <LobbyChatComponent
          userData={userData}
          lobbyId={lobbyId}
          lobbyData={lobbyData}
        />
      </div>
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
