// frontend/src/services/api.ts
import {
  Recruiter,
  Job,
  JobSummaryStats,
  Application,
  StatusHistory,
  RankedCandidate,
  ExplainableMatch,
} from '../types';

const API_BASE = '/api';

export const api = {
  // Healthcheck
  checkHealth: async (): Promise<{ status: string; database: string }> => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch {
      return { status: 'offline', database: 'disconnected' };
    }
  },

  // Recruiters
  getRecruiter: async (id: number): Promise<Recruiter> => {
    const res = await fetch(`${API_BASE}/recruiters/${id}`);
    const json = await res.json();
    return json.data;
  },

  getRecruiterJobs: async (id: number): Promise<JobSummaryStats[]> => {
    const res = await fetch(`${API_BASE}/recruiters/${id}/jobs`);
    const json = await res.json();
    return json.data;
  },

  // Jobs
  getJobs: async (status?: string, search?: string): Promise<Job[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/jobs?${params.toString()}`);
    const json = await res.json();
    return json.data;
  },

  getJob: async (id: number): Promise<Job> => {
    const res = await fetch(`${API_BASE}/jobs/${id}`);
    const json = await res.json();
    return json.data;
  },

  createJob: async (payload: {
    recruiter_id: number;
    title: string;
    description?: string;
    location?: string;
    experience_required?: number;
    skills: { skill_id: number; is_required: boolean; minimum_experience?: number }[];
  }): Promise<Job> => {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to create job');
    return json.data;
  },

  updateJobStatus: async (id: number, status: 'open' | 'closed'): Promise<Job> => {
    const res = await fetch(`${API_BASE}/jobs/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    return json.data;
  },

  // Applications
  getJobApplications: async (jobId: number): Promise<Application[]> => {
    const res = await fetch(`${API_BASE}/applications/job/${jobId}`);
    const json = await res.json();
    return json.data;
  },

  updateApplicationStatus: async (
    applicationId: number,
    status: 'applied' | 'shortlisted' | 'rejected' | 'hired'
  ): Promise<Application> => {
    const res = await fetch(`${API_BASE}/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    return json.data;
  },

  getApplicationHistory: async (applicationId: number): Promise<StatusHistory[]> => {
    try {
      const res = await fetch(`${API_BASE}/applications/${applicationId}/history`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch (err: any) {
      throw new Error(err.message || 'Failed to fetch application history');
    }
  },

  // Matching
  getTopCandidates: async (jobId: number, limit = 10): Promise<RankedCandidate[]> => {
    try {
      const res = await fetch(`${API_BASE}/matching/job/${jobId}/top-candidates?limit=${limit}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch (err: any) {
      throw new Error(err.message || 'Failed to fetch top candidates');
    }
  },

  getExplainableMatch: async (jobId: number, candidateId: number): Promise<ExplainableMatch> => {
    try {
      const res = await fetch(`${API_BASE}/matching/explain/job/${jobId}/candidate/${candidateId}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to fetch explainable match');
    }
  },

  // Candidates & AI Resume Extraction
  getCandidateProfile: async (candidateId: number) => {
    try {
      const res = await fetch(`${API_BASE}/candidates/${candidateId}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to fetch candidate profile');
      return json.data;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to fetch candidate profile');
    }
  },

  updateCandidateProfile: async (candidateId: number, data: { phone?: string; location?: string; summary?: string }) => {
    try {
      const res = await fetch(`${API_BASE}/candidates/${candidateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to update profile');
      return json.data;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update profile');
    }
  },

  deleteResume: async (candidateId: number, resumeId: number) => {
    try {
      const res = await fetch(`${API_BASE}/candidates/${candidateId}/resumes/${resumeId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to delete resume');
      return true;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete resume');
    }
  },

  getCandidateResumes: async (candidateId: number) => {
    try {
      const res = await fetch(`${API_BASE}/candidates/${candidateId}/resumes`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to fetch resumes');
      return json.data || [];
    } catch (err: any) {
      throw new Error(err.message || 'Failed to fetch resumes');
    }
  },

  createResume: async (candidateId: number, data: { file_name: string; file_url: string; raw_text?: string }) => {
    try {
      const res = await fetch(`${API_BASE}/candidates/${candidateId}/resumes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to create resume');
      return json.data;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create resume');
    }
  },

  extractResumeData: async (candidateId: number, resumeId: number) => {
    try {
      const res = await fetch(`${API_BASE}/candidates/${candidateId}/resumes/${resumeId}/extract`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'AI extraction failed');
      return json.data;
    } catch (err: any) {
      throw new Error(err.message || 'AI extraction failed');
    }
  },
};

