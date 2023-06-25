const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(
    session({
        secret: 'verylongkeytoensuresecurity123456789',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 24 * 60 * 60 * 1000 },
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

// Endpoint to handle signup and create a new user
app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;

    // Check if the username is already in use
    const isAvailable = !sessionUsers.find((user) => user.username === username);
    if (!isAvailable) {
        res.status(400).json({ error: 'Username is already taken' });
        return;
    }

    // Create a new session user with the username and password
    const user = { id: req.session.id, username, password };
    sessionUsers.push(user);

    res.json({ success: true });
});

// Endpoint to handle login and validate the username and password
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Find the session user with the matching username
    const user = sessionUsers.find((user) => user.username === username);
    if (!user) {
        res.status(400).json({ error: 'Username does not exist' });
        return;
    }

    // Check if the password matches
    if (user.password === password) {
        res.json({ success: true });
    } else {
        res.status(400).json({ error: 'Password does not match username' });
    }
});

// Endpoint to handle logout and destroy the session
app.post('/api/logout', (req, res) => {
    const sessionUserIndex = sessionUsers.findIndex((user) => user.id === req.session.id);

    if (sessionUserIndex !== -1) {
        // Remove the user from the sessionUsers array
        sessionUsers.splice(sessionUserIndex, 1);
    }

    // Destroy the session
    req.session.destroy((error) => {
        if (error) {
            res.status(500).json({ error: 'Error destroying session' });
        } else {
            res.json({ success: true });
        }
    });
});

// Endpoint to retrieve the list of image filenames
app.get('/api/public/images', (req, res) => {
    const images = ['snake.png', 'breakout.png', 'pacman.png'];
    res.json(images);
  });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
