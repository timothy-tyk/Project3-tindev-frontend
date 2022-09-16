import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import axios from "axios";

export default function Profile(props) {
  const { user } = useAuth0();

  const [userData, setUserData] = useState(useContext(UserContext).data);
  const [editUserName, setEditUserName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editProfilePicture, setEditProfilePicture] = useState();
  const [fileInputValue, setFileInputValue] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      console.log(userData);
      setEditUserName(userData.username);
      setEditProfilePicture(userData.profilepicture);
      setEditBio(userData.bio == null ? "" : userData.bio);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e);
    const response = await axios.put("http://localhost:3000/users", {
      userId: userData.id,
      username: editUserName,
      profilepicture: fileInputValue,
      bio: editBio,
    });
    console.log(response);
    props.handleSignIn(response);
    navigate("/dashboard");
  };

  return (
    <div>
      {" "}
      <p>PROFILE</p>
      <form onSubmit={(e) => handleSubmit(e)}>
        <img alt="profilepic" src={userData.profilepicture} />
        <input
          type="file"
          onChange={(e) => {
            console.log(e.target.files[0]);
            setEditProfilePicture(e.target.files[0]);
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
