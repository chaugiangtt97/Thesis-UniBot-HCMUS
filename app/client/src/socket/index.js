
import { io } from 'socket.io-client';

let socket = null;
const socker_dir = import.meta.env.VITE_SOCKET
const sub_dir = import.meta.env.VITE_SUBDIR
let domain_socker = null
if (sub_dir) 
  domain_socker = `/${sub_dir}/${socker_dir}/`
else 
  domain_socker = `/${socker_dir}/`


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
      path: `/${socker_dir}/`,
      withCredentials: true,
      transports: ['websocket', 'polling'], // Chỉ sử dụng WebSocket
      reconnection: true, // Tự động kết nối lại khi bị ngắt
    });

    console.log('connect socket')

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