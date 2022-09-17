import React from "react";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
export default function SingleLobby() {
  const [questionsList, setQuestionsList] = useState();
  const { user } = useAuth0();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(user);
    if (!user) {
      navigate("/");
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
      <p>Single Lobby</p>
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
