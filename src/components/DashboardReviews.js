import React, { useEffect, useState } from "react";
import { UserContext } from "../App";
import { BACKEND_URL } from "../constants";
import { Link } from "react-router-dom";
import axios from "axios";
import ReviewModalDialog from "./DashboardReviewModal";

//MUI
import { Card, Grid, Typography, Avatar, Badge, Box } from "@mui/material";

export default function DashboardReviews(props) {
  const [userData, setUserData] = useState(props.user);
  const [userReviews, setUserReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [reviewType, setReviewType] = useState();
  const [reviewList, setReviewList] = useState([]);

  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = async () => {
    const reviews = await axios.get(
      `${BACKEND_URL}/review/user/${userData.id}`
    );
    setUserReviews(reviews.data);
  };
  let userReviewsListReviewer = userReviews.filter(
    (review) => review.reviewerId == userData.id
  );
  let userReviewsListReviewee = userReviews.filter(
    (review) => review.revieweeId == userData.id
  );

  const openReviewList = (type) => {
    if (type == "Reviewer") {
      setReviewType("Reviewer");
      setReviewList(userReviewsListReviewer);
    } else {
      setReviewType("Reviewee");
      setReviewList(userReviewsListReviewee);
    }
  };

  return (
    <div>
      <Typography variant="h3" color="primary" align="left">
        Reviews
      </Typography>
      <Grid container>
        <Grid item xs={5}>
          <button
            onClick={() => {
              setShowReviews(!showReviews);
              openReviewList("Reviewer");
            }}
          >
            <Typography variant="h2">
              {userReviewsListReviewer.length}
            </Typography>
          </button>
          <Typography>Reviews of Others</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h2">/</Typography>
        </Grid>
        <Grid item xs={5}>
          <button
            onClick={() => {
              setShowReviews(!showReviews);
              openReviewList("Reviewee");
            }}
          >
            <Typography variant="h2">
              {userReviewsListReviewee.length}
            </Typography>
          </button>
          <Typography>Reviews of You</Typography>
        </Grid>
      </Grid>
      <ReviewModalDialog
        open={showReviews}
        handleClose={() => setShowReviews(false)}
        reviewList={reviewList}
        type={reviewType}
      />
    </div>
  );
}
