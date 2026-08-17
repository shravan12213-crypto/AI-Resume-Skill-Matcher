// backend/src/controllers/jobController.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as jobService from '../services/jobService';

const CreateJobSchema = z.object({
  recruiter_id: z.number().int().positive(),
  title: z.string().min(3).max(150),
  description: z.string().optional(),
  location: z.string().max(100).optional(),
  experience_required: z.number().min(0).optional(),
  skills: z.array(
    z.object({
      skill_id: z.number().int().positive(),
      is_required: z.boolean(),
      minimum_experience: z.number().min(0).optional(),
    })
  ).min(1, 'At least one skill must be assigned to the job'),
});

export const getJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const jobs = await jobService.getAllJobs(status, search);
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    next(error);
  }
};

export const getJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobId = parseInt(req.params.id, 10);
    if (isNaN(jobId)) {
      res.status(400).json({ success: false, message: 'Invalid job ID' });
      return;
    }

    const job = await jobService.getJobById(jobId);
    if (!job) {
      res.status(400).json({ success: false, message: 'Job not found' });
      return;
    }

    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = CreateJobSchema.parse(req.body);
    const newJob = await jobService.createJob(validatedData);
    res.status(201).json({ success: true, message: 'Job created successfully', data: newJob });
  } catch (error) {
    next(error);
  }
};

export const updateJobStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobId = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (!['open', 'closed'].includes(status)) {
      res.status(400).json({ success: false, message: "Status must be 'open' or 'closed'" });
      return;
    }

    const updated = await jobService.updateJobStatus(jobId, status);
    if (!updated) {
      res.status(400).json({ success: false, message: 'Job not found' });
      return;
    }

    res.json({ success: true, message: `Job marked as ${status}`, data: updated });
  } catch (error) {
    next(error);
  }
};
