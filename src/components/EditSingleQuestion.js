import React from "react";
import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App.js";

function EditSingleQuestion(props) {
  const [userData, setUserData] = useState(useContext(UserContext));
  const [title, setTitle] = useState(props.question.title);
  const [details, setDetails] = useState(props.question.details);
  const [tokensOffered, setTokensOffered] = useState(
    props.question.tokensOffered
  );
  const { lobbyId } = useParams();
  //hard coded
  const navigate = useNavigate();
  const postQuestion = async () => {
    //axios post request to questions router, controller will create into questions model
    //  menteeId: menteeId,
    //   title: title,
    //   details: details,
    //   tokensOffered: tokensOffered,
    //  lobbyId: lobbyId,
    //   status: status,
    //reset input values
    //navigate to that question index
    // const menteeId = props.userData.id;

    const submitBody = {
      title: title,
      details: details,
      tokensOffered: tokensOffered,
      lobbyId: lobbyId,
      questionId: props.question.id,
    };
    axios
      .put("http://localhost:3000/question/editQuestion", submitBody)
      .then((res) => {
        // setTitle("");
        // setDetails("");
        // setTokensOffered("");
        // dont empty it out cus user may want to edit again
        alert("u have edited ur question!");
        props.setEdited(!props.edited);
        // navigate(`/lobbies/${lobbyId}`);
        //or navigate to the individual question id
      });
  };
  return (
    <div>
      <button onClick={(e) => props.setEdited(!props.edited)}>
        Edit question
      </button>
      {props.edited && (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title?"
          />
          <input
            type="text"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Description"
          />
          <input
            type="text"
            value={tokensOffered}
            onChange={(e) => setTokensOffered(e.target.value)}
            placeholder="Tokens Offer?"
          />
          <button type="submit" onClick={postQuestion}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

export default EditSingleQuestion;
