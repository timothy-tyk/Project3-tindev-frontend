import React, { useEffect } from "react";
import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { TextField } from "@mui/material";
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
  const { questionId, lobbyId } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    console.log(
      { title },
      { text },
      { tokensOffered },
      { questionId },
      { lobbyId }
    );
  }, []);

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
      questionId: questionId,
    };
    axios
      .put("http://localhost:3000/question/editQuestion", submitBody)
      .then((res) => {
        console.log(submitBody, "submit Body");
        console.log(props.edited, "edited state");
        alert("u have edited ur question!");
        props.setEdited(!props.edited);
        props.handleClose();
      });
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
          <form noValidate autoComplete="off" onSubmit={(e) => postQuestion()}>
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
