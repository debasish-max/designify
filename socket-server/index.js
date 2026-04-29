require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for dev
    methods: ["GET", "POST"]
  }
});

// Map to track socket.id -> userEmail
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  // Send current list to the new connection immediately (they might be offline users just viewing)
  const getCurrentPresence = () => Array.from(new Set(onlineUsers.values()));
  socket.emit('presence_update', getCurrentPresence());

  // When a user identifies themselves
  socket.on('user_connected', (email) => {
    if (email) {
      onlineUsers.set(socket.id, email);
      console.log(`User identity mapped: ${socket.id} -> ${email}`);
      
      // Broadcast to EVERYONE that someone new is online
      io.emit('presence_update', getCurrentPresence());
    }
  });

  // Explicit request for presence (useful if a component mounts later)
  socket.on('get_presence', () => {
    socket.emit('presence_update', getCurrentPresence());
  });

  socket.on('disconnect', (reason) => {
    const email = onlineUsers.get(socket.id);
    onlineUsers.delete(socket.id);
    console.log('A client disconnected:', socket.id, email || '', 'Reason:', reason);
    
    // Broadcast the updated list
    io.emit('presence_update', getCurrentPresence());
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO Presence Server is running on port ${PORT}`);
});
