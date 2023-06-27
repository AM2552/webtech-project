import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim() === '' || password.trim() === '') {
      alert('Please enter both username and password');
      return;
    }

    try {
      // Check if the username exists
      const response = await axios.get(`http://localhost:5000/api/username/${username}`);
      const { available } = response.data;
      if (available) {
        // Username does not exist, create a new user
        const newUser = { username, password };
        await axios.post('http://localhost:5000/api/signup', newUser);
        onLogin(username);
      } else {
        // Username exists, validate the password
        const loginData = { username, password };
        const loginResponse = await axios.put('http://localhost:5000/api/login', loginData);
        const { success } = loginResponse.data;
        if (success) {
          onLogin(username);
        }
      }
    } catch (error) {
      alert('Username already exists.\nPassword does not match username.');
    }
  };

  return (
    <div className="LoginPage">
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
