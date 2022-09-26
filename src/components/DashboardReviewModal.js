import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

import { Grid, Card, TextField } from "@mui/material";
import ProfileModalDialog from "./ProfileModal";

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

export default function ReviewModalDialog(props) {
  const [open, setOpen] = useState(props.open);
  const [search, setSearch] = useState("");
  const [searchList, setSearchList] = useState([]);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const handleClose = () => {
    setOpen(false);
    props.handleClose();
  };
  const searchReviews = (value) => {
    if (value.length > 0) {
      const results = props.reviewList.filter((review) => {
        return review.reviewContent.toLowerCase().includes(value.toLowerCase());
        // ||
        // question.mentorIdAlias.username
        //   .toLowerCase()
        //   .includes(value.toLowerCase()) ||
        // question.menteeIdAlias.username
        //   .toLowerCase()
        //   .includes(value.toLowerCase()) ||
        // question.details.toLowerCase().includes(value.toLowerCase())
      });
      console.log(value);
      setSearchList(results);
    }
    console.log(searchList);
  };

  const displaySearch = searchList.map((review, index) => {
    return (
      <div key={index}>
        <Card sx={{ backgroundColor: "white", border: "solid grey 1px" }}>
          <Grid container>
            <Grid item xs={8} className="review-info">
              <Typography
                variant="h4"
                gutterBottom
                className="modal-info-row"
                marginLeft="0.5vw"
                marginTop="0.5vw"
                color="#000000"
              >
                " {review.reviewContent} "
                <br />
              </Typography>
              <Typography
                gutterBottom
                marginLeft="0.5vw"
                color="#000000"
                sx={{ position: "absolute", bottom: 0 }}
              >
                Review For:{" "}
                {/* <Link
                  to={`/users/${review.revieweeIdAlias.id}`}
                  className="links"
                >
                  {review.revieweeIdAlias.username}{" "}
                </Link> */}
                <ProfileModalDialog
                  handleUpdateUser={props.handleUserData}
                  profileId={review.revieweeIdAlias.id}
                />
                | By:
                {/* <Link
                  to={`/users/${review.reviewerIdAlias.id}`}
                  className="links"
                >
                  {review.reviewerIdAlias.username}
                </Link> */}
                <ProfileModalDialog
                  handleUpdateUser={props.handleUserData}
                  profileId={review.revieweeIdAlias.id}
                />
              </Typography>
            </Grid>
            <Grid item xs={4} className="review-rating">
              <Typography variant="h1" marginRight="1vw" color="#000000">
                {review.rating}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </div>
    );
  });

  const displayReviews = props.reviewList
    ? props.reviewList.map((review, index) => {
        return (
          <div key={index}>
            <Card sx={{ backgroundColor: "white", border: "solid grey 1px" }}>
              <Grid container>
                <Grid item xs={8} className="review-info">
                  <Typography
                    variant="h4"
                    gutterBottom
                    className="modal-info-row"
                    marginLeft="0.5vw"
                    marginTop="0.5vw"
                    color="#000000"
                  >
                    " {review.reviewContent} "
                    <br />
                  </Typography>
                  <Typography
                    gutterBottom
                    marginLeft="0.5vw"
                    color="#000000"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    Review For:{" "}
                    <ProfileModalDialog
                      handleUpdateUser={props.handleUserData}
                      profileId={review.revieweeIdAlias.id}
                      small
                      sx={{ display: "flex" }}
                    />
                    | By:
                    <ProfileModalDialog
                      handleUpdateUser={props.handleUserData}
                      profileId={review.reviewerIdAlias.id}
                      small
                      sx={{ display: "flex" }}
                    />
                  </Typography>
                </Grid>
                <Grid item xs={4} className="review-rating">
                  <Typography variant="h1" marginRight="1vw" color="#000000">
                    {review.rating}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </div>
        );
      })
    : null;

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        className="modal"
        fullWidth="true"
        minWidth="md"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          As {props.type}
        </BootstrapDialogTitle>
        <TextField
          id="outlined-basic"
          label="Search Reviews"
          variant="outlined"
          sx={{ borderRadius: "50%" }}
          onChange={(e) => {
            setSearch(e.target.value);
            searchReviews(e.target.value);
          }}
        />
        <DialogContent dividers>
          {search.length > 0
            ? displaySearch
            : props.reviewList && props.reviewList.length > 0
            ? displayReviews
            : null}
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
