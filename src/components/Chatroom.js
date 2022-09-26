import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App";
import SendReview from "./SendReview";
import Review from "./Review";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import tokenImage from "../images/token.png";
import QuestionChatComponent from "./QuestionChatComponent";
import RichTextDisplay from "./RichTextDisplay";
import {
  Grid,
  Typography,
  Chip,
  Avatar,
  Button,
  Divider,
  Box,
} from "@mui/material";
function Chatroom() {
  const [userData, setUserData] = useState(useContext(UserContext));
  const [role, setRole] = useState();
  const [questionId, setQuestionId] = useState();
  const [question, setQuestion] = useState();
  const navigate = useNavigate();

  const params = useParams();
  const [reviewerId, setReviewerId] = useState();
  const [revieweeId, setRevieweeId] = useState();
  const [userIsMentee, setUserIsMentee] = useState();
  const [userIsMentor, setUserIsMentor] = useState();
  if (questionId !== params.questionId) {
    setQuestionId(params.questionId);
  }
  // const [review, setReview] = useState();
  // const [reviewExist, setReviewExist] = useState();
  const [showReview, setShowReview] = useState();
  /* If there is a review, show the review, if not show the form */

  function time_ago(time) {
    switch (typeof time) {
      case "number":
        break;
      case "string":
        time = +new Date(time);
        break;
      case "object":
        if (time.constructor === Date) time = time.getTime();
        break;
      default:
        time = +new Date();
    }
    var time_formats = [
      [60, "seconds", 1], // 60
      [120, "1 minute ago", "1 minute from now"], // 60*2
      [3600, "minutes", 60], // 60*60, 60
      [7200, "1 hour ago", "1 hour from now"], // 60*60*2
      [86400, "hours", 3600], // 60*60*24, 60*60
      [172800, "Yesterday", "Tomorrow"], // 60*60*24*2
      [604800, "days", 86400], // 60*60*24*7, 60*60*24
      [1209600, "Last week", "Next week"], // 60*60*24*7*4*2
      [2419200, "weeks", 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, "Last month", "Next month"], // 60*60*24*7*4*2
      [29030400, "months", 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, "Last year", "Next year"], // 60*60*24*7*4*12*2
      [2903040000, "years", 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, "Last century", "Next century"], // 60*60*24*7*4*12*100*2
      [58060800000, "centuries", 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
      token = "ago",
      list_choice = 1;

    if (seconds == 0) {
      return "Just now";
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = "from now";
      list_choice = 2;
    }
    var i = 0,
      format;
    while ((format = time_formats[i++]))
      if (seconds < format[0]) {
        if (typeof format[2] == "string") return format[list_choice];
        else
          return (
            Math.floor(seconds / format[2]) + " " + format[1] + " " + token
          );
      }
    return time;
  }

  useEffect(() => {
    if (questionId) {
      axios
        .get(`http://localhost:3000/question/${questionId}`)
        .then((response) => {
          console.log(response, "response");
          console.log(response.data, "response.data");
          setQuestion(response.data[0]);
          if (response.data[0].solved === true) {
            setShowReview(true);
          }
          if (response.data[0].menteeId === userData.id) {
            //if user is mentee, find out mentor id
            setReviewerId(userData.id);
            setRevieweeId(response.data[0].mentorId);
            setUserIsMentee(true);
            setUserIsMentor(false);
            setRole("MENTEE");
          }
          if (response.data[0].mentorId === userData.id) {
            //if user is mentor, find out mentee id
            setReviewerId(userData.id);
            setRevieweeId(response.data[0].menteeId);
            setUserIsMentor(true);
            setUserIsMentee(false);
            setRole("MENTOR");
          }
        });
    }

    console.log(params, "params");
  }, []);

  return (
    <Box height="100%" width="100vw">
      <div>
        <Grid
          container
          mt={3}
          direction="row"
          spacing="2"
          height="auto"
          maxHeight="100%"
          alignItems="center"
          justifyContent="center"
          // sx={{ overflowY: "auto" }}
        >
          {/* <Grid item xs={12}> */}
          {/* container for button + question + chat */}
          <Grid container>
            <Grid item xs={2} alignContent="flex-start">
              <Button
                variant="outlined"
                startIcon={
                  <ArrowBackOutlinedIcon icon={ArrowBackOutlinedIcon} />
                }
                onClick={(e) => navigate(-2)}
              >
                LOBBY
              </Button>
            </Grid>
            {/* container for qns start here */}
            <Grid
              container
              direction="row"
              xs={4}
              justifyContent="center"
              alignContent="center"
            >
              {question && (
                <Grid item xs={8}>
                  <Grid container justifyContent="center" alignContent="center">
                    <Grid item xs={6}>
                      <Typography variant="h4"> {question.title}</Typography>{" "}
                    </Grid>
                  </Grid>
                  <Divider variant="middle" color="primary" />
                  <Grid item>
                    <Typography variant="caption">
                      {`Posted by ${question.menteeIdAlias.username} `}
                    </Typography>

                    <Typography variant="caption">
                      {`${time_ago(new Date(question.createdAt))}`}
                    </Typography>
                  </Grid>

                  <Grid item mt={2}>
                    <RichTextDisplay richText={question.details} />
                  </Grid>
                  <Grid item mt={2}>
                    {question.imgUrl && (
                      <img
                        className="questionpic"
                        alt="qns img"
                        src={question.imgUrl}
                      />
                    )}
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle" mr={3}>
                      Status:{" "}
                      <span
                        className={
                          question.solved ? "dotSolved" : "dotNotSolved"
                        }
                      ></span>
                    </Typography>
                    <Chip
                      avatar={
                        <Avatar
                          alt="token"
                          src={tokenImage}
                          sx={{ width: 0.08, height: 0.7 }}
                        />
                      }
                      label={`Bounty: ${question.tokensOffered}`}
                      variant="outlined"
                      color="primary"
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
            {/* container for qns end here */}
            {/* container for chat component starts here*/}
            <Grid
              container
              xs={4}
              sx={{ border: 1, p: 2, mb: 2 }}
              borderRadius="10px"
              height="70vh"
              maxHeight="70vh"
              alignContent="stretch"
            >
              <Grid
                item
                xs
                bgcolor="#22212198"
                sx={{ border: 1, p: 2, mb: 2 }}
                borderRadius="10px"
              >
                <QuestionChatComponent userData={userData} />
              </Grid>
            </Grid>{" "}
            {/* container for chat component ends here */}
            {/* </Grid> */}
          </Grid>
          {/* above ending point is for button,qns,chat grid container */}
          {/* container for reviews start here */}
          {/* <Grid item> */}
          <Grid container justifyContent="center" mt="3vh" mb={5}>
            <Grid item xs={6}>
              <Review
                question={question}
                role={role}
                revieweeId={revieweeId}
                reviewerId={reviewerId}
              />
            </Grid>
          </Grid>
          {/* container for review ends here */}
          {/* </Grid> */}
        </Grid>
      </div>
    </Box>
  );
}

export default Chatroom;
