const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  const getCurrentPresence = () => Array.from(new Set(onlineUsers.values()));
  socket.emit('presence_update', getCurrentPresence());

  socket.on('user_connected', (email) => {
    if (email) {
      onlineUsers.set(socket.id, email);
      console.log(`User identity mapped: ${socket.id} -> ${email}`);

      io.emit('presence_update', getCurrentPresence());
    }
  });

  socket.on('get_presence', () => {
    socket.emit('presence_update', getCurrentPresence());
  });

  socket.on('disconnect', () => {
    const email = onlineUsers.get(socket.id);
    onlineUsers.delete(socket.id);
    console.log('A client disconnected:', socket.id, email || '');

    io.emit('presence_update', getCurrentPresence());
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO Presence Server is running on port ${PORT}`);
});
