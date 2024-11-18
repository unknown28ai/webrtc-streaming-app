const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (optional, e.g., logs or status pages)
app.get('/', (req, res) => {
  res.send('WebRTC Backend is running');
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Relay signaling data
  socket.on('signal', ({ target, signal }) => {
    io.to(target).emit('signal', { sender: socket.id, signal });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Listen on the environment's port or 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});