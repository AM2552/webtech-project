import React from 'react';
import axios from 'axios';

const GamePage = ({ onLogout }) => {
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout');
      onLogout();
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <div>
      <h1>Welcome to the Game Page</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default GamePage;
