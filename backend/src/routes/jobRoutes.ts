// backend/src/routes/jobRoutes.ts
import { Router } from 'express';
import * as jobController from '../controllers/jobController';

const router = Router();

router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJob);
router.post('/', jobController.createJob);
router.patch('/:id/status', jobController.updateJobStatus);

export default router;
