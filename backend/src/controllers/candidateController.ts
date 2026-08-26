import { Request, Response, NextFunction } from 'express';
import * as candidateService from '../services/candidateService';

export const getCandidateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const candidateId = parseInt(req.params.id, 10);
    if (isNaN(candidateId)) {
      res.status(400).json({ success: false, message: 'Invalid candidate ID' });
      return;
    }

    const candidate = await candidateService.getCandidateById(candidateId);
    if (!candidate) {
      res.status(404).json({ success: false, message: 'Candidate not found' });
      return;
    }

    res.json({ success: true, data: candidate });
  } catch (error) {
    next(error);
  }
};

export const updateCandidateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const candidateId = parseInt(req.params.id, 10);
    if (isNaN(candidateId)) {
      res.status(400).json({ success: false, message: 'Invalid candidate ID' });
      return;
    }

    const { phone, location, summary } = req.body;
    const updatedCandidate = await candidateService.updateCandidateProfile(candidateId, { phone, location, summary });
    
    if (!updatedCandidate) {
      res.status(404).json({ success: false, message: 'Candidate not found' });
      return;
    }

    res.json({ success: true, data: updatedCandidate });
  } catch (error) {
    next(error);
  }
};
