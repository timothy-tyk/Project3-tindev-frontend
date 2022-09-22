import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { BACKEND_URL } from "../constants";

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
      };
      setChatMessages((chatMessages) => [...chatMessages, newMessage]);
      // getChatLogs();
    });
    console.log("socket fire off");
    // eslint-disable-next-line
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
    });
    //add message to the database
    let newMessage = JSON.stringify({
      username: userData.username,
      date: new Date().toLocaleString(),
      message: currentMessage,
      room: lobbyId,
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

  return (
    <div>
      <div>
        {chatMessages.length > 0 ? (
          <div>
            {chatMessages && Object.keys(chatMessages[0]).length > 0
              ? chatMessages.map((message, index) => {
                  return (
                    <div key={index}>
                      <p>
                        {message.date} | {message.username}:{message.message}
                      </p>
                    </div>
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
          </div>
        ) : null}
      </div>
      <div>
        <input
          placeholder="Message here..."
          value={currentMessage}
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>
    </div>
  );
}
