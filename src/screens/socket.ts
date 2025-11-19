import { io } from 'socket.io-client';

const SERVER_URL = 'http://192.168.1.7:5050'; 

const socket = io(SERVER_URL, {
  transports: ['websocket'], 
});

socket.on('connect', () => {
  console.log('[Socket] Server se connect ho gaya:', socket.id);
});

socket.on('disconnect', () => {
  console.log('[Socket] Server se disconnect ho gaya.');
});
export { socket };