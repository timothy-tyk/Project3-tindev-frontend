import React, { useEffect } from "react";
import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App.js";

function Review(props) {
  const [userData, setUserData] = useState(useContext(UserContext));
  // const [review, setReview] = useState();
  const [reviewExist, setReviewExist] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [inputText, setInputText] = useState("");
  const [canReview, setCanReview] = useState(true);
  const [rating, setRating] = useState();
  const { lobbyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("qns id", props.questionId);
    console.log("review!");
    if (props.questionId) {
      axios
        .get(`http://localhost:3000/review/${props.questionId}`)
        .then((review) => {
          console.log(review.data, "review.data");
          if (review.data.length > 0) {
            console.log("review length >0, set reviewExist true");
            setReviewExist(true);
            setReviewContent(review.data);
            for (let i = 0; i < review.data.length; i++) {
              if (review.data[i].reviewerId === userData.id) {
                console.log("my user exist in review");
                setCanReview(false);
              }
            }
          }
          console.log(canReview, "canreview?");
        });
      console.log("review exist?", reviewExist);
    }

    console.log(reviewExist, "reviewExist", canReview, "canReview");
  }, [reviewSent]);

  const submitReview = async () => {
    const submitBody = {
      reviewContent: inputText,
      reviewerId: props.reviewerId,
      revieweeId: props.revieweeId,
      questionId: props.questionId,
      role: props.role,
      rating: rating,
    };
    console.log(submitBody, "submitBody");
    axios.post("http://localhost:3000/review/", submitBody).then((res) => {
      alert("u have sent a review!");
      setInputText("");
      setReviewSent(!reviewSent);
    });
  };

  return (
    <div>
      <div>
        <p>Hello review section here </p>

        {canReview ? (
          <div>
            <h5>Send a review </h5>
            <input
              type="text"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="Type ur rating here (0-5)"
            />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type ur review here"
            />
            <button onClick={submitReview}>Submit</button>{" "}
          </div>
        ) : (
          "u already have a review!"
        )}
        {reviewContent.length > 0 &&
          reviewContent.map((item) => (
            <div>
              {item.reviewerIdAlias.username}: {item.reviewContent}, rating:{" "}
              {item.rating}/5 <br></br>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Review;
