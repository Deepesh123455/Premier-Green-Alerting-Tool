import { Router } from 'express';
import { truckLogController } from '../controllers/truckLogController';
import { validateRequest } from '../middlewares/validateRequest';
import { truckLogSchema } from '../schemas/truckLogSchema';

const router = Router();

router.post('/', validateRequest(truckLogSchema), truckLogController.create);

export default router;
