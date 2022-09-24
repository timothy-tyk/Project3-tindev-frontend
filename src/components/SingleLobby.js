import React from "react";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../App.js";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import SingleLobbyNumberDisplay from "./SingleLobbyNumberDisplay.js";
import LobbyChatComponent from "./LobbyChatComponent.js";
import PostQuestionTwo from "./PostQuestionTwo.js";
import { Avatar, Button, Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";
import tokenImage from "../images/token.png";
import backIcon from "../images/backIcon.png";
import onlineUsersIcon from "../images/onlineUsersIcon.png";

export default function SingleLobby() {
  const { user } = useAuth0();
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [userData, setUserData] = useState(useContext(UserContext));
  const [lobbyData, setLobbyData] = useState([]);
  const [questionsData, setQuestionsData] = useState([]);
  const [userAsMenteeData, setUserAsMenteeData] = useState([]);
  const [userAsMentorData, setUserAsMentorData] = useState([]);
  const [posted, setPosted] = useState();

  const getLobbyData = async () => {
    const response = await axios.get(`${BACKEND_URL}/lobbies/${lobbyId}`);
    setLobbyData(response.data);
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      getLobbyData();
    }
    // eslint-disable-next-line
  }, []);

  const updateUserLocation = async () => {
    if (userData) {
      const body = {
        userId: userData.id,
        lobbyName: lobbyData.name,
      };
      axios
        .put(`${BACKEND_URL}/lobbies/${lobbyId}/${userData.id}`, body)
        .then((res) => {});
    } else console.log("loading user");
  };

  useEffect(() => {
    updateUserLocation();
    // eslint-disable-next-line
  }, [lobbyData]);

  const getQuestionsData = async () => {
    const response = await axios.get(
      `${BACKEND_URL}/lobbies/${lobbyId}/questions`
    );
    setQuestionsData(response.data);
  };

  useEffect(() => {
    getQuestionsData();
    // eslint-disable-next-line
  }, [lobbyData, posted]);

  const getUserStatsData = async () => {
    if (userData) {
      const responseAsMentee = await axios.get(
        `${BACKEND_URL}/lobbies/${lobbyId}/mentee/${userData.id}`
      );

      const responseAsMentor = await axios.get(
        `${BACKEND_URL}/lobbies/${lobbyId}/mentor/${userData.id}`
      );

      setUserAsMenteeData(responseAsMentee.data.length);
      setUserAsMentorData(responseAsMentor.data.length);
    } else console.log("loading user");
  };

  useEffect(() => {
    getUserStatsData();
    console.log(questionsData);
    // eslint-disable-next-line
  }, [questionsData]);

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

  function returnQuestions() {
    return (
      <Grid
        container
        className="scroll"
        sx={{
          p: 4,
          overflowY: "auto",
          maxHeight: "400px",
          borderTop: 1,
          borderBottom: 1,
          borderColor: "#555",
        }}
      >
        {questionsData &&
          questionsData.map((question, i) => {
            return question.solved ? (
              <Grid
                container
                className="singleQuestionDisplayContainerSolved"
                sx={{ border: 1, p: 2, mb: 2 }}
                alignItems="center"
                wrap="nowrap"
                borderRadius="10px"
                onClick={() =>
                  navigate(`/lobbies/${lobbyId}/questions/${question.id}`)
                }
              >
                <Grid
                  item
                  xs={3}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    pl: 3,
                    mr: 5,
                  }}
                >
                  <Typography color="tertiary.main" fontSize={"0.5em"}>
                    Posted by {question.menteeIdAlias.username}
                    <br />
                    {`${time_ago(new Date(question.createdAt))}`}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    pl: 1,
                  }}
                >
                  <Avatar
                    alt="token"
                    src={tokenImage}
                    sx={{ width: 0.08, height: 0.7, mr: 2 }}
                  />
                  <Typography color="tertiary.main" fontSize={"0.7em"}>
                    {question.tokensOffered}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={6}
                  display="flex"
                  alignContent="flex-start"
                  sx={{ pl: 7 }}
                >
                  <Typography color="tertiary.main" fontSize={"0.5em"}>
                    Subject Title: {question.title}
                  </Typography>
                </Grid>
                <Grid item xs sx={{ pr: 3 }}>
                  <span className="dotSolved" />
                </Grid>
              </Grid>
            ) : (
              <Grid
                container
                className="singleQuestionDisplayContainer"
                sx={{ border: 1, p: 2, mb: 2 }}
                alignItems="center"
                wrap="nowrap"
                borderRadius="10px"
                onClick={() =>
                  navigate(`/lobbies/${lobbyId}/questions/${question.id}`)
                }
              >
                <Grid
                  item
                  xs={3}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    pl: 3,
                    mr: 5,
                  }}
                >
                  <Typography fontSize={"0.5em"}>
                    Posted by {question.menteeIdAlias.username}
                    <br />
                    {`${time_ago(new Date(question.createdAt))}`}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    pl: 1,
                  }}
                >
                  <Avatar
                    alt="token"
                    src={tokenImage}
                    sx={{ width: 0.08, height: 0.7, mr: 2 }}
                  />
                  <Typography fontSize={"0.7em"}>
                    {question.tokensOffered}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={6}
                  display="flex"
                  alignContent="flex-start"
                  sx={{ pl: 7 }}
                >
                  <Typography fontSize={"0.5em"}>
                    Subject Title: {question.title}
                  </Typography>
                </Grid>
                <Grid item xs sx={{ pr: 3 }}>
                  <span className="dotNotSolved" />
                </Grid>
              </Grid>
            );
          })}
      </Grid>
    );
  }

  return (
    <Container sx={{ height: "100%" }} columnSpacing={{ xs: 10 }}>
      {/* Lobby Header container */}
      <Grid
        container
        sx={{
          height: "6.5vh",
          display: "flex",
          justifyContent: "space-between",
          mt: 2,
          mb: 5,
        }}
        wrap="nowrap"
      >
        <Button onClick={(e) => navigate(-1)}>
          <Avatar alt="back" src={backIcon} size="100%" />
        </Button>
        {/* Lobby Name */}
        <Grid
          item
          xs={8}
          sx={{
            border: 1,
            borderColor: "#e8dacc",

            borderRadius: "10px",
            mx: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pl: 4,
          }}
        >
          <Typography color="primary" fontSize={"0.8em"}>
            {`< / ${lobbyData.name} Lobby >`}
          </Typography>
        </Grid>
        {/* Number of people online */}
        <Grid
          item
          xs={2}
          sx={{
            border: 1,
            borderColor: "#e8dacc",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
          wrap="nowrap"
        >
          <Avatar
            alt="people"
            src={onlineUsersIcon}
            sx={{ height: 0.7, width: 0.2 }}
          />
          <Typography color="offwhite.main" fontSize={"0.5em"} sx={{ m: 2 }}>
            <SingleLobbyNumberDisplay lobbyData={lobbyData} lobbyId={lobbyId} />
          </Typography>
        </Grid>
      </Grid>
      {/* User info container */}
      <Grid
        container
        sx={{
          width: 1,
          height: "15vh",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Grid container className="userInfoHolder">
          <Grid item className="userNameDisplay">
            {/* if userName.length < 13 */}
            <Typography color="secondary" fontSize={"0.9em"}>
              {userData.username}
            </Typography>
          </Grid>
          <Grid
            className="userStatsDisplay"
            container
            sx={{
              width: 1,
              height: "25vh",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                alignItems: "center",
                pl: 5,
              }}
            >
              <Avatar
                alt="token"
                src={tokenImage}
                sx={{ width: 0.08, height: 0.7, mr: 2 }}
              />
              <Typography color="offwhite.main" fontSize={"1.1em"}>
                {userData.tokens}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Typography color="offwhite.main" fontSize={"0.7em"}>
                {userAsMentorData}
                {userAsMentorData < 2 ? (
                  <span> Questions Answered</span>
                ) : (
                  <span> Question Answered</span>
                )}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{ display: "flex", justifyContent: "flex-end", pr: 3 }}
            >
              <Typography color="offwhite.main" fontSize={"0.7em"}>
                {userAsMenteeData}{" "}
                {userAsMenteeData > 2 ? (
                  <span> Questions Posted</span>
                ) : (
                  <span> Question Posted</span>
                )}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{ mt: 7 }}
        display="flex"
        className="questionDisplayContainer"
      >
        <Grid container>
          <Grid item xs={12} display="flex" sx={{ mb: 3 }} alignItems="center">
            <span className="dotNotSolved" />
            <Typography sx={{ ml: 2 }}>Available Questions</Typography>
          </Grid>
          <Grid item xs={12} display="flex" sx={{ mb: 4 }} alignItems="center">
            <span className="dotSolved" />
            <Typography sx={{ ml: 2 }}>Question has been solved</Typography>
          </Grid>
        </Grid>
        {returnQuestions()}
      </Grid>

      <Grid item xs={12} sx={{ my: 3, border: 1, borderRadius: "10px", py: 3 }}>
        <PostQuestionTwo
          lobbyId={lobbyId}
          userData={userData}
          posted={posted}
          setPosted={setPosted}
        />
      </Grid>
      <Grid container sx={{ border: 1, p: 2, mb: 2 }} borderRadius="10px">
        <Grid
          item
          xs
          bgcolor="#22212198"
          sx={{ border: 1, p: 2, mb: 2 }}
          borderRadius="10px"
        >
          <LobbyChatComponent
            userData={userData}
            lobbyId={lobbyId}
            lobbyData={lobbyData}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

// <Container sx={{ width: "100vw", height: "100vh" }}>
//   <Grid
//     container
//     columnSpacing={{ xs: 4 }}
//     sx={{ border: 1, width: "100vw", height: "100vh" }}
//   >
//     <Grid
//       item
//       xs={8}
//       sx={{ border: 1, py: 5 }}
//       display="flex"
//       alignItems="center"
//     >

//     </Grid>
//     <Grid
//       item
//       xs={4}
//       sx={{ border: 1 }}
//       display="flex"
//       alignItems="center"
//       justifyContent="flex-end"
//     >
//       <Typography color="neongreen.main">

//       </Typography>
//       <PeopleAltIcon color="primary" sx={{ px: 2 }} />
//     </Grid>

//     <Grid
//       container
//       sx={{ border: 1 }}
//       display="flex"
//       direction="row"
//       alignItems="spaced-evenly"
//     >

//     <Grid
//       item
//       xs={12}
//       sx={{ border: 1, py: 5 }}
//       display="flex"
//       alignItems="center"
//       justifyContent="center"
//     >

//     </Grid>
//     <Grid container>
//       <Grid item xs={5} sx={{ border: 1, p: 10 }}>

//       </Grid>
//       {userData ? (
//         <Grid
//           item
//           xs={7}
//           sx={{ border: 1 }}
//           display="flex"
//           alignItems="center"
//         >
//           <Grid
//             item
//             xs={4}
//             sx={{ border: 1, py: 6, px: 1, height: 1 }}
//             display="flex"
//             alignItems="center"
//           >
//             your current tokens: {userData.tokens}
//           </Grid>
//           <Grid
//             item
//             xs={4}
//             sx={{ border: 1, py: 6, px: 1, height: 1 }}
//             display="flex"
//             alignItems="center"
//           >
//             questions answered: {userAsMentorData}
//           </Grid>
//           <Grid
//             item
//             xs={4}
//             sx={{ border: 1, py: 6, px: 1, height: 1 }}
//             display="flex"
//             alignItems="center"
//           >
//             questions asked: {userAsMenteeData}
//           </Grid>
//         </Grid>
//       ) : (
//         <p>loading...</p>
//       )}
//     </Grid>
//   </Grid>
// </Container>

//   questionsData &&
//     questionsData.map((question, i) => {
//       return (
//         <Grid item xs={12} sx={{ border: 1, py: 0 }} key={i}>
//           <Grid container>
//             <Grid
//               item
//               xs={4}
//               sx={{ py: 3 }}
//               display="flex"
//               justifyContent="center"
//               alignItems="center"
//             >
//               {new Date(question.createdAt).toLocaleDateString()}
//               <Button variant="outlined">

//               </Button>
//             </Grid>
//             <Grid item xs={4} sx={{ py: 3 }}>
//               <Button variant="outlined">
//                 <Link
//                   to={`/lobbies/${lobbyId}/questions/${question.id}`}
//                   key={question.id}
//                 >
//                   <Typography color="hotpink.main">
//                     {question.title}
//                   </Typography>
//                 </Link>
//               </Button>
//             </Grid>
//             <Grid
//               item
//               xs={4}
//               sx={{ py: 3 }}
//               display="flex"
//               justifyContent="center"
//               alignItems="center"
//             >
//               <Typography color="hotpink.main">
//                 Bounty: {question.tokensOffered}
//               </Typography>
//               <LocalActivityIcon color="primary" sx={{ px: 1 }} />
//             </Grid>
//             {/* darren this is a button to link to each individual question */}
//           </Grid>
//         </Grid>
//       );
//     });
// }
