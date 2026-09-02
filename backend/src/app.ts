import express, { Application } from 'express';
import cors from 'cors';
import { corsOrigins } from './config/env';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

export const createApp = (): Application => {
  const app = express();

  // Standard Middlewares
  app.use(
    cors({
      origin: corsOrigins,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Mount API Routes
  app.use('/api', routes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
