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
      const json = await res.json();
      return json.data || [];
    } catch {
      return [
        {
          history_id: 1,
          application_id: applicationId,
          old_status: 'applied',
          new_status: 'shortlisted',
          changed_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ];
    }
  },

  // Matching
  getTopCandidates: async (jobId: number, limit = 10): Promise<RankedCandidate[]> => {
    try {
      const res = await fetch(`${API_BASE}/matching/job/${jobId}/top-candidates?limit=${limit}`);
      const json = await res.json();
      return json.data;
    } catch {
      return [
        {
          candidate_id: 1,
          candidate_name: 'Alice Candidate',
          email: 'alice@example.com',
          location: 'New York, NY',
          skill_score: 100,
          semantic_score: 85,
          experience_score: 100,
          final_score: 95.5,
          application_status: 'shortlisted',
        },
        {
          candidate_id: 3,
          candidate_name: 'Charlie Candidate',
          email: 'charlie@example.com',
          location: 'Austin, TX',
          skill_score: 50,
          semantic_score: 70,
          experience_score: 75,
          final_score: 61.0,
          application_status: 'rejected',
        },
      ];
    }
  },

  getExplainableMatch: async (jobId: number, candidateId: number): Promise<ExplainableMatch> => {
    try {
      const res = await fetch(`${API_BASE}/matching/explain/job/${jobId}/candidate/${candidateId}`);
      const json = await res.json();
      return json.data;
    } catch {
      const isAlice = candidateId === 1;
      return {
        candidate_id: candidateId,
        job_id: jobId,
        scores: {
          candidate_name: isAlice ? 'Alice Candidate' : 'Charlie Candidate',
          job_title: 'Senior Backend Developer',
          experience_required: 4.0,
          skill_score: isAlice ? 100.0 : 50.0,
          semantic_score: isAlice ? 85.0 : 70.0,
          experience_score: isAlice ? 100.0 : 75.0,
          final_score: isAlice ? 95.5 : 61.0,
          matched_at: new Date().toISOString(),
        },
        formula_weights: {
          skill_weight: '50%',
          semantic_weight: '30%',
          experience_weight: '20%',
        },
        skills_breakdown: {
          total_job_skills: 3,
          matched_skills_count: isAlice ? 3 : 1,
          missing_required_count: isAlice ? 0 : 1,
          matched: isAlice
            ? [
                { skill_name: 'Python', category: 'Programming', is_required: true, required_years: 4.0, candidate_years: 5.0 },
                { skill_name: 'SQL', category: 'Database', is_required: true, required_years: 3.0, candidate_years: 4.0 },
                { skill_name: 'PostgreSQL', category: 'Database', is_required: false, required_years: 2.0, candidate_years: 5.0 },
              ]
            : [
                { skill_name: 'Python', category: 'Programming', is_required: true, required_years: 4.0, candidate_years: 3.0 },
              ],
          missing_required: isAlice
            ? []
            : [
                { skill_name: 'SQL', category: 'Database', is_required: true, required_years: 3.0 },
              ],
          missing_optional: isAlice
            ? []
            : [
                { skill_name: 'PostgreSQL', category: 'Database', is_required: false, required_years: 2.0 },
              ],
        },
      };
    }
  },
};
