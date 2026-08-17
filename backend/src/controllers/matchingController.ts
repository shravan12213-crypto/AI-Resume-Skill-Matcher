// backend/src/controllers/matchingController.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as matchingService from '../services/matchingService';

const CalculateSchema = z.object({
  candidate_id: z.number().int().positive(),
  job_id: z.number().int().positive(),
});

export const getTopCandidates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobId = parseInt(req.params.jobId, 10);
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    if (isNaN(jobId)) {
      res.status(400).json({ success: false, message: 'Invalid job ID' });
      return;
    }

    const rankedCandidates = await matchingService.getTopCandidatesForJob(jobId, limit);
    res.json({
      success: true,
      job_id: jobId,
      count: rankedCandidates.length,
      data: rankedCandidates,
    });
  } catch (error) {
    next(error);
  }
};

export const getExplainableMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobId = parseInt(req.params.jobId, 10);
    const candidateId = parseInt(req.params.candidateId, 10);

    if (isNaN(jobId) || isNaN(candidateId)) {
      res.status(400).json({ success: false, message: 'Invalid job ID or candidate ID' });
      return;
    }

    const matchDetails = await matchingService.getExplainableMatch(jobId, candidateId);
    res.json({ success: true, data: matchDetails });
  } catch (error) {
    next(error);
  }
};

export const calculateMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { candidate_id, job_id } = CalculateSchema.parse(req.body);
    const result = await matchingService.calculateMatch(candidate_id, job_id);
    res.json({
      success: true,
      message: 'Match score calculated and saved to database',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
