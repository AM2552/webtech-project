import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const Leaderboard = ({ username }) => {
  const [highScore, setHighScore] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5001');

    socket.on('highscore-entry', (score) => {
        setHighScore((prevScores) => {
          const updatedScores = [...prevScores, score];
          // Sort scores in descending order
          updatedScores.sort((a, b) => b.score - a.score);
          // Keep only the top 10 scores
          updatedScores.splice(10);
          return updatedScores;
        });
    });
  }, [username]);

  return (
    <div>
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Game Type</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {highScore.map((score, index) => (
            <tr key={index}>
              <td>{score.username}</td>
              <td>{score.gametype}</td>
              <td>{score.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
