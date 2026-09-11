// backend/src/routes/matchingRoutes.ts
import { Router } from 'express';
import * as matchingController from '../controllers/matchingController';

const router = Router();

router.get('/job/:jobId/top-candidates', matchingController.getTopCandidates);
router.get('/explain/job/:jobId/candidate/:candidateId', matchingController.getExplainableMatch);


export default router;
