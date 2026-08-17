// backend/src/controllers/recruiterController.ts
import { Request, Response, NextFunction } from 'express';
import * as recruiterService from '../services/recruiterService';

export const getRecruiterProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const recruiterId = parseInt(req.params.id, 10);
    if (isNaN(recruiterId)) {
      res.status(400).json({ success: false, message: 'Invalid recruiter ID' });
      return;
    }

    const recruiter = await recruiterService.getRecruiterById(recruiterId);
    if (!recruiter) {
      res.status(400).json({ success: false, message: 'Recruiter not found' });
      return;
    }

    res.json({ success: true, data: recruiter });
  } catch (error) {
    next(error);
  }
};

export const getRecruiterDashboardJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const recruiterId = parseInt(req.params.id, 10);
    if (isNaN(recruiterId)) {
      res.status(400).json({ success: false, message: 'Invalid recruiter ID' });
      return;
    }

    const jobs = await recruiterService.getRecruiterJobsWithStats(recruiterId);
    res.json({ success: true, data: jobs });
  } catch (error) {
    next(error);
  }
};
