import http from 'http';
import { createApp } from './app';
import { env } from './config/env';
import { pool } from './config/db';
import { initSocket } from './sockets';
import { logger } from './utils/logger';

const app = createApp();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

const PORT = env.PORT || 5000;

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(`❌ Port ${PORT} is already in use by another running instance.`);
    logger.error(`💡 If restarting, stop the previous terminal running "npm run dev" or terminate the process on port ${PORT}.`);
    process.exit(1);
  } else {
    logger.error('❌ Server startup error:', err);
    process.exit(1);
  }
});

server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📡 Socket.io server ready`);
  logger.info(`🔗 API Base: http://localhost:${PORT}/api`);
});

// Graceful shutdown
const shutdown = async () => {
  logger.info('🛑 Shutting down server gracefully...');
  server.close(async () => {
    logger.info('🔌 Closed remaining HTTP / WebSocket connections.');
    try {
      await pool.end();
      logger.info('🗄️ Closed PostgreSQL database pool.');
    } catch (e) {
      logger.error('Error closing db pool:', e);
    }
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
