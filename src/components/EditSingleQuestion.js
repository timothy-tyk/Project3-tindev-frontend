import React, { useEffect } from "react";
import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { TextField } from "@mui/material";
import { UserContext } from "../App.js";
import RichTextEditor from "./RichTextEditor.js";
import { Button } from "@mui/material";
import RichTextDisplayForEdits from "./RichTextDisplayForEdits.js";

import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function EditSingleQuestion(props) {
  const [userData, setUserData] = useState(useContext(UserContext));
  const [title, setTitle] = useState(props.question.title);
  const [text, setText] = useState(props.question.details);
  const [tokensOffered, setTokensOffered] = useState(
    props.question.tokensOffered
  );
  const { questionId, lobbyId } = useParams();

  const navigate = useNavigate();

  const getRichText = async (item) => {
    setText(item);
  };

  const postQuestion = async (e) => {
    e.preventDefault();
    const submitBody = {
      title: title,
      details: text,
      tokensOffered: tokensOffered,
      lobbyId: lobbyId,
      questionId: questionId,
    };
    axios
      .put("http://localhost:3000/question/editQuestion", submitBody)
      .then((res) => {
        alert("You have edited your question.");
        props.setEdited(!props.edited);
        props.handleClose();
      });
    socket.emit("something_has_updated", { room: lobbyId });
  };
  return (
    <div>
      {/* <Button
        variant="outlined"
        onClick={(e) => props.setEdited(!props.edited)}
      >
        Edit question
      </Button> */}

      {props.edited && (
        <div>
          <form noValidate autoComplete="off" onSubmit={(e) => postQuestion(e)}>
            <TextField
              sx={{ mt: 2, mb: 2 }}
              id="standard-basic"
              label="Question Title"
              variant="standard"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title?"
            />
            <br></br>
            <TextField
              sx={{ mb: 2 }}
              id="standard-basic"
              label="Tokens Offered:"
              variant="standard"
              value={tokensOffered}
              onChange={(e) => setTokensOffered(e.target.value)}
            />
            <RichTextEditor
              getRichText={(item) => getRichText(item)}
              text={text}
            />
            <br />
            <br />
            Original Question Details:
            <RichTextDisplayForEdits richText={text} />
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </form>

          {/* <Button variant="outlined" type="submit" onClick={postQuestion}>
            Submit
          </Button> */}
        </div>
      )}
    </div>
  );
}

export default EditSingleQuestion;
