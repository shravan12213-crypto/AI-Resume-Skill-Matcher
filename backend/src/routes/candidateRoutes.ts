import { Router } from 'express';
import { getCandidateProfile, updateCandidateProfile } from '../controllers/candidateController';
import { getCandidateResumes, getResume, createResume, deleteResume } from '../controllers/resumeController';

const router = Router();

router.get('/:id', getCandidateProfile);
router.put('/:id', updateCandidateProfile);

// Nested resume routes
router.get('/:candidateId/resumes', getCandidateResumes);
router.post('/:candidateId/resumes', createResume);
router.get('/:candidateId/resumes/:resumeId', getResume);
router.delete('/:candidateId/resumes/:resumeId', deleteResume);

export default router;
