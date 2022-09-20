import React from "react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

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
  }, []);

  useEffect(() => {
    socket.on("received_message", (data) => {
      let newMessage = {
        senderName: data.senderName,
        message: data.message,
        room: data.room,
      };
      setChatMessages((chatMessages) => [...chatMessages, newMessage]);
    });
    // eslint-disable-next-line
  }, [socket]);

  const sendMessage = () => {
    //user sends a message which includes senderName, message, and room(i.e.lobbyId)
    socket.emit("send_message", {
      senderName: userData.username,
      message: currentMessage,
      room: lobbyId,
    });
    //set chat messages to the same value as what was emited to backend
    setChatMessages((chatMessages) => [
      ...chatMessages,
      { senderName: userData.username, message: currentMessage, room: lobbyId },
    ]);
    setCurrentMessage("");
  };

  return (
    <div>
      <div>
        {chatMessages.length > 0 ? (
          <div>
            {chatMessages
              .filter((e, i) => i !== 0)
              .map((message, index) => {
                return (
                  message.room === lobbyId && (
                    <div key={index}>
                      {message.senderName} : {message.message}, room=
                      {message.room}
                    </div>
                  )
                );
              })}
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
