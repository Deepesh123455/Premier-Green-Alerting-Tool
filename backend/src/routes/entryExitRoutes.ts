import { Router } from 'express';
import { entryExitController } from '../controllers/entryExitController';
import { validateRequest } from '../middlewares/validateRequest';
import { entryExitSchema } from '../schemas/entryExitSchema';

const router = Router();

router.post('/', validateRequest(entryExitSchema), entryExitController.create);

export default router;
