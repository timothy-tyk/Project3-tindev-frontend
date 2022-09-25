import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App.js";
import { useAuth0 } from "@auth0/auth0-react";
import { Container } from "@mui/system";
import { Avatar, Chip, Grid, Typography } from "@mui/material";
import tokenImage from "../images/token.png";
import RichTextDisplay from "./RichTextDisplay.js";
import EditSolved from "./EditSolved.js";
import EditMentor from "./EditMentor.js";
import KickMentor from "./KickMentor.js";
import EditSingleQuestion from "./EditSingleQuestion.js";

function SingleQuestion() {
  const params = useParams();
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(useContext(UserContext));
  const [questionId, setQuestionId] = useState(params.questionId);
  const [lobbyId, setLobbyId] = useState(params.lobbyId);
  const [questionData, setQuestionData] = useState({});
  const [solved, setSolved] = useState();
  const [userIsMentee, setUserIsMentee] = useState();
  const [kicked, setKicked] = useState(false);
  const [editToggle, setEditToggle] = useState();
  const [edited, setEdited] = useState();

  const getQuestionData = async () => {
    const response = await axios.get(
      `http://localhost:3000/question/${questionId}`
    );
    setQuestionData(response.data[0]);
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      getQuestionData();
    }
    // eslint-disable-next-line
  }, [edited]);

  useEffect(() => {
    console.log(questionData);
    if (questionData.solved === true) {
      setSolved(true);
    } else {
      setSolved(false);
    }
  }, [questionData]);

  useEffect(() => {
    if (questionData.menteeId === userData.id) {
      setUserIsMentee(true);
    } else setUserIsMentee(false);
  }, [solved]);

  function time_ago(time) {
    switch (typeof time) {
      case "number":
        break;
      case "string":
        time = +new Date(time);
        break;
      case "object":
        if (time.constructor === Date) time = time.getTime();
        break;
      default:
        time = +new Date();
    }
    var time_formats = [
      [60, "seconds", 1], // 60
      [120, "1 minute ago", "1 minute from now"], // 60*2
      [3600, "minutes", 60], // 60*60, 60
      [7200, "1 hour ago", "1 hour from now"], // 60*60*2
      [86400, "hours", 3600], // 60*60*24, 60*60
      [172800, "Yesterday", "Tomorrow"], // 60*60*24*2
      [604800, "days", 86400], // 60*60*24*7, 60*60*24
      [1209600, "Last week", "Next week"], // 60*60*24*7*4*2
      [2419200, "weeks", 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, "Last month", "Next month"], // 60*60*24*7*4*2
      [29030400, "months", 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, "Last year", "Next year"], // 60*60*24*7*4*12*2
      [2903040000, "years", 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, "Last century", "Next century"], // 60*60*24*7*4*12*100*2
      [58060800000, "centuries", 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
      token = "ago",
      list_choice = 1;

    if (seconds == 0) {
      return "Just now";
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = "from now";
      list_choice = 2;
    }
    var i = 0,
      format;
    while ((format = time_formats[i++]))
      if (seconds < format[0]) {
        if (typeof format[2] == "string") return format[list_choice];
        else
          return (
            Math.floor(seconds / format[2]) + " " + format[1] + " " + token
          );
      }
    return time;
  }

  return (
    <div>
      {/* render if question has been solved */}
      {solved && (
        <div>
          {questionData.title}
          <br />
          {`${time_ago(new Date(questionData.createdAt))}`}
          <br />
          status:
          <span className="dotSolved"></span>
          <br />
          {`Tokens Offer:${questionData.tokensOffered}`}
          <br />
          {questionData.details && (
            <RichTextDisplay richText={questionData.details} />
          )}
          <br />
          {questionData.imgUrl && (
            <img
              className="questionpic"
              alt="qns img"
              src={questionData.imgUrl}
            />
          )}
          {(questionData.menteeId === userData.id ||
            questionData.mentorId === userData.id) && (
            <div>
              "Question has been solved!"
              <div>
                <button
                  onClick={(e) =>
                    navigate(
                      `/lobbies/${lobbyId}/questions/${questionId}/chatroom`
                    )
                  }
                >
                  Go to chatroom
                </button>
              </div>
            </div>
          )}
          <button onClick={(e) => navigate(-1)}>Go back</button>
        </div>
      )}
      {/* .
      .
      .
      .
      .
      . */}
      {/* render if question is not yet solved */}
      {!solved && (
        <div>
          {questionData.title}
          <br />
          {`${time_ago(new Date(questionData.createdAt))}`}
          <br />
          status:
          <span className="dotNotSolved"></span>
          <br />
          {`Tokens Offer:${questionData.tokensOffered}`}
          <br />
          {questionData.details && (
            <RichTextDisplay richText={questionData.details} />
          )}
          <br />
          {questionData.imgUrl && (
            <img
              className="questionpic"
              alt="qns img"
              src={questionData.imgUrl}
            />
          )}
          {/* .
      .
      .
      .
      .
      . */}
          {/* prefix: not yet solved, render if user is the person who asked the question aka mentee */}
          {questionData.menteeId === userData.id && (
            <div>
              {!questionData.mentorId && (
                <EditSingleQuestion
                  question={questionData}
                  edited={edited}
                  setEdited={setEdited}
                />
              )}

              <EditSolved question={questionData} />
              {/* render if mentor exists */}
              {questionData.mentorId && questionData.mentorId !== userData.id && (
                <div>
                  <KickMentor
                    questionId={questionData.id}
                    kicked={kicked}
                    setKicked={setKicked}
                  />
                  <button
                    onClick={(e) =>
                      navigate(
                        `/lobbies/${lobbyId}/questions/${questionId}/chatroom`
                      )
                    }
                  >
                    Go to chatroom
                  </button>
                </div>
              )}
            </div>
          )}
          {/* .
      .
      .
      .
      .
      . */}
          {/* prefix: not yet solved, render if user is NOT the person who asked the question, not necessarily mentor YET*/}
          {questionData.mentorId === null &&
            questionData.menteeId !== userData.id && (
              <div>
                <EditMentor question={questionData} />
              </div>
            )}
          {/* .
      .
      .
      .
      .
      . */}
          {/* prefix: not yet solved, render if user is the mentor*/}
          {questionData.mentorId === userData.id && (
            <div>
              You are the mentor for this question
              <button
                onClick={(e) =>
                  navigate(
                    `/lobbies/${lobbyId}/questions/${questionId}/chatroom`
                  )
                }
              >
                Go to chatroom
              </button>
            </div>
          )}
          <button onClick={(e) => navigate(-1)}>Go back</button>
        </div>
      )}
    </div>
  );
}

export default SingleQuestion;
