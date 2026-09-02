import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    socket = io(url, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}
