import React, { useState } from 'react';
import axios from 'axios'
import './App.css';

function App() {
  const [name, setName] = useState("")

  async function postName(e) {
    e.preventDefault()

    try {
      await axios.post("http://localhost:4000/post_name", {
        name
      })
    }
    catch (error) {
      console.log(error)
    }

  }
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <title>Arcade Paradise</title>
        <style>

        </style>
      </head>
      <body>
        <div class="container">
          <header class="header">
            <h1>Arcade Paradise</h1>
          </header>
          <div class="leaderboard">
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
                  <td>Galaga</td>
                  <td>8000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="gameview">

          </div>
          <div class="chat">

          </div>
          <div class="gametile">
            <form onSubmit={postName}>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              <button type="submit">Send Name</button>
            </form>
          </div>
          <div class="music">

          </div>
        </div>
      </body>
    </html>
  );
}

export default App;
