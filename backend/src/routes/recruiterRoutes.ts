// backend/src/routes/recruiterRoutes.ts
import { Router } from 'express';
import * as recruiterController from '../controllers/recruiterController';

const router = Router();

router.get('/:id', recruiterController.getRecruiterProfile);
router.get('/:id/jobs', recruiterController.getRecruiterDashboardJobs);

export default router;
