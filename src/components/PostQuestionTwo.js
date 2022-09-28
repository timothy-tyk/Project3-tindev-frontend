import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../App.js";
import RichTextEditor from "./RichTextEditor.js";

import { Button, TextField, Container, Alert, AlertTitle } from "@mui/material";
import {
  getDownloadURL,
  getStorage,
  ref as storageReference,
  uploadBytes,
} from "firebase/storage";
import { set, push, ref as databaseRef } from "firebase/database";
import { storage, database } from "../DB/firebase";
import { Typography } from "@mui/material";
import { useLoaderData } from "react-router-dom";

import { BACKEND_URL } from "../constants.js";

import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function PostQuestionTwo(props) {
  const [postStatus, setPostStatus] = useState(false);
  const [userData, setUserData] = useState(useContext(UserContext));
  const [title, setTitle] = useState("");
  const [tokensOffered, setTokensOffered] = useState();
  const [imageAdded, setImageAdded] = useState();
  const [fileInputFile, setFileInputFile] = useState();
  const [fileInputValue, setFileInputValue] = useState();
  const [text, setText] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [textError, setTextError] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const postNew = () => {
    setPostStatus(!postStatus);
  };

  const IMAGES_FOLDER_NAME = "questionpictures";

  useEffect(() => {
    newUserData();
  }, []);

  const newUserData = async () => {
    const newData = await axios.get(`${BACKEND_URL}/users/${userData.id}`);
    setUserData(newData.data);
  };

  const uploadImage = async (e, file, user) => {
    e.preventDefault();
    const storageRef = storageReference(
      storage,
      `${IMAGES_FOLDER_NAME}/${fileInputFile.name}`
    );
    const imageUrl = uploadBytes(storageRef, fileInputFile)
      .then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      })
      .then((url) => {
        setFileInputValue(url);
        return url;
      });
    return imageUrl;
  };

  //set the stringified version into state
  const getRichText = async (item) => {
    setText(item);
  };

  const postNewQuestion = async (e) => {
    console.log({ titleError, textError, tokenError });
    e.preventDefault();
    let imageUrl;
    if (fileInputFile) {
      imageUrl = await uploadImage(e);
    } else {
      imageUrl = null;
    }

    setTitleError(false);
    setTextError(false);
    setTokenError(false);

    if (title === "") {
      setTitleError(true);
    } else if (tokensOffered > userData.tokens || isNaN(tokensOffered)) {
      setTokenError(true);
    } else if (text === "") {
      setTextError(true);
    } else if (!titleError && !tokenError && !textError) {
      //send it to DB as a string
      const menteeId = props.userData.id;
      const lobbyId = props.lobbyId;
      const submitBody = {
        title,
        text,
        tokensOffered,
        menteeId,
        lobbyId,
        imageUrl,
      };
      axios.post("http://localhost:3000/question", submitBody).then((res) => {
        setTitle("");
        setTokensOffered("");
        setText("");
        setPostStatus(!postStatus);
        props.handleClose();
        props.setPosted(!props.posted);
      });
    }
    newUserData();
    socket.emit("something_has_updated", { room: props.lobbyId });
  };

  return (
    <div>
      <div>
        <Container size="sm">
          <form
            noValidate
            autoComplete="off"
            onSubmit={(e) => postNewQuestion(e)}
          >
            <TextField
              sx={{ mt: 2, mb: 2 }}
              id="standard-basic"
              label="Question Title"
              variant="standard"
              value={title}
              required
              error={titleError}
              helperText="Cannot be empty"
              onChange={(e) => setTitle(e.target.value)}
            />

            <br />
            <TextField
              sx={{ mb: 2 }}
              id="standard-basic"
              label="Tokens Offered:"
              variant="standard"
              value={tokensOffered}
              required
              error={tokenError}
              helperText={
                tokenError
                  ? `Only numbers allowed. *You only have ${userData.tokens} tokens`
                  : null
              }
              onChange={(e) => setTokensOffered(e.target.value)}
            />

            <br />
            <Button
              variant="contained"
              component="label"
              sx={{ mt: 2, mb: 2, mr: 1 }}
            >
              Upload File
              <input
                sx={{ m: 1 }}
                hidden
                type="file"
                onChange={(e) => {
                  setImageAdded(true);
                  setFileInputFile(e.target.files[0]);
                  setFileInputValue(e.target.files[0].name);
                }}
              />
            </Button>
            <label>{fileInputValue}</label>

            <br />

            <label>Description</label>
            {textError && (
              <Alert severity="warning">
                <AlertTitle>Warning</AlertTitle>
                Description cannot be empty
              </Alert>
            )}
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
        </Container>
      </div>
    </div>
  );
}
export default PostQuestionTwo;
