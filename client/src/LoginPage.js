import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim() === '') {
      alert('Please enter a username');
      return;
    }

    try {
      // Check if the username is available
      const response = await axios.get(`/api/username/${username}`);
      const { available } = response.data;
      if (!available) {
        alert('Username is already taken');
        return;
      }

      // If the username is available, call the onLogin function
      onLogin(username);
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  };

  return (
    <div className="LoginPage">
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
