import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import axios from "axios";
import {
  getDownloadURL,
  getStorage,
  ref as storageReference,
  uploadBytes,
} from "firebase/storage";
import { set, push, ref as databaseRef } from "firebase/database";
import { storage, database } from "../DB/firebase";
import { BACKEND_URL } from "../constants";

export default function EditProfile(props) {
  const { user } = useAuth0();

  const [userData, setUserData] = useState(useContext(UserContext));
  const [editUserName, setEditUserName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [fileInputFile, setFileInputFile] = useState();
  const [fileInputValue, setFileInputValue] = useState();
  const [imageChanged, setImageChanged] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      setEditUserName(userData.username);
      setFileInputFile(userData.profilepicture);
      setEditBio(userData.bio == null ? "" : userData.bio);
    }
  }, []);
  // upload profile picture to firebase
  const IMAGES_FOLDER_NAME = "profilepictures";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl;
    if (imageChanged) {
      imageUrl = await uploadImage(e);
    } else {
      imageUrl = userData.profilepicture;
    }
    const response = await axios.put(`${BACKEND_URL}/users`, {
      userId: userData.id,
      username: editUserName,
      profilepicture: imageUrl,
      // profilepicture: fileInputValue,
      bio: editBio,
    });
    props.handleSignIn(response.data);
    navigate("/dashboard");
  };

  return (
    <div>
      <p>PROFILE</p>
      <form onSubmit={(e) => handleSubmit(e)}>
        <img
          className="profilepic"
          alt="profilepic"
          src={userData.profilepicture}
        />
        <input
          type="file"
          onChange={(e) => {
            setImageChanged(true);
            setFileInputFile(e.target.files[0]);
            setFileInputValue(e.target.files[0].name);
          }}
        />
        <br />
        <label>Username: </label>
        <input
          type="text"
          value={editUserName}
          onChange={(e) => setEditUserName(e.target.value)}
        />
        <br />
        <label>Bio: </label>
        <textarea
          type="text"
          rows="6"
          cols="50"
          value={editBio}
          onChange={(e) => setEditBio(e.target.value)}
        />
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
