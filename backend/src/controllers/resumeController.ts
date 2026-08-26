import { Request, Response, NextFunction } from 'express';
import * as resumeService from '../services/resumeService';
import * as candidateService from '../services/candidateService';

export const getCandidateResumes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const candidateId = parseInt(req.params.candidateId, 10);
    if (isNaN(candidateId)) {
      res.status(400).json({ success: false, message: 'Invalid candidate ID' });
      return;
    }

    const candidate = await candidateService.getCandidateById(candidateId);
    if (!candidate) {
      res.status(404).json({ success: false, message: 'Candidate not found' });
      return;
    }

    const resumes = await resumeService.getCandidateResumes(candidateId);
    res.json({ success: true, data: resumes });
  } catch (error) {
    next(error);
  }
};

export const getResume = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const candidateId = parseInt(req.params.candidateId, 10);
    const resumeId = parseInt(req.params.resumeId, 10);
    if (isNaN(candidateId)) {
      res.status(400).json({ success: false, message: 'Invalid candidate ID' });
      return;
    }
    if (isNaN(resumeId)) {
      res.status(400).json({ success: false, message: 'Invalid resume ID' });
      return;
    }

    const candidate = await candidateService.getCandidateById(candidateId);
    if (!candidate) {
      res.status(404).json({ success: false, message: 'Candidate not found' });
      return;
    }

    const resume = await resumeService.getResumeByIdAndCandidate(resumeId, candidateId);
    if (!resume) {
      res.status(404).json({ success: false, message: 'Resume not found' });
      return;
    }

    res.json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

export const createResume = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const candidateId = parseInt(req.params.candidateId, 10);
    if (isNaN(candidateId)) {
      res.status(400).json({ success: false, message: 'Invalid candidate ID' });
      return;
    }

    const candidate = await candidateService.getCandidateById(candidateId);
    if (!candidate) {
      res.status(404).json({ success: false, message: 'Candidate not found' });
      return;
    }

    const { file_name, file_url, raw_text } = req.body;
    if (!file_name || !file_url) {
      res.status(400).json({ success: false, message: 'file_name and file_url are required' });
      return;
    }

    const newResume = await resumeService.createResume(candidateId, file_name, file_url, raw_text);
    res.status(201).json({ success: true, data: newResume });
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const candidateId = parseInt(req.params.candidateId, 10);
    const resumeId = parseInt(req.params.resumeId, 10);
    if (isNaN(candidateId)) {
      res.status(400).json({ success: false, message: 'Invalid candidate ID' });
      return;
    }
    if (isNaN(resumeId)) {
      res.status(400).json({ success: false, message: 'Invalid resume ID' });
      return;
    }

    const candidate = await candidateService.getCandidateById(candidateId);
    if (!candidate) {
      res.status(404).json({ success: false, message: 'Candidate not found' });
      return;
    }

    const deleted = await resumeService.deleteResumeByCandidate(resumeId, candidateId);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Resume not found' });
      return;
    }

    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    next(error);
  }
};

import * as aiService from '../services/aiService';

export const extractResume = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const candidateId = parseInt(req.params.candidateId, 10);
    const resumeId = parseInt(req.params.resumeId, 10);
    
    if (isNaN(candidateId) || isNaN(resumeId)) {
      res.status(400).json({ success: false, message: 'Invalid IDs' });
      return;
    }

    const resume = await resumeService.getResumeByIdAndCandidate(resumeId, candidateId);
    if (!resume) {
      res.status(404).json({ success: false, message: 'Resume not found' });
      return;
    }

    if (!resume.raw_text || resume.raw_text.trim() === '') {
      res.status(400).json({ success: false, message: 'Resume raw_text is empty or missing' });
      return;
    }

    // Call AI Extraction
    const extractedData = await aiService.extractResumeData(resume.raw_text);

    // Save structured data and skills
    const savedData = await aiService.saveExtractionAndSkills(resumeId, candidateId, extractedData);

    res.json({ success: true, data: savedData });
  } catch (error: any) {
    next(error);
  }
};
