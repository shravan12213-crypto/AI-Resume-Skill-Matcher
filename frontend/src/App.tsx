// frontend/src/App.tsx
import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ApplicationsView } from './components/ApplicationsView';
import { RankingView } from './components/RankingView';
import { CreateJobModal } from './components/CreateJobModal';
import { ExplainMatchModal } from './components/ExplainMatchModal';
import { StatusHistoryModal } from './components/StatusHistoryModal';
import { Recruiter, JobSummaryStats, Application, RankedCandidate } from './types';
import { api } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'applications' | 'ranking'>('dashboard');
  const [currentRecruiterId, setCurrentRecruiterId] = useState<number>(1);
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
  const [jobs, setJobs] = useState<JobSummaryStats[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const [applications, setApplications] = useState<Application[]>([]);
  const [rankedCandidates, setRankedCandidates] = useState<RankedCandidate[]>([]);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [explainCandidate, setExplainCandidate] = useState<{ jobId: number; candidateId: number } | null>(null);
  const [auditAppId, setAuditAppId] = useState<number | null>(null);

  // Health state
  const [dbStatus, setDbStatus] = useState<{ status: string; database: string }>({
    status: 'checking',
    database: 'checking',
  });

  // 1. Initial Load & Healthcheck
  useEffect(() => {
    api.checkHealth().then((res) => setDbStatus(res));
  }, []);

  // 2. Load Recruiter & Jobs on Recruiter Switch
  useEffect(() => {
    loadRecruiterData(currentRecruiterId);
  }, [currentRecruiterId]);

  const loadRecruiterData = async (recruiterId: number) => {
    try {
      const rec = await api.getRecruiter(recruiterId);
      setRecruiter(rec);

      const recJobs = await api.getRecruiterJobs(recruiterId);
      setJobs(recJobs);

      if (recJobs.length > 0 && (!selectedJobId || !recJobs.some((j) => j.job_id === selectedJobId))) {
        setSelectedJobId(recJobs[0].job_id);
      }
    } catch {
      // Fallback mock state for standalone demo
      const mockRecruiter: Recruiter = {
        recruiter_id: recruiterId,
        user_id: recruiterId === 1 ? 5 : 6,
        name: recruiterId === 1 ? 'Diana Recruiter' : 'Evan Recruiter',
        email: recruiterId === 1 ? 'diana@example.com' : 'evan@example.com',
        company_name: recruiterId === 1 ? 'TechCorp' : 'InnovateLLC',
        designation: recruiterId === 1 ? 'Senior Technical Recruiter' : 'Talent Acquisition Lead',
        created_at: new Date().toISOString(),
      };
      setRecruiter(mockRecruiter);

      const mockJobs: JobSummaryStats[] = [
        {
          job_id: 1,
          recruiter_id: recruiterId,
          job_title: 'Senior Backend Developer',
          job_status: 'open',
          created_at: new Date().toISOString(),
          total_applications: 3,
          pending_applications: 1,
          shortlisted_count: 1,
          hired_count: 0,
          rejected_count: 1,
          avg_match_score: 87.5,
        },
        {
          job_id: 2,
          recruiter_id: recruiterId,
          job_title: 'Frontend UI Specialist',
          job_status: 'open',
          created_at: new Date().toISOString(),
          total_applications: 2,
          pending_applications: 1,
          shortlisted_count: 1,
          hired_count: 0,
          rejected_count: 0,
          avg_match_score: 92.0,
        },
      ];
      setJobs(mockJobs);
      setSelectedJobId(1);
    }
  };

  // 3. Load Applications & Ranked Candidates when selectedJobId changes
  useEffect(() => {
    if (selectedJobId) {
      loadJobDetails(selectedJobId);
    }
  }, [selectedJobId]);

  const loadJobDetails = async (jobId: number) => {
    try {
      const apps = await api.getJobApplications(jobId);
      setApplications(apps);

      const ranked = await api.getTopCandidates(jobId);
      setRankedCandidates(ranked);
    } catch {
      // Mock candidates
      const mockApps: Application[] = [
        {
          application_id: 1,
          candidate_id: 1,
          candidate_name: 'Alice Candidate',
          candidate_email: 'alice@example.com',
          location: 'New York, NY',
          job_id: jobId,
          application_status: 'shortlisted',
          applied_at: new Date().toISOString(),
          skill_score: 100,
          semantic_score: 85,
          experience_score: 100,
          final_score: 95.5,
        },
        {
          application_id: 4,
          candidate_id: 3,
          candidate_name: 'Charlie Candidate',
          candidate_email: 'charlie@example.com',
          location: 'Austin, TX',
          job_id: jobId,
          application_status: 'rejected',
          applied_at: new Date().toISOString(),
          skill_score: 50,
          semantic_score: 70,
          experience_score: 75,
          final_score: 61.0,
        },
      ];
      setApplications(mockApps);

      const mockRanked: RankedCandidate[] = [
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
      setRankedCandidates(mockRanked);
    }
  };

  const handleUpdateStatus = async (
    applicationId: number,
    status: 'applied' | 'shortlisted' | 'rejected' | 'hired'
  ) => {
    try {
      await api.updateApplicationStatus(applicationId, status);
      if (selectedJobId) loadJobDetails(selectedJobId);
      loadRecruiterData(currentRecruiterId);
    } catch {
      setApplications(
        applications.map((a) => (a.application_id === applicationId ? { ...a, application_status: status } : a))
      );
    }
  };

  const handleSelectJobFromDashboard = (jobId: number, targetTab: 'applications' | 'ranking') => {
    setSelectedJobId(jobId);
    setActiveTab(targetTab);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openCreateModal={() => setIsCreateModalOpen(true)}
        currentRecruiter={recruiter}
        onSwitchRecruiter={(id) => setCurrentRecruiterId(id)}
        dbStatus={dbStatus}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            recruiter={recruiter}
            jobs={jobs}
            onSelectJob={handleSelectJobFromDashboard}
            openCreateModal={() => setIsCreateModalOpen(true)}
          />
        )}

        {activeTab === 'jobs' && (
          <DashboardView
            recruiter={recruiter}
            jobs={jobs}
            onSelectJob={handleSelectJobFromDashboard}
            openCreateModal={() => setIsCreateModalOpen(true)}
          />
        )}

        {activeTab === 'applications' && (
          <ApplicationsView
            jobs={jobs}
            selectedJobId={selectedJobId}
            setSelectedJobId={setSelectedJobId}
            applications={applications}
            onUpdateStatus={handleUpdateStatus}
            onViewHistory={(appId) => setAuditAppId(appId)}
            onExplainMatch={(jobId, candidateId) => setExplainCandidate({ jobId, candidateId })}
          />
        )}

        {activeTab === 'ranking' && (
          <RankingView
            jobs={jobs}
            selectedJobId={selectedJobId}
            setSelectedJobId={setSelectedJobId}
            rankedCandidates={rankedCandidates}
            onExplainMatch={(jobId, candidateId) => setExplainCandidate({ jobId, candidateId })}
          />
        )}
      </main>

      {/* Modals */}
      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        recruiterId={currentRecruiterId}
        onJobCreated={() => loadRecruiterData(currentRecruiterId)}
      />

      <ExplainMatchModal
        isOpen={explainCandidate !== null}
        onClose={() => setExplainCandidate(null)}
        jobId={explainCandidate?.jobId || null}
        candidateId={explainCandidate?.candidateId || null}
      />

      <StatusHistoryModal
        isOpen={auditAppId !== null}
        onClose={() => setAuditAppId(null)}
        applicationId={auditAppId}
      />
    </div>
  );
}

export default App;
