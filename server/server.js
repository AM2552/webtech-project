const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

// Temporary session storage
let sessionUsers = [];

// Endpoint to check if a username is available
app.get('/api/username/:username', (req, res) => {
  const { username } = req.params;
  const isAvailable = !sessionUsers.find((user) => user.username === username);
  res.json({ available: isAvailable });
});

// Endpoint to handle login and create a session
app.post('/api/login', (req, res) => {
  const { username } = req.body;

  // Check if the username is already in use
  const isAvailable = !sessionUsers.find((user) => user.username === username);
  if (!isAvailable) {
    res.status(400).json({ error: 'Username is already taken' });
    return;
  }

  // Create a new session user
  const user = { id: req.session.id, username };
  sessionUsers.push(user);

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
