import React from "react";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../App.js";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants";
export default function SingleLobby() {
  const [userData, setUserData] = useState(useContext(UserContext));
  const [questionsList, setQuestionsList] = useState();
  const { user } = useAuth0();
  const { lobbyId } = useParams();
  const navigate = useNavigate();

  const [lobbyData, setLobbyData] = useState([]);

  const getLobbyData = async () => {
    const response = await axios.get(`${BACKEND_URL}/lobbies/${lobbyId}`);
    console.log(response);
    setLobbyData(response.data);
  };
  useEffect(() => {
    console.log(user);
    if (!user) {
      navigate("/");
    } else {
      getLobbyData();
    }

    const listQuestions = async () => {
      try {
        const data = await axios.get("http://localhost:3000/question");
        console.log(data.data);
        setQuestionsList(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    listQuestions();
  }, []);

  return (
    <div>
      {" "}
      <h1>{lobbyData.name} Lobby</h1>
      <h4>{lobbyData.numberOnline} People Online</h4>
      {/*Darren: can paste ur lobby retrieval here, just include the link to questions*/}
      <p>Questions:</p>
      <div>
        {questionsList
          ? questionsList.map((item, i) => (
              <div>
                Title: {item.title} posted by {user.nickname}
                <br></br>Token offer:{item.tokensOffered}
                <Link to={`/questions/${item.id}`} key={item.id}>
                  Question{i + 1}
                </Link>
              </div>
            ))
          : "no qns yet"}{" "}
      </div>
      <button onClick={(e) => navigate("/questions")}>Post a question</button>
    </div>
  );
}
