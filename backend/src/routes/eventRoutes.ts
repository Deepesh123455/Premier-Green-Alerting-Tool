import { Router } from 'express';
import { eventController } from '../controllers/eventController';

const router = Router();

router.get('/', eventController.getAll);

export default router;
