// backend/src/controllers/applicationController.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as applicationService from '../services/applicationService';

const ApplySchema = z.object({
  candidate_id: z.number().int().positive(),
  job_id: z.number().int().positive(),
});

const StatusUpdateSchema = z.object({
  status: z.enum(['applied', 'shortlisted', 'rejected', 'hired']),
});

export const applyToJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { candidate_id, job_id } = ApplySchema.parse(req.body);
    const result = await applicationService.applyToJob(candidate_id, job_id);
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobId = parseInt(req.params.jobId, 10);
    if (isNaN(jobId)) {
      res.status(400).json({ success: false, message: 'Invalid job ID' });
      return;
    }

    const applications = await applicationService.getApplicationsByJob(jobId);
    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const applicationId = parseInt(req.params.id, 10);
    if (isNaN(applicationId)) {
      res.status(400).json({ success: false, message: 'Invalid application ID' });
      return;
    }

    const { status } = StatusUpdateSchema.parse(req.body);
    const updated = await applicationService.updateApplicationStatus(applicationId, status);
    if (!updated) {
      res.status(400).json({ success: false, message: 'Application not found' });
      return;
    }

    res.json({
      success: true,
      message: `Application status updated to ${status} (logged to history)`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const applicationId = parseInt(req.params.id, 10);
    if (isNaN(applicationId)) {
      res.status(400).json({ success: false, message: 'Invalid application ID' });
      return;
    }

    const history = await applicationService.getApplicationHistory(applicationId);
    res.json({ success: true, count: history.length, data: history });
  } catch (error) {
    next(error);
  }
};
