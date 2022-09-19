import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { UserContext } from "../App";
import axios from "axios";
import {
  getDownloadURL,
  getStorage,
  ref as storageReference,
  uploadBytes,
} from "firebase/storage";
import { set, push, ref as databaseRef } from "firebase/database";
import { storage, database } from "../DB/firebase";
import { BACKEND_URL } from "../constants";

export default function Profile(props) {
  const { user } = useAuth0();
  const { profileId } = useParams();
  const [userData, setUserData] = useState(useContext(UserContext));
  const [profileData, setProfileData] = useState({});
  const [profileQuestions, setProfileQuestions] = useState([]);
  const [questionsList, setQuestionsList] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [lobbiesJoined, setLobbiesJoined] = useState([]);
  const [lobbyInfo, setLobbyInfo] = useState({});
  const [showLobbyInfo, setShowLobbyInfo] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      getProfileData(profileId);
      getProfileQuestions(profileId);
      joinedLobbies();
    }
  }, []);

  const getProfileData = async (profileId) => {
    const profile = await axios.get(`${BACKEND_URL}/users/${profileId}`);
    console.log(profile.data);
    setProfileData(profile.data);
  };

  const getProfileQuestions = async () => {
    const response = await axios.get(
      `${BACKEND_URL}/question/users/${profileId}`
    );
    let questions = response.data;
    let questionsData = [];
    for (let question of questions) {
      question = await axios.get(`${BACKEND_URL}/question/${question.id}`);
      questionsData.push(question.data[0]);
    }
    setProfileQuestions(questionsData);
  };

  let questionsAnswered = profileQuestions.filter(
    (question) => question.mentorId == profileId
  );
  let questionsAsked = profileQuestions.filter(
    (question) => question.menteeId == profileId
  );

  const openQuestionsList = (type) => {
    if (type == "answered") {
      setQuestionsList(questionsAnswered);
    } else {
      setQuestionsList(questionsAsked);
    }
  };
  // Get Lobby Info
  const joinedLobbies = async () => {
    const response = await axios.get(
      `${BACKEND_URL}/users/${profileId}/lobbies`
    );
    setLobbiesJoined(response.data);
  };

  return (
    <div>
      <h1>PROFILE</h1>
      {profileData && Object.keys(profileData).length > 0 ? (
        <div>
          <img
            className="profilepic"
            src={profileData.profilepicture}
            alt={profileData.profilepicture}
          />
          <p>Username: {profileData.username}</p>
          <p>Email: {profileData.email}</p>
          {profileData.online ? <p>Online Now</p> : <p>Offline</p>}
          <p>Rating: {profileData.rating}</p>
          <button
            onClick={() => {
              setShowQuestions(!showQuestions);
              openQuestionsList("answered");
            }}
          >
            {questionsAnswered.length} Questions Answered
          </button>
          <button
            onClick={() => {
              setShowQuestions(!showQuestions);
              openQuestionsList("asked");
            }}
          >
            {questionsAsked.length} Questions Asked
          </button>
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
        </div>
      ) : null}
      <div>
        <h4>Lobbies Joined</h4>
        {lobbiesJoined && lobbiesJoined.length > 0
          ? lobbiesJoined.map(({ lobby }) => {
              return (
                <div key={lobby.id}>
                  <button
                    onClick={() => {
                      navigate(`/lobbies/${lobby.id}`);
                    }}
                  >
                    {lobby.name}
                  </button>
                  {/* {lobby.id == showLobbyInfo ? (
                    <div>
                      <p>
                        {lobby.numberOnline} people online!
                        {lobby.questions.length} unanswered questions!{" "}
                        <Link to={`/lobbies/${lobby.id}`}>Enter Lobby</Link>
                      </p>
                    </div>
                  ) : null} */}
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}
