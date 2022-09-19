import React, { useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { BACKEND_URL } from "../constants";
import axios from "axios";

export default function Dashboard(props) {
  const [userData, setUserData] = useState(useContext(UserContext));
  const [userQuestions, setUserQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questionsList, setQuestionsList] = useState();
  const [availableLobbies, setAvailableLobbies] = useState([]);
  const [lobbiesJoined, setLobbiesJoined] = useState([]);
  const [showAvailableLobbies, setShowAvailableLobbies] = useState(false);
  const [lobbyInfo, setLobbyInfo] = useState({});
  const [showLobbyInfo, setShowLobbyInfo] = useState();
  const [userFriends, setUserFriends] = useState([]);
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
      getUserQuestions();
      getFriends();
    }
  }, []);

  // Get Questions associated to the current User
  const getUserQuestions = async () => {
    const response = await axios.get(
      `${BACKEND_URL}/question/users/${userData.id}`
    );
    let questions = response.data;
    let questionsData = [];
    for (let question of questions) {
      question = await axios.get(`${BACKEND_URL}/question/${question.id}`);
      questionsData.push(question.data[0]);
    }
    setUserQuestions(questionsData);
  };

  let questionsAnswered = userQuestions.filter(
    (question) => question.mentorId == userData.id
  );
  let questionsAsked = userQuestions.filter(
    (question) => question.menteeId == userData.id
  );

  const openQuestionsList = (type) => {
    if (type == "answered") {
      setQuestionsList(questionsAnswered);
    } else {
      setQuestionsList(questionsAsked);
    }
  };

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

  const getFriends = async () => {
    let friends = [];
    if (userData.friendsList.length > 0) {
      for (let userId of userData.friendsList) {
        console.log(userId);
        const response = await axios.get(`${BACKEND_URL}/users/${userId}`);
        friends.push(response.data);
      }
      setUserFriends(friends);
    }
  };

  return (
    <div>
      {" "}
      <h1>USER DASHBOARD</h1>
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
          <p>
            Activity Ratio:{" "}
            <button
              onClick={() => {
                setShowQuestions(!showQuestions);
                getUserQuestions();
                openQuestionsList("answered");
              }}
            >
              {questionsAnswered.length} Questions Answered{" "}
            </button>
            /
            <button
              onClick={() => {
                setShowQuestions(!showQuestions);
                openQuestionsList("asked");
              }}
            >
              {questionsAsked.length} Questions Asked
            </button>
          </p>
          {showQuestions && questionsList
            ? questionsList.map((question) => {
                return (
                  <div key={question.id}>
                    <p>Asked By: {question.menteeIdAlias.username}</p>
                    <p>
                      Answered By:
                      {question.mentorIdAlias
                        ? question.mentorIdAlias.username
                        : null}
                    </p>
                    <p>Title: {question.title}</p>
                    <Link
                      to={`/lobbies/${question.lobbyId}/questions/${question.id}`}
                    >
                      Go To Question
                    </Link>
                  </div>
                );
              })
            : null}
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
            {lobbiesJoined && lobbiesJoined.length > 0
              ? lobbiesJoined.map(({ lobby }) => {
                  return (
                    <div key={lobby.id}>
                      <button
                        onClick={() => {
                          setShowLobbyInfo(lobby.id);
                          getLobbyInfo(lobby.id);
                        }}
                      >
                        {lobby.name}
                      </button>
                      {lobby.id == showLobbyInfo &&
                      Object.keys(lobbyInfo).length > 0 ? (
                        <div>
                          <p>
                            {lobbyInfo.numberOnline} people online!
                            {lobbyInfo.questions.length} unanswered questions!{" "}
                            <Link to={`/lobbies/${lobby.id}`}>Enter Lobby</Link>
                          </p>
                        </div>
                      ) : null}
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
      <div>
        <h3>Friends</h3>
        {userFriends && userFriends.length > 0
          ? userFriends.map((friend) => {
              return (
                <div key={friend.id}>
                  <Link to={`/users/${friend.id}`}>
                    <p>{friend.username}</p>
                  </Link>
                  {friend.online ? <p>Online</p> : null}
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}
