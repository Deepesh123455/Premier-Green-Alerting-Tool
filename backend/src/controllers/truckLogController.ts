import { Request, Response, NextFunction } from 'express';
import { truckLogService } from '../services/truckLogService';

export const truckLogController = {
  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const record = await truckLogService.createTruckLog(req.body);
      res.status(201).json({
        success: true,
        data: record,
      });
    } catch (err) {
      next(err);
    }
  },
};
