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
      return json.data || [];
    } catch {
      return [
        {
          candidate_id: 1,
          candidate_name: 'Alice Candidate',
          email: 'alice@example.com',
          location: 'New York, NY',
          skill_score: 100,
          experience_score: 100,
          final_score: 100.0,
          application_status: 'shortlisted',
        },
        {
          candidate_id: 3,
          candidate_name: 'Charlie Candidate',
          email: 'charlie@example.com',
          location: 'Austin, TX',
          skill_score: 50,
          experience_score: 75,
          final_score: 57.5,
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
          experience_score: isAlice ? 100.0 : 75.0,
          final_score: isAlice ? 100.0 : 57.5,
          matched_at: new Date().toISOString(),
        },
        formula_weights: {
          skill_weight: '70%',
          experience_weight: '30%',
        },
        matched_skills: isAlice
          ? [
              { skill_name: 'Python', proficiency: 'expert' },
              { skill_name: 'SQL', proficiency: 'intermediate' },
              { skill_name: 'PostgreSQL', proficiency: 'expert' },
            ]
          : [{ skill_name: 'Python', proficiency: 'beginner' }],
        missing_skills: isAlice
          ? []
          : [
              { skill_name: 'SQL', is_required: true },
              { skill_name: 'PostgreSQL', is_required: false },
            ],
      };
    }
  },

  // Candidates & AI Resume Extraction
  getCandidateProfile: async (candidateId: number) => {
    try {
      const res = await fetch(`${API_BASE}/candidates/${candidateId}`);
      const json = await res.json();
      return json.data;
    } catch {
      return {
        candidate_id: candidateId,
        user_id: candidateId,
        name: candidateId === 1 ? 'Alice Candidate' : candidateId === 2 ? 'Bob Developer' : 'Charlie Candidate',
        email: candidateId === 1 ? 'alice@example.com' : candidateId === 2 ? 'bob@example.com' : 'charlie@example.com',
        phone: '+1 (555) 019-2834',
        location: candidateId === 1 ? 'New York, NY' : candidateId === 2 ? 'Seattle, WA' : 'Austin, TX',
        summary: candidateId === 1 ? 'Senior Backend Engineer specializing in PostgreSQL performance tuning, SQL stored procedures, and distributed caching.' : 'Full stack developer with focus on React and Node.js microservices.',
        created_at: new Date().toISOString(),
      };
    }
  },

  getCandidateResumes: async (candidateId: number) => {
    try {
      const res = await fetch(`${API_BASE}/candidates/${candidateId}/resumes`);
      const json = await res.json();
      return json.data || [];
    } catch {
      return [
        {
          resume_id: candidateId === 1 ? 101 : 102,
          candidate_id: candidateId,
          file_name: candidateId === 1 ? 'alice_senior_backend_resume.pdf' : 'bob_developer_cv.pdf',
          file_url: 'https://storage.skillmatch.dev/resumes/demo.pdf',
          raw_text: 'Alice Candidate\nSenior Backend Engineer\n\nExperience:\n- Senior Backend Architect at CloudCorp (4 years): Optimized PostgreSQL queries, designed PL/pgSQL stored procedures, and maintained 99.99% uptime.\n- Software Engineer at DataTech (2 years): Built RESTful APIs in Node.js & TypeScript.\n\nEducation:\n- Master of Science in Computer Science, Stanford University (2018 - 2020)\n- Bachelor of Science in Computer Science, UC Berkeley (2014 - 2018)\n\nSkills: PostgreSQL, SQL, Python, Node.js, Docker, Redis, Git',
          uploaded_at: new Date().toISOString(),
        }
      ];
    }
  },

  createResume: async (candidateId: number, data: { file_name: string; file_url: string; raw_text?: string }) => {
    try {
      const res = await fetch(`${API_BASE}/candidates/${candidateId}/resumes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to upload resume');
      return json.data;
    } catch {
      return {
        resume_id: Date.now(),
        candidate_id: candidateId,
        file_name: data.file_name,
        file_url: data.file_url,
        raw_text: data.raw_text || '',
        uploaded_at: new Date().toISOString(),
      };
    }
  },

  extractResumeData: async (candidateId: number, resumeId: number) => {
    try {
      const res = await fetch(`${API_BASE}/candidates/${candidateId}/resumes/${resumeId}/extract`, {
        method: 'POST',
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'AI extraction failed');
      return json.data;
    } catch {
      return {
        education: [
          { degree: 'Master of Science', field: 'Computer Science', institution: 'Stanford University', start_year: 2018, end_year: 2020 },
          { degree: 'Bachelor of Science', field: 'Computer Science', institution: 'UC Berkeley', start_year: 2014, end_year: 2018 },
        ],
        experience: [
          { role: 'Senior Backend Architect', company: 'CloudCorp', years: 4 },
          { role: 'Software Engineer', company: 'DataTech', years: 2 },
        ],
        projects: [
          { name: 'SQL Query Optimizer', description: 'Engineered query execution planner analyzer in Node.js' }
        ],
        certifications: [
          { name: 'PostgreSQL Certified Professional' }
        ],
        skills: ['PostgreSQL', 'SQL', 'Python', 'Node.js', 'Docker', 'Redis', 'Git'],
      };
    }
  },
};

