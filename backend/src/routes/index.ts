import { Router } from 'express';
import entryExitRoutes from './entryExitRoutes';
import truckLogRoutes from './truckLogRoutes';
import incomingReportRoutes from './incomingReportRoutes';
import eventRoutes from './eventRoutes';

const router = Router();

router.use('/entry-exit', entryExitRoutes);
router.use('/truck-log', truckLogRoutes);
router.use('/incoming-report', incomingReportRoutes);
router.use('/events', eventRoutes);

export default router;
