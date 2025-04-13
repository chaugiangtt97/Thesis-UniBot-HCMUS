
import { io } from 'socket.io-client';

let socket = null;
const domain = import.meta.env.VITE_SOCKET
const env = import.meta.env?.VITE_ENVIRONMENT

export const disconnectSocket = () => {
  if(socket){
    socket.disconnect();
    socket = null
  }

  return socket
}

export const connectSocket = (token) => {
  if (!socket) {
    socket = io( {
      auth: {
        token: token, // Truyền token vào trong auth
      },
      path: "/socket.io/",
      withCredentials: true,
      transports: ['websocket', 'polling'], // Chỉ sử dụng WebSocket
      reconnection: true, // Tự động kết nối lại khi bị ngắt
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket);
    });

    socket.on('connect_error', (err) => {
      socket = null
      console.error('Connection error:', err);
    });

    socket.on('disconnect', () => {
      socket = null
      console.error('Socket disconnected');
    });
  }

  return socket;
};



export const getSocket = () => socket;