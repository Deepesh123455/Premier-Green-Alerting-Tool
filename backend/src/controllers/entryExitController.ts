import { Request, Response, NextFunction } from 'express';
import { entryExitService } from '../services/entryExitService';

export const entryExitController = {
  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const record = await entryExitService.createEntry(req.body);
      res.status(201).json({
        success: true,
        data: record,
      });
    } catch (err) {
      next(err);
    }
  },
};
