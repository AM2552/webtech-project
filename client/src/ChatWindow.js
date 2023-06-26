import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import GifSearch from './GifSearch';

const ChatWindow = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const socket = io('http://localhost:5001');

    socket.on('chat-message', (message) => {
      // Exclude messages sent by the current user from being added to the state
      if (message.username !== username) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    socket.on('gif-message', (message) => {
      if (message.username !== username) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });
  }, [username]);

  useEffect(() => {
    // Scroll to the bottom of the messages container when new messages are added
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

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

  const handleReceiveGif = (gif) => {
    const message = {
      time: new Date().toLocaleTimeString(),
      username: username,
      gif: gif, // Store the GIF URL separately
      isGif: true,
    };

    setMessages((prevMessages) => [...prevMessages, message]);

    const socket = io('http://localhost:5001');
    socket.emit('gif-message', message);
  };

  return (
    <div className="chat-window">
      <div className="messages" ref={messagesContainerRef}>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isGif ? 'gif-message' : ''}`}>
            {message.time} {message.username}:{' '}
            {message.isGif ? <img src={message.gif} alt="GIF" /> : message.message}
          </div>
        ))}
      </div>
      <GifSearch onReceiveGif={handleReceiveGif} />
      <form onSubmit={handleMessageSubmit}>
        <input
          type="text"
          placeholder="Enter your message"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
