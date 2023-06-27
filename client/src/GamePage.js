import React, { useState } from 'react';
import axios from 'axios';
import GameTiles from './GameTiles';
import SpotifyPlayer from './SpotifyPlayer';
import ChatWindow from './ChatWindow';
import SnakeGame from './SnakeGame';

const GamePage = ({ username, onLogout }) => {
  const handleLogout = async () => {
    try {
      await axios.delete('http://localhost:5000/api/logout');
      onLogout();
    } catch (error) {
      console.error(error);
    }
  };

  const [gameVisible, setGameVisible] = useState(false);

  const handleGameToggle = () => {
    setGameVisible(!gameVisible);
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
        {gameVisible && <SnakeGame />}
      </div>
      <div className="chat">
        <ChatWindow username={username} />
      </div>

      <div className="gametiles">
        <GameTiles onGameToggle={handleGameToggle} />
      </div>

      <div className="music">
        <SpotifyPlayer />
      </div>
    </div>
  );
};

export default GamePage;
