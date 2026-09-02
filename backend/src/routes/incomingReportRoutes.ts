import { Router } from 'express';
import { incomingReportController } from '../controllers/incomingReportController';
import { validateRequest } from '../middlewares/validateRequest';
import { incomingReportSchema } from '../schemas/incomingReportSchema';

const router = Router();

router.post('/', validateRequest(incomingReportSchema), incomingReportController.create);

export default router;
