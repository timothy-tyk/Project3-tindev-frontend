import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { BACKEND_URL } from "../constants";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:3000");

export default function QuestionChatComponent(props) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([{}]);
  const userData = props.userData;
  console.log(props.userData);
  const { questionId } = useParams();

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
    console.log("socket fire off");
    // eslint-disable-next-line
  }, [socket]);

  const getChatLogs = async () => {
    const response = await axios.get(`${BACKEND_URL}/message/${questionId}`);
    console.log(response.data);
    let messages = [];
    response.data.forEach((message) => {
      let messageObject = {
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
    console.log(output);
    getChatLogs();

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
