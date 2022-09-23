import React from "react";
import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App.js";
import RichTextEditor from "./RichTextEditor.js";
import { Button } from "@mui/material";
function EditSingleQuestion(props) {
  const [userData, setUserData] = useState(useContext(UserContext));
  const [title, setTitle] = useState(props.question.title);
  const [text, setText] = useState(props.question.details);
  const [tokensOffered, setTokensOffered] = useState(
    props.question.tokensOffered
  );
  const { lobbyId } = useParams();

  const navigate = useNavigate();

  const getRichText = async (item) => {
    setText(item);
    console.log(item, "rich text");
  };

  const postQuestion = async () => {
    const submitBody = {
      title: title,
      details: text,
      tokensOffered: tokensOffered,
      lobbyId: lobbyId,
      questionId: props.question.id,
    };
    axios
      .put("http://localhost:3000/question/editQuestion", submitBody)
      .then((res) => {
        alert("u have edited ur question!");
        props.setEdited(!props.edited);
      });
  };
  return (
    <div>
      <Button
        variant="outlined"
        onClick={(e) => props.setEdited(!props.edited)}
      >
        Edit question
      </Button>

      {props.edited && (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title?"
          />
          <RichTextEditor
            getRichText={(item) => getRichText(item)}
            text={text}
          />
          <input
            type="text"
            value={tokensOffered}
            onChange={(e) => setTokensOffered(e.target.value)}
            placeholder="Tokens Offer?"
          />
          <Button variant="outlined" type="submit" onClick={postQuestion}>
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}

export default EditSingleQuestion;
