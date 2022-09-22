import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App";
import SendReview from "./SendReview";
import Review from "./Review";
import QuestionChatComponent from "./QuestionChatComponent";

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
      // retrieving reviews
      // axios.get(`http://localhost:3000/review/${questionId}`).then((review) => {
      //   console.log(review.data, "review.data");
      //   if (review) {
      //     setReviewExist(true);
      //     setReview(review.data);
      //   }
      // });
    }

    console.log(params, "params");
  }, []);

  return (
    <div>
      <div>
        {question && (
          <div>
            <h1>
              {question.title} by Id{question.menteeId}: Username:
              {question.menteeIdAlias.username}
            </h1>
            <h6> {question.details} </h6>
            <h6>Question Id: {questionId}</h6>
            <p>
              {" "}
              status:{question.solved ? "solved" : "not solved yet"}, tokens
              Offer: {question.tokensOffered}{" "}
            </p>
            <QuestionChatComponent userData={userData} />
          </div>
        )}
      </div>
      <div>
        {" "}
        {/* If there is a review, show the review, if not show the form */}
        {showReview && (
          <Review
            questionId={questionId}
            role={role}
            revieweeId={revieweeId}
            reviewerId={reviewerId}
          />
        )}
        {/* {showReview && (
          <SendReview
            questionId={questionId}
            userIsMentee={userIsMentee}
            userIsMentor={userIsMentor}
            revieweeId={revieweeId}
            reviewerId={reviewerId}
            userData={userData}
            role={role}
          />
        )} */}
        {/* {reviewExist ? <: "review dont exist"} */}
      </div>
      <div>
        {" "}
        {/* If there is a review, show the review, if not show the form */}
        {showReview && (
          <Review
            questionId={questionId}
            role={role}
            revieweeId={revieweeId}
            reviewerId={reviewerId}
          />
        )}
        {/* {showReview && (
          <SendReview
            questionId={questionId}
            userIsMentee={userIsMentee}
            userIsMentor={userIsMentor}
            revieweeId={revieweeId}
            reviewerId={reviewerId}
            userData={userData}
            role={role}
          />
        )} */}
        {/* {reviewExist ? <: "review dont exist"} */}
      </div>
      <button onClick={(e) => navigate(-2)}>Go back to previous lobby</button>
    </div>
  );
}

export default Chatroom;
