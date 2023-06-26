const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios'); 

const app = express();
const PORT = 5000;
const CHAT_PORT = 5001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// SESSION MANAGEMENT //
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

// GAMETILES //
// Endpoint to retrieve the list of image filenames
app.get('/api/public/images', (req, res) => {
    const images = ['snake.png', 'breakout.png', 'pacman.png'];
    res.json(images);
});

// SPOTIFY-API //
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: 'd53a8f38cd4c4c8d81eb471bdbbfbb39',
    clientSecret: '8823bdcc54674f06bbd6eef0ae4bbe19',
});

const getAccessToken = async () => {
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        const { access_token } = data.body;
        spotifyApi.setAccessToken(access_token);
        return access_token;
    } catch (error) {
        console.error('Error retrieving access token:', error);
        throw error;
    }
};

// Endpoint to search for playlists by keyword
app.get('/api/spotify/playlists', async (req, res) => {
    const { keyword } = req.query;

    try {
        // Get access token
        const accessToken = await getAccessToken();

        // Make API request to search for playlists
        const { body } = await spotifyApi.searchPlaylists(keyword, { limit: 5 });

        // Send the list of matching playlists in the response
        res.json(body.playlists.items);
    } catch (error) {
        console.error('Error searching for playlists:', error);
        res.status(500).json({ error: 'Unable to search for playlists' });
    }
});

// Endpoint to retrieve the playlist ID by playlist URI
app.get('/api/spotify/playlist/:playlistId', async (req, res) => {
    const { playlistId } = req.params;

    try {
        // Get access token
        const accessToken = await getAccessToken();

        // Make API request to get playlist details
        const { body } = await spotifyApi.getPlaylist(playlistId);

        // Send the playlist ID in the response
        res.json({ playlistId: body.id });
    } catch (error) {
        console.error('Error retrieving playlist ID:', error);
        res.status(500).json({ error: 'Unable to retrieve playlist ID' });
    }
});

// GIPHY API //
app.post('/api/giphy', async (req, res) => {
    const { keyword } = req.body;
    const apiKey = 'k2NEawKvUbvI9LJ4I5BAr4mIOpLIiCiC';
    const url = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${encodeURIComponent(keyword)}`;
  
    try {
      const response = await axios.get(url);
  
      if (response.status === 200) {
        const gif = response.data.data.images.downsized.url;
        res.json({ gif });
      } else {
        console.error('Error:', response.data.error);
        res.status(500).json({ error: 'Failed to retrieve gif from Giphy' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to retrieve gif from Giphy' });
    }
  });

// CHAT WINDOW //
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true,
    },
});

io.on('connection', (socket) => {
    socket.on('chat-message', (message) => {
      io.emit('chat-message', message);
    });
  
    socket.on('gif-message', (message) => {
      io.emit('chat-message', message); // Emit the gif message as a 'chat-message'
    });
  });

// SERVER STARTUP
server.listen(PORT, () => {
    console.log(`Express server is running on http://localhost:${PORT}`);
});

// Start the chat server
io.listen(CHAT_PORT);
console.log(`Chat server is running on http://localhost:${CHAT_PORT}`);
