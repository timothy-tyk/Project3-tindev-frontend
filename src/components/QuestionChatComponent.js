import React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { BACKEND_URL } from "../constants";
import { useParams } from "react-router-dom";
import { Box, Grid, Typography, Button } from "@mui/material";
const socket = io("http://localhost:3000");

export default function QuestionChatComponent(props) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([{}]);
  const userData = props.userData;

  const { questionId } = useParams();
  const messagesEndRef = useRef(null);
  useEffect(() => {
    //when user joins the lobby and this chat component is refreshed, send the lobbyId to backend
    socket.emit("join_question", { question: questionId });
    // eslint-disable-next-line
    getChatLogs();
  }, []);

  useEffect(() => {
    socket.on("received_question_message", (data) => {
      let newMessage = {
        username: data.username,
        message: data.message,
        questionId: data.questionId,
        date: data.date,
      };
      setChatMessages((chatMessages) => [...chatMessages, newMessage]);
      // getChatLogs();
    });
    // eslint-disable-next-line
  }, [socket]);

  const getChatLogs = async () => {
    const response = await axios.get(`${BACKEND_URL}/message/${questionId}`);
    let messages = [];
    response.data.forEach((message) => {
      let messageObject = {
        userId: message.userId,
        username: message.user.username,
        date: message.createdAt.toLocaleString(),
        message: message.messageContent,
        questionId: questionId,
      };
      messages.push(messageObject);
    });
    setChatMessages(messages);
  };

  const sendMessage = async () => {
    //user sends a message which includes username, message, and room(i.e.lobbyId)
    socket.emit("send_question_message", {
      username: userData.username,
      message: currentMessage,
      questionId: questionId,
      date: new Date().toLocaleString(),
    });
    //add message to the database
    const output = await axios.post(`${BACKEND_URL}/message/${questionId}`, {
      questionId: questionId,
      userId: userData.id,
      message: currentMessage,
    });
    getChatLogs();

    setCurrentMessage("");
  };

  return (
    <div>
      <div>
        <Grid
          container
          justifyContent="center"
          sx={{
            p: 4,
            height: "70vh",
            overflowY: "auto",
            maxHeight: "35vh",
            borderTop: 1,
            borderBottom: 1,
            borderColor: "#555",
          }}
        >
          {chatMessages.length > 0 ? (
            <Grid container direction="column" spacing="1">
              {chatMessages && Object.keys(chatMessages[0]).length > 0
                ? chatMessages.map((message, index) => {
                    return (
                      <div key={index}>
                        {message.userId === props.userData.id ? (
                          <Grid
                            item
                            xs={12}
                            key={index}
                            display="flex"
                            sx={{ pl: 2, py: 1 }}
                            alignContent="flex-end"
                            justifyContent="flex-end"
                          >
                            <Typography color="primary">
                              {message.username}: {message.message}
                            </Typography>
                          </Grid>
                        ) : (
                          <Grid
                            item
                            xs={12}
                            key={index}
                            display="flex"
                            alignContent="flex-start"
                            justifyContent="flex-start"
                          >
                            <Typography color="secondary">
                              {message.username}: {message.message}
                            </Typography>
                          </Grid>
                        )}
                      </div>
                    );
                  })
                : null}
            </Grid>
          ) : null}{" "}
        </Grid>
      </div>
      <div>
        {/* here is the input field component */}
        <Grid
          container
          alignItems="center"
          alignContent="center"
          justifyContent="center"
          justify="center"
          sx={{ mt: 5 }}
        >
          <input
            className="questionChatInputField"
            placeholder="Message here..."
            value={currentMessage}
            onChange={(e) => {
              setCurrentMessage(e.target.value);
            }}
          />

          <Button variant="outlined" onClick={sendMessage} sx={{ mt: "2vh" }}>
            Send Message
          </Button>
        </Grid>
      </div>
    </div>
  );
}
