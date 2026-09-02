import { Request, Response, NextFunction } from 'express';
import { incomingReportService } from '../services/incomingReportService';

export const incomingReportController = {
  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const record = await incomingReportService.createIncomingReport(req.body);
      res.status(201).json({
        success: true,
        data: record,
      });
    } catch (err) {
      next(err);
    }
  },
};
