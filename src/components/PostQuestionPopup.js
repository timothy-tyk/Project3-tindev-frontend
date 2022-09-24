import * as React from "react";
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
import SummarizeIcon from "@mui/icons-material/Summarize";
import PostQuestionTwo from "./PostQuestionTwo";

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
            color: (theme) => theme.palette.tertiary[500],
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

export default function PostQuestionPopup(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* <Button onClick={()=>{this.setState({showOverview:!this.state.showOverview})}} variant="outlined" >
Overview
</Button> */}
      <Button
        variant="outlined"
        onClick={() => {
          handleClickOpen();
          props.setPosted(!props.posted);
        }}
        startIcon={<SummarizeIcon color="primary" />}
      >
        Post Question
      </Button>

      <BootstrapDialog
        color="tertiary"
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          <Typography variant="h4" color="secondary" mt={1}>
            Post A Question
          </Typography>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <PostQuestionTwo
            userData={props.userData}
            lobbyId={props.lobbyId}
            handleClose={handleClose}
            setPosted={props.setPosted}
            posted={props.posted}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus color="tertiary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
