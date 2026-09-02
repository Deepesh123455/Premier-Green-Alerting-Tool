import { Request, Response, NextFunction } from 'express';
import { eventService } from '../services/eventService';

export const eventController = {
  getAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const events = await eventService.getEvents(limit);
      res.status(200).json({
        success: true,
        data: events,
      });
    } catch (err) {
      next(err);
    }
  },
};
