import { io } from 'socket.io-client';

const socketURL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export const socket = io(socketURL, {
  autoConnect: false
});
