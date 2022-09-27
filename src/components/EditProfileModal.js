import React, { useContext, useState, useEffect } from "react";
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
import { storage, database } from "../DB/firebase";
import { BACKEND_URL } from "../constants";

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
import { TextField, Avatar, Grid } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";

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

export default function EditProfileModalDialogs(props) {
  const [open, setOpen] = React.useState(false);
  const { user } = useAuth0();
  const [userData, setUserData] = useState(props.userData);
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
      bio: editBio,
    });
    props.handleSignIn(response.data);
    props.handleRefreshData(response.data);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClickOpen}>
        <EditIcon fontSize="large" />
      </Button>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth="true"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Edit Profile
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <form onSubmit={(e) => handleSubmit(e)} className="edit-profile-form">
            <Grid container>
              <Avatar
                className="profilepic"
                alt="profilepic"
                src={userData.profilepicture}
                sx={{
                  width: "10vw",
                  height: "auto",
                }}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <input
                  hidden
                  type="file"
                  onChange={(e) => {
                    setImageChanged(true);
                    setFileInputFile(e.target.files[0]);
                    setFileInputValue(e.target.files[0].name);
                  }}
                />
                <PhotoCamera />
              </IconButton>
            </Grid>

            <TextField
              fullWidth
              label="Username"
              value={editUserName}
              onChange={(e) => setEditUserName(e.target.value)}
              sx={{
                marginTop: "1vh",
              }}
            />

            <TextField
              fullWidth
              id="outlined-multiline-flexible"
              label="Bio"
              multiline
              maxRows={4}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              sx={{ marginTop: "1vh" }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={(e) => {
              handleSubmit(e);
              handleClose();
            }}
          >
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
