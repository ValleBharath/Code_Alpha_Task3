const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Fake database (in-memory)
const players = {};  // stores player info

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static('public'));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Multiplayer Game Server!');
});

// Socket.io events
io.on('connection', (socket) => {
  console.log('A player connected:', socket.id);

  socket.on('authenticate', (data) => {
    const { username } = data;
    // Assign a default score of 0 for new users
    players[socket.id] = { username, score: 0 };

    socket.emit('authenticated', { username, score: 0 });

    // Notify others that a new player joined
    socket.broadcast.emit('gameUpdate', { message: `${username} has joined the game!` });

    console.log(`${username} authenticated`);
  });

  // Handle game actions (move, attack, etc.)
  socket.on('gameAction', (action) => {
    const player = players[socket.id];
    if (player) {
      console.log(`${player.username} performed action: ${action}`);

      // Example: update score when an action occurs
      if (action === 'attack') {
        player.score += 10;
      }

      // Emit updated game state to all players
      io.emit('gameUpdate', {
        player: player.username,
        action,
        score: player.score,
      });
    }
  });

  socket.on('disconnect', () => {
    const player = players[socket.id];
    if (player) {
      console.log(`${player.username} disconnected`);
      socket.broadcast.emit('gameUpdate', { message: `${player.username} has left the game!` });
      delete players[socket.id];  // Remove the player from the server
    }
  });
});

// Start server on port 3000
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
