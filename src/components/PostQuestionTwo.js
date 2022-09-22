import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../App.js";
import RichTextEditor from "./RichTextEditor.js";
import {
  getDownloadURL,
  getStorage,
  ref as storageReference,
  uploadBytes,
} from "firebase/storage";
import { set, push, ref as databaseRef } from "firebase/database";
import { storage, database } from "../DB/firebase";
import { Button, Typography } from "@mui/material";

function PostQuestionTwo(props) {
  const [postStatus, setPostStatus] = useState(false);
  const [userData, setUserData] = useState(useContext(UserContext));
  const [title, setTitle] = useState("");
  const [tokensOffered, setTokensOffered] = useState();
  const [imageAdded, setImageAdded] = useState();
  const [fileInputFile, setFileInputFile] = useState();
  const [fileInputValue, setFileInputValue] = useState();
  const [text, setText] = useState("");

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

      props.setPosted(!props.posted);
    });
  };

  return (
    <div>
      <div>
        <Button variant="outlined" onClick={postNew}>
          <Typography sx={{ color: "neongreen.main", fontSize: "1.2rem" }}>
            Post a new question
          </Typography>
        </Button>
        <br />
      </div>

      {postStatus ? (
        <div>
          <form onSubmit={(e) => postNewQuestion(e)}>
            <label>Question title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <br />

            <label>Tokens Offered:</label>
            <input
              type="text"
              value={tokensOffered}
              onChange={(e) => setTokensOffered(e.target.value)}
            />
            <br />

            <label>File upload:</label>
            <input
              type="file"
              onChange={(e) => {
                setImageAdded(true);
                setFileInputFile(e.target.files[0]);
                setFileInputValue(e.target.files[0].name);
              }}
            />
            <br />

            <label>Description</label>
            <RichTextEditor
              getRichText={(item) => getRichText(item)}
              text={text}
            />

            <input type="submit" value="submit the question" />
          </form>
        </div>
      ) : null}
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
