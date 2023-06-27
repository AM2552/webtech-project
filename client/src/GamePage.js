import React, { useState } from 'react';
import axios from 'axios';
import GameTiles from './GameTiles';
import SpotifyPlayer from './SpotifyPlayer';
import ChatWindow from './ChatWindow';
import SnakeGame from './SnakeGame';
import Leaderboard from './Leaderboard';

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
        <Leaderboard />
      </div>
      <div className="gameview">
        {gameVisible && <SnakeGame username={username} />}
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
