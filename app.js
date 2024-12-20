const socket = io();

document.getElementById('login-btn').addEventListener('click', () => {
  const username = document.getElementById('username').value;
  if (username) {
    socket.emit('authenticate', { username });
  }
});

socket.on('authenticated', (data) => {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  document.getElementById('player-name').innerText = data.username;
  document.getElementById('score').innerText = `Score: ${data.score}`;
});

socket.on('gameUpdate', (gameState) => {
  // Update game elements based on gameState
  console.log('Game Update:', gameState);
});

// Emit a game action (e.g., move, attack, etc.)
function performAction(action) {
  socket.emit('gameAction', action);
}
