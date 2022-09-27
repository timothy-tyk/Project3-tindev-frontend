import React, { useEffect } from "react";
import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { UserContext } from "../App.js";
import {
  Rating,
  Paper,
  TextField,
  Grid,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
function Review(props) {
  const [userData, setUserData] = useState(useContext(UserContext));
  const [reviewExist, setReviewExist] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [inputText, setInputText] = useState("");
  const [canReview, setCanReview] = useState(true);
  const [rating, setRating] = useState();
  const [inputError, setInputError] = useState(false);

  const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
      color: "#E600FF",
    },
    "& .MuiRating-iconHover": {
      color: "#FF69B4",
    },
    "&..MuiRating-iconEmpty": {
      color: "#E8DACC",
    },
  });
  const { questionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (questionId) {
      axios.get(`http://localhost:3000/review/${questionId}`).then((review) => {
        if (review.data.length > 0) {
          setReviewContent(review.data);

          for (let i = 0; i < review.data.length; i++) {
            if (review.data[i].reviewerId === userData.id) {
              setCanReview(false);
            }
          }
        }
      });
    }
  }, [reviewSent]);

  const submitReview = async (e) => {
    e.preventDefault();
    setInputError(false);
    if (inputText === "") {
      setInputError(true);
    }
    if (!inputError) {
      const submitBody = {
        reviewContent: inputText,
        reviewerId: props.reviewerId,
        revieweeId: props.revieweeId,
        questionId: questionId,
        role: props.role,
        rating: rating,
      };
      axios.post("http://localhost:3000/review/", submitBody).then((res) => {
        alert("You have sent a review.");
        setInputText("");
        setReviewSent(!reviewSent);
      });
    }
  };

  return (
    <div>
      <Grid container width="100%">
        {/* <Typography variant="caption">Review Section</Typography> */}
        <Grid
          container
          width="100%"
          justifyContent="center"
          alignItems="center"
          sx={{
            backgroundColor: "#626262",
            borderColor: "primary",
            padding: 1,
            borderRadius: 1,
            color: "black",
          }}
        >
          {canReview ? (
            <div>
              <Typography variant="h5" color="black.main" paddingTop="2vh">
                Review Section
              </Typography>
              <Typography color="black.main">
                You are leaving a review for{" "}
                {userData.id == props.question.mentorIdAlias.id
                  ? props.question.menteeIdAlias.username
                  : props.question.mentorIdAlias.username}
              </Typography>
              <br />
              {/* <Paper variant="outlined" raised="true" width="100%"> */}
              <Grid item width="100%" xs={12}>
                {" "}
                <StyledRating
                  name="customized-color"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                  getLabelText={(value) =>
                    `${value} Heart${value !== 1 ? "s" : ""}`
                  }
                  precision={1}
                  icon={<StarRoundedIcon fontSize="inherit" />}
                  emptyIcon={<StarBorderRoundedIcon fontSize="inherit" />}
                />
                {/* <Rating
                  name="size-medium"
                  color="secondary"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                /> */}
              </Grid>
              <Grid item>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="center"
                  marginBottom="2vh"
                >
                  <TextField
                    fullWidth
                    multiline
                    sx={{ mt: 2, mb: 2 }}
                    id="standard-basic"
                    label="Give a review"
                    variant="outlined"
                    value={inputText}
                    required
                    error={inputError}
                    autoComplete="off"
                    helperText={inputError && "Cannot be empty"}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    onClick={submitReview}
                    sx={{ ml: 2 }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
              {/* </Paper> */}
            </div>
          ) : (
            <Alert severity="success">You already have a review!</Alert>
          )}
        </Grid>

        <Grid container color="primary" justifyContent="space-evenly" mt="3vh">
          {reviewContent.length > 0 &&
            reviewContent.map((item) => (
              <div>
                {" "}
                <Grid item xs={10}>
                  <span>
                    <Typography variant="h6">
                      {item.reviewerIdAlias.username}'s review{" "}
                    </Typography>
                    <Typography> {item.reviewContent}</Typography>
                  </span>
                  <StyledRating
                    name="customized-color"
                    value={item.rating}
                    readOnly
                    getLabelText={(value) =>
                      `${value} Heart${value !== 1 ? "s" : ""}`
                    }
                    precision={0.5}
                    icon={<StarRoundedIcon fontSize="inherit" />}
                    emptyIcon={<StarBorderRoundedIcon fontSize="inherit" />}
                  />
                  {/* <Rating name="read-only" value={item.rating} readOnly /> */}
                </Grid>{" "}
              </div>
            ))}
        </Grid>
      </Grid>
    </div>
  );
}

export default Review;
