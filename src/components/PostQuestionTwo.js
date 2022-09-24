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
        console.log(url);
        setFileInputValue(url);
        return url;
      });
    return imageUrl;
  };

  //set the stringified version into state
  const getRichText = async (item) => {
    setText(item);
    console.log(item, "rich text");
  };

  const postNewQuestion = async (e) => {
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
    if (title == "") {
      setTitleError(true);
    }
    if (tokensOffered > userData.tokens || isNaN(tokensOffered)) {
      setTokenError(true);
    }
    if (text == "") {
      setTextError(true);
    }

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
    console.log(submitBody, "submitBody");
    axios.post("http://localhost:3000/question", submitBody).then((res) => {
      setTitle("");
      setTokensOffered("");
      setText("");
      setPostStatus(!postStatus);
      props.handleClose();
      props.setPosted(!props.posted);
    });
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

            {/* <label>Question title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          /> */}
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

            {/* <label>Tokens Offered:</label>
          <input
            type="text"
            value={tokensOffered}
            onChange={(e) => setTokensOffered(e.target.value)}
          /> */}
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

            {/* <input
            type="file"
            onChange={(e) => {
              setImageAdded(true);
              setFileInputFile(e.target.files[0]);
              setFileInputValue(e.target.files[0].name);
            }}
          /> */}
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

// button
// title, richtextdescription, tokens offered, image upload
// display posted question

// import React from "react";
// import { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";

// import { UserContext } from "../App.js";
// import {
//   getDownloadURL,
//   getStorage,
//   ref as storageReference,
//   uploadBytes,
// } from "firebase/storage";
// import { set, push, ref as databaseRef } from "firebase/database";
// import { storage, database } from "../DB/firebase";
// import RichTextEditor from "./RichTextEditor.js";

// const initialValue = [
//   {
//     type: "paragraph",
//     children: [{ text: "A line of text in a paragraph." }],
//   },
// ];

//   const [title, setTitle] = useState("");
//   const [details, setDetails] = useState("");
//   const [tokensOffered, setTokensOffered] = useState();
//   const [imageAdded, setImageAdded] = useState();
//   const [fileInputFile, setFileInputFile] = useState();
//   const [fileInputValue, setFileInputValue] = useState();

//   const [text, setText] = useState("");

//   //hard coded
//   const navigate = useNavigate();
//   const [value, setValue] = useState(initialValue);

//   const IMAGES_FOLDER_NAME = "questionpictures";

//   const uploadImage = async (e, file, user) => {
//     e.preventDefault();
//     const storageRef = storageReference(
//       storage,
//       `${IMAGES_FOLDER_NAME}/${fileInputFile.name}`
//     );
//     const imageUrl = uploadBytes(storageRef, fileInputFile)
//       .then((snapshot) => {
//         return getDownloadURL(snapshot.ref);
//       })
//       .then((url) => {
//         console.log(url);
//         setFileInputValue(url);
//         return url;
//       });
//     return imageUrl;
//   };

//   const getRichText = async (item) => {
//     setText(item);
//     console.log(item, "rich text");
//   };

//   const postQuestion = async (e) => {
//     console.log(text, "from rich text editor");
//     let imageUrl;
//     if (imageAdded) {
//       imageUrl = await uploadImage(e);
//       console.log(imageUrl);
//     }
//     const menteeId = props.userData.id;
//     const lobbyId = props.lobbyId;
//     const submitBody = {
//       title,
//       text,
//       tokensOffered,
//       menteeId,
//       lobbyId,
//       imageUrl,
//     };
//     console.log(submitBody, "submitBody");
//     axios.post("http://localhost:3000/question", submitBody).then((res) => {
//       setTitle("");
//       setDetails("");
//       setTokensOffered("");
//       alert("u have posted a question");
//       props.setPosted(!props.posted);
//     });
//   };
//   return (
//     <div>
//       <button onClick={(e) => props.setPosted(!props.posted)}>
//         Post a question
//       </button>
//       {props.posted && (
//         <div>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Title?"
//           />
//           <input
//             type="text"
//             value={details}
//             onChange={(e) => setDetails(e.target.value)}
//             placeholder="Description"
//           />
//           <input
//             type="text"
//             value={tokensOffered}
//             onChange={(e) => setTokensOffered(e.target.value)}
//             placeholder="Tokens Offer?"
//           />
//           <input
//             type="file"
//             onChange={(e) => {
//               setImageAdded(true);
//               console.log(e.target.files[0]);
//               setFileInputFile(e.target.files[0]);
//               setFileInputValue(e.target.files[0].name);
//             }}
//           />

//           <RichTextEditor getRichText={(item) => getRichText(item)} />

//           <button type="submit" onClick={postQuestion}>
//             submit
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
