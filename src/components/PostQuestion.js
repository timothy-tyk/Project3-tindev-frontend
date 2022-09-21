import React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App.js";
// import SlateEditor from "./SlateEditor.js";
// Import the Slate editor factory.
import { createEditor } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";
import {
  getDownloadURL,
  getStorage,
  ref as storageReference,
  uploadBytes,
} from "firebase/storage";
import { set, push, ref as databaseRef } from "firebase/database";
import { storage, database } from "../DB/firebase";
import RichTextEditor from "./RichTextEditor.js";
const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

function PostQuestion(props) {
  const [editor] = useState(() => withReact(createEditor()));
  const [userData, setUserData] = useState(useContext(UserContext));
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [tokensOffered, setTokensOffered] = useState();
  const [imageAdded, setImageAdded] = useState();
  const [fileInputFile, setFileInputFile] = useState();
  const [fileInputValue, setFileInputValue] = useState();

  const [text, setText] = useState("");

  //hard coded
  const navigate = useNavigate();
  const [value, setValue] = useState(initialValue);

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

  const postQuestion = async (e) => {
    console.log(text, "from rich text editor");
    let imageUrl;
    if (imageAdded) {
      imageUrl = await uploadImage(e);
      console.log(imageUrl);
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
      setDetails("");
      setTokensOffered("");
      alert("u have posted a question");
      props.setPosted(!props.posted);
      // navigate(`/lobbies/${lobbyId}`);
      //or navigate to the individual question id
    });
  };
  return (
    <div>
      <button onClick={(e) => props.setPosted(!props.posted)}>
        Post a question
      </button>
      {props.posted && (
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
          <input
            type="file"
            onChange={(e) => {
              setImageAdded(true);
              console.log(e.target.files[0]);
              setFileInputFile(e.target.files[0]);
              setFileInputValue(e.target.files[0].name);
            }}
          />
          <Slate editor={editor} value={initialValue}>
            <Editable
              onKeyDown={(event) => {
                console.log(event.key);
                console.log(value);
              }}
            />
          </Slate>
          <RichTextEditor getRichText={(item) => getRichText(item)} />

          <button type="submit" onClick={postQuestion}>
            Post Question
          </button>
        </div>
      )}
    </div>
  );
}

export default PostQuestion;
