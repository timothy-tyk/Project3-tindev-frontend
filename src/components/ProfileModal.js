import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { Grid, Card } from "@mui/material";

import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams, Link } from "react-router-dom";
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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function ProfileModalDialog(props) {
  const [open, setOpen] = React.useState(false);
  const { user } = useAuth0();
  const [userData, setUserData] = useState(useContext(UserContext));
  const [profileData, setProfileData] = useState({});
  const [profileQuestions, setProfileQuestions] = useState([]);
  const [questionsList, setQuestionsList] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [lobbiesJoined, setLobbiesJoined] = useState([]);
  // const [lobbyInfo, setLobbyInfo] = useState({});
  // const [showLobbyInfo, setShowLobbyInfo] = useState();
  const navigate = useNavigate();
  const profileId = props.profileId;

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      console.log(profileId);
      getProfileData(profileId);
      getProfileQuestions(profileId);
      joinedLobbies();
    }
  }, []);

  const getProfileData = async (profileId) => {
    const profile = await axios.get(`${BACKEND_URL}/users/${profileId}`);
    setProfileData(profile.data);
  };

  const getProfileQuestions = async () => {
    const response = await axios.get(
      `${BACKEND_URL}/question/users/${profileId}`
    );
    let questions = response.data;
    let questionsData = [];
    for (let question of questions) {
      question = await axios.get(`${BACKEND_URL}/question/${question.id}`);
      questionsData.push(question.data[0]);
    }
    setProfileQuestions(questionsData);
  };

  let questionsAnswered = profileQuestions.filter(
    (question) => question.mentorId == profileId
  );
  let questionsAsked = profileQuestions.filter(
    (question) => question.menteeId == profileId
  );

  const openQuestionsList = (type) => {
    if (type == "answered") {
      setQuestionsList(questionsAnswered);
    } else {
      setQuestionsList(questionsAsked);
    }
  };

  // Get Lobby Info
  const joinedLobbies = async () => {
    const response = await axios.get(
      `${BACKEND_URL}/users/${profileId}/lobbies`
    );
    setLobbiesJoined(response.data);
  };

  // Add Friend
  const addFriend = async () => {
    const add = await axios.post(`${BACKEND_URL}/users/${profileId}/add`, {
      userId: userData.id,
    });
    const newUserInfo = await axios.get(`${BACKEND_URL}/users/${userData.id}`);
    setUserData(newUserInfo.data);
    props.handleUpdateUser(newUserInfo.data);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Typography
        variant="h5"
        onClick={handleClickOpen}
        sx={{ cursor: "pointer" }}
      >
        {profileData.username}
      </Typography>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          User Profile
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Grid container>
            <Grid item xs={4} className="profileModal-row1">
              <Avatar
                className="profilepic"
                src={profileData.profilepicture}
                alt={profileData.profilepicture}
                sx={{
                  width: "10vw",
                  height: "10vw",
                }}
              />
            </Grid>
            <Grid
              item
              xs={8}
              className="profileModal-row1"
              flexDirection="column"
            >
              <Typography gutterBottom variant="h4">
                {profileData.username}
              </Typography>
              <Typography gutterBottom>{profileData.email}</Typography>
              <Typography gutterBottom>
                Rating: {profileData.rating}/5
              </Typography>
            </Grid>
          </Grid>
          <Typography gutterBottom display="flex" alignItems="center">
            Lobbies Joined :
            {lobbiesJoined && lobbiesJoined.length > 0
              ? lobbiesJoined.map(({ lobby }) => {
                  return (
                    <div key={lobby.id}>
                      <Button
                        onClick={() => {
                          navigate(`/lobbies/${lobby.id}`);
                        }}
                      >
                        {lobby.name}
                      </Button>
                    </div>
                  );
                })
              : null}
          </Typography>
          <Typography gutterBottom>
            Questions :
            <Button
              onClick={() => {
                setShowQuestions(!showQuestions);
                openQuestionsList("answered");
              }}
            >
              {questionsAnswered.length} Questions Answered
            </Button>
            <Button
              onClick={() => {
                setShowQuestions(!showQuestions);
                openQuestionsList("asked");
              }}
            >
              {questionsAsked.length} Questions Asked
            </Button>
            {showQuestions && questionsList
              ? questionsList.map((question) => {
                  return (
                    <Card sx={{ backgroundColor: "white" }} key={question.id}>
                      <Link
                        to={`/lobbies/${question.lobbyId}/questions/${question.id}`}
                        className="links"
                      >
                        <Typography
                          variant="h5"
                          className="profileModal-questions"
                          marginLeft="1vw"
                        >
                          {question.title}
                        </Typography>
                        <Typography
                          className="profileModal-questions"
                          marginLeft="1vw"
                        >
                          Asked By: {question.menteeIdAlias.username}
                        </Typography>
                        <Typography
                          className="profileModal-questions"
                          marginLeft="1vw"
                        >
                          Answered By:
                          {question.mentorIdAlias
                            ? question.mentorIdAlias.username
                            : null}
                        </Typography>
                      </Link>
                    </Card>
                  );
                })
              : null}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose}
            disabled={
              userData.friendsList &&
              userData.friendsList.includes(profileData.id)
            }
            onClick={() => addFriend()}
          >
            Add Friend
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
