import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { corsOrigins } from '../config/env';
import { logger } from '../utils/logger';
import { EventType } from '../types/event';

let io: SocketIOServer | null = null;

export const initSocket = (httpServer: HttpServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: corsOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    logger.info(`🔌 Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const emitNewEvent = (type: EventType, record: Record<string, unknown>): void => {
  if (!io) {
    logger.warn('Socket.io has not been initialized yet. Skipping event emission.');
    return;
  }

  const payload = {
    ...record,
    type,
  };

  logger.info(`📡 Emitting event:new for type: ${type}`);
  io.emit('event:new', payload);
};
