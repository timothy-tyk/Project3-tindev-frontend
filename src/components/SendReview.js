import React from "react";
import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App.js";

function SendReview(props) {
  const [userData, setUserData] = useState(useContext(UserContext));

  const [reviewContent, setReviewContent] = useState("");
  const { lobbyId } = useParams();
  //hard coded
  const navigate = useNavigate();
  const submitReview = async () => {
    const submitBody = {
      reviewContent: reviewContent,
      reviewerId: props.reviewerId,
      revieweeId: props.revieweeId,
      questionId: props.questionId,
      role: props.role,
    };
    axios.post("http://localhost:3000/review/", submitBody).then((res) => {
      alert("u have sent a review! back to lobby!");
      navigate(-1);
    });
  };
  return (
    <div>
      <div>
        <h5>Send a review </h5>
        <input
          type="text"
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
          placeholder="Type ur review here"
        />

        <button onClick={submitReview}>Submit</button>
      </div>
    </div>
  );
}

export default SendReview;
