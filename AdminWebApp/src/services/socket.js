import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    if (this.socket?.connected) return;
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    this.socket.on('connect', () => console.log('Socket connected'));
    this.socket.on('disconnect', (reason) => console.log('Socket disconnected:', reason));
    this.socket.on('connect_error', (err) => console.error('Socket error:', err.message));

    this.socket.emit('join:admin');
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) { this.socket?.on(event, callback); }
  off(event, callback) { this.socket?.off(event, callback); }
  emit(event, data) { this.socket?.emit(event, data); }

  subscribeTripUpdates(tripId) { this.socket?.emit('trip:subscribe', { tripId }); }
  unsubscribeTripUpdates(tripId) { this.socket?.emit('trip:unsubscribe', { tripId }); }
}

const socketService = new SocketService();
export default socketService;
