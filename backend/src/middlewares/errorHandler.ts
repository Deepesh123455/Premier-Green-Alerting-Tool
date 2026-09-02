import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.warn(`Handled AppError [${err.statusCode}]: ${err.message}`);
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
      },
    });
    return;
  }

  logger.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
};
