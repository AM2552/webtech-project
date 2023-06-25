import React, { useState } from 'react';
import LoginPage from './LoginPage';
import GamePage from './GamePage';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (username) => {
    setLoggedIn(true);
    setUsername(username);
  };

  return (
    <div className="App">
      {!loggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <GamePage username={username} />
      )}
    </div>
  );
}

export default App;

