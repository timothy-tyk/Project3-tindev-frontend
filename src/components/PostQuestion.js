import React from "react";
import { useState, useContext, UserContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function PostQuestion() {
  const [userData, setUserData] = useState(useContext(UserContext));
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [tokensOffered, setTokensOffered] = useState();
  const menteeId = 1;
  const lobbyId = 1;
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
    const submitBody = { title, details, tokensOffered, menteeId, lobbyId };
    axios.post("http://localhost:3000/question", submitBody).then((res) => {
      setTitle("");
      setDetails("");
      setTokensOffered("");
      alert("u have posted a question");
      navigate("/lobby");
      //or navigate to the individual question id
    });
  };
  return (
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
        Post Question
      </button>
    </div>
  );
}

export default PostQuestion;
