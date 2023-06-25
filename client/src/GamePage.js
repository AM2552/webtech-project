import React from 'react';

const GamePage = ({ username }) => {
  return (
    <div className="GamePage">
      <h1>Welcome, {username}!</h1>
      {/* Add your game content here */}
    </div>
  );
};

export default GamePage;
