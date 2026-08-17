// backend/src/routes/applicationRoutes.ts
import { Router } from 'express';
import * as applicationController from '../controllers/applicationController';

const router = Router();

router.post('/', applicationController.applyToJob);
router.get('/job/:jobId', applicationController.getJobApplications);
router.patch('/:id/status', applicationController.updateStatus);
router.get('/:id/history', applicationController.getHistory);

export default router;
