import React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { BACKEND_URL } from "../constants";
import { Button, Grid, Input, TextField, Typography } from "@mui/material";

const socket = io("http://localhost:3000");

export default function LobbyChatComponent(props) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([{}]);
  const userData = props.userData;
  const lobbyId = props.lobbyId;
  const lobbyName = props.lobbyData.name;

  useEffect(() => {
    //when user joins the lobby and this chat component is refreshed, send the lobbyId to backend
    socket.emit("join_room", { room: lobbyId });
    // eslint-disable-next-line
    // socket.emit("send_message", {});
    getChatLogs();
  }, []);

  useEffect(() => {
    socket.on("received_message", (data) => {
      let newMessage = {
        username: data.username,
        message: data.message,
        room: data.room,
        date: data.date,
        id: data.userId,
      };
      setChatMessages((chatMessages) => [...chatMessages, newMessage]);
      // getChatLogs();
    });
    console.log("socket fire off");
    // eslint-disable-next-line
    console.log(chatMessages);
  }, [socket]);

  const getChatLogs = async () => {
    const response = await axios.get(`${BACKEND_URL}/lobbies/${lobbyId}`);
    const chatLog = response.data.messages;
    let messages = [];
    if (chatLog) {
      chatLog.forEach((log) => {
        messages.push(JSON.parse(log));
      });
      setChatMessages(messages);
    }
  };

  const sendMessage = async () => {
    //user sends a message which includes username, message, and room(i.e.lobbyId)
    socket.emit("send_message", {
      username: userData.username,
      message: currentMessage,
      room: lobbyId,
      date: new Date().toLocaleString(),
      userId: userData.id,
    });
    //add message to the database
    let newMessage = JSON.stringify({
      username: userData.username,
      date: new Date().toLocaleString(),
      message: currentMessage,
      room: lobbyId,
      userId: userData.id,
    });
    const dbMessages = await axios.post(
      `${BACKEND_URL}/lobbies/${lobbyId}/chat`,
      {
        message: newMessage,
      }
    );
    getChatLogs();
    //set chat messages to the same value as what was emited to backend
    // setChatMessages((chatMessages) => [
    //   ...chatMessages,
    //   { userame: userData.username, message: currentMessage, room: lobbyId,  },
    // ]);
    setCurrentMessage("");
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  return (
    <div>
      <div>
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
          {chatMessages.length > 0 ? (
            <Grid container>
              {chatMessages && Object.keys(chatMessages[0]).length > 0
                ? chatMessages.map((message, index) => {
                    return (
                      <>
                        {message.userId === userData.id ? (
                          <Grid
                            ref={messagesEndRef}
                            item
                            xs={12}
                            key={index}
                            display="flex"
                            sx={{ pl: 2, py: 1 }}
                            justifyContent="flex-end"
                          >
                            <Typography color="primary">
                              <span style={{ color: "#fff" }}>
                                {message.message}
                              </span>
                              {`: ${message.username}`}
                            </Typography>
                          </Grid>
                        ) : (
                          <Grid
                            ref={messagesEndRef}
                            item
                            xs={12}
                            key={index}
                            display="flex"
                            sx={{ pl: 2, py: 1 }}
                            justifyContent="flex-start"
                          >
                            <Typography color="secondary">
                              {message.username}
                              <span style={{ color: "#fff" }}>
                                : {message.message}
                              </span>
                            </Typography>
                          </Grid>
                        )}
                      </>
                    );
                  })
                : null}
              {/* {chatMessages
              .filter((e, i) => i !== 0)
              .map((message, index) => {
                return (
                  message.room === lobbyId && (
                    <div key={index}>
                      {message.username} : {message.message}, room=
                      {message.room}
                    </div>
                  )
                );
              })} */}
            </Grid>
          ) : null}
        </Grid>
      </div>

      <div>
        <Grid container>
          <input
            className="chatInputField"
            placeholder="Message here..."
            value={currentMessage}
            onChange={(e) => {
              setCurrentMessage(e.target.value);
            }}
          />
        </Grid>
        <Button variant="outlined" onClick={sendMessage}>
          Send Message
        </Button>
      </div>
    </div>
  );
}
