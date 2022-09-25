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

export default function QuestionModalDialog(props) {
  const [open, setOpen] = useState(props.open);
  // const [questionsList, setQuestionsList] = useState(props.questionsList);
  const [search, setSearch] = useState("");
  const [searchList, setSearchList] = useState([]);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const handleClose = () => {
    setOpen(false);
    props.handleClose();
  };
  const searchQuestions = (value) => {
    if (value.length > 0) {
      const results = props.questionsList.filter((question) => {
        return question.title.toLowerCase().includes(value.toLowerCase());
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

  const displaySearch = searchList.map((question) => {
    return (
      <div>
        <Card>
          <Link
            className="links"
            to={`/lobbies/${question.lobbyId}/questions/${question.id}`}
          >
            <Typography gutterBottom className="modal-info-row">
              Title: {question.title}
              <br />
              Asked By: {question.menteeIdAlias.username}
              <br />
              Answered By:{" "}
              {question.mentorId ? question.mentorIdAlias.username : <>None</>}
            </Typography>
          </Link>
        </Card>
      </div>
    );
  });

  const displayQuestions = props.questionsList
    ? props.questionsList.map((question) => {
        return (
          <div>
            <Card>
              <Link
                className="links"
                to={`/lobbies/${question.lobbyId}/questions/${question.id}`}
              >
                <Typography gutterBottom className="modal-info-row">
                  Title: {question.title}
                  <br />
                  Asked By: {question.menteeIdAlias.username}
                  <br />
                  Answered By:{" "}
                  {question.mentorId ? (
                    question.mentorIdAlias.username
                  ) : (
                    <>None</>
                  )}
                </Typography>
              </Link>
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
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Questions {props.type}
        </BootstrapDialogTitle>
        <TextField
          id="outlined-basic"
          label="Search Questions"
          variant="outlined"
          onChange={(e) => {
            setSearch(e.target.value);
            searchQuestions(e.target.value);
          }}
        />
        <DialogContent dividers>
          {search.length > 0
            ? displaySearch
            : props.questionsList && props.questionsList.length > 0
            ? displayQuestions
            : null}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
