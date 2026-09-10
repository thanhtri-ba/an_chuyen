import { io, type Socket } from 'socket.io-client';

// backend/src/core/socket.ts mounts Socket.IO on the same HTTP server as the
// REST API but at the root path, not under /api — so strip that suffix from
// the REST base URL instead of hardcoding a separate env var.
const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, '');

let socket: Socket | null = null;

// Lazy singleton: only opens a connection the first time a component actually
// needs realtime updates (seat map, GPS tracking...), not on every page load.
export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, { autoConnect: true, transports: ['websocket', 'polling'] });
  }
  return socket;
}
