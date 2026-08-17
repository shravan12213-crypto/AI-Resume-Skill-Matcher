export interface Recruiter {
  recruiter_id: number;
  user_id: number;
  name: string;
  email: string;
  company_name: string;
  designation?: string;
  created_at: string;
}

export interface JobSkill {
  skill_id: number;
  skill_name: string;
  category?: string;
  is_required: boolean;
  minimum_experience?: number;
}

export interface Job {
  job_id: number;
  recruiter_id: number;
  company_name?: string;
  title: string;
  description?: string;
  location?: string;
  experience_required: number;
  status: 'open' | 'closed';
  created_at: string;
  total_skills_count?: number;
  skills?: JobSkill[];
}

export interface JobSummaryStats {
  job_id: number;
  recruiter_id: number;
  job_title: string;
  job_status: 'open' | 'closed';
  created_at: string;
  total_applications: number;
  pending_applications: number;
  shortlisted_count: number;
  hired_count: number;
  rejected_count: number;
  avg_match_score: number | null;
}

export interface Application {
  application_id: number;
  candidate_id: number;
  candidate_name: string;
  candidate_email: string;
  phone?: string;
  location?: string;
  resume_id?: number;
  resume_file?: string;
  resume_url?: string;
  job_id: number;
  application_status: 'applied' | 'shortlisted' | 'rejected' | 'hired';
  applied_at: string;
  skill_score?: number;
  semantic_score?: number;
  experience_score?: number;
  final_score?: number;
}

export interface StatusHistory {
  history_id: number;
  application_id: number;
  old_status: string | null;
  new_status: string;
  changed_at: string;
}

export interface RankedCandidate {
  candidate_id: number;
  candidate_name: string;
  email: string;
  location?: string;
  skill_score: number;
  semantic_score: number;
  experience_score: number;
  final_score: number;
  application_status?: string;
}

export interface ExplainableMatch {
  candidate_id: number;
  job_id: number;
  scores: {
    skill_score: number;
    semantic_score: number;
    experience_score: number;
    final_score: number;
    matched_at: string;
    job_title: string;
    experience_required: number;
    candidate_name: string;
  } | null;
  formula_weights: {
    skill_weight: string;
    semantic_weight: string;
    experience_weight: string;
  };
  skills_breakdown: {
    total_job_skills: number;
    matched_skills_count: number;
    missing_required_count: number;
    matched: any[];
    missing_required: any[];
    missing_optional: any[];
  };
}
