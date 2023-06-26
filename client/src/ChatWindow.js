import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const ChatWindow = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:5001');

    socket.on('chat-message', (message) => {
      // Exclude messages sent by the current user from being added to the state
      if (message.username !== username) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

  }, [username]);

  const handleMessageSubmit = (e) => {
    e.preventDefault();

    const message = {
      time: new Date().toLocaleTimeString(),
      username: username,
      message: messageInput,
    };

    setMessages((prevMessages) => [...prevMessages, message]);

    const socket = io('http://localhost:5001');
    socket.emit('chat-message', message);

    setMessageInput('');
  };

  return (
    <div>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message.time} {message.username}: {message.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleMessageSubmit}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
