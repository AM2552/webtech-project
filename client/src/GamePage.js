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
    <div className="container">
    <header className="header">
      <h1>Arcade Paradise</h1>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </header>
    <div className="leaderboard">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Game</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Player 1</td>
            <td>Pac-Man</td>
            <td>10000</td>
          </tr>
          <tr>
            <td>Player 2</td>
            <td>Space Invaders</td>
            <td>5000</td>
          </tr>
          <tr>
            <td>Player 3</td>
            <td>Snake</td>
            <td>8000</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="gameview">

    </div>
    <div className="chat">

    </div>
    
    <div className="music">

    </div>
  </div>
  );
};

export default GamePage;
