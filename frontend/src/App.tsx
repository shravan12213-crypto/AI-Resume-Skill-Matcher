// frontend/src/App.tsx
import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ApplicationsView } from './components/ApplicationsView';
import { RankingView } from './components/RankingView';
import { CandidateResumeView } from './components/CandidateResumeView';
import { CreateJobModal } from './components/CreateJobModal';
import { ExplainMatchModal } from './components/ExplainMatchModal';
import { StatusHistoryModal } from './components/StatusHistoryModal';
import { BackgroundGrid } from './components/ui/BackgroundGrid';
import { Recruiter, JobSummaryStats, Application, RankedCandidate } from './types';
import { api } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'applications' | 'ranking' | 'candidate'>('dashboard');
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
    } catch (error) {
      console.error('Failed to load recruiter data:', error);
      setRecruiter(null);
      setJobs([]);
      setSelectedJobId(null);
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
    } catch (error) {
      console.error('Failed to load job details:', error);
      setApplications([]);
      setRankedCandidates([]);
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
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update application status.');
    }
  };

  const handleSelectJobFromDashboard = (jobId: number, targetTab: 'applications' | 'ranking') => {
    setSelectedJobId(jobId);
    setActiveTab(targetTab);
  };

  return (
    <div className="relative min-h-screen bg-[#07080b] text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white pb-12">
      {/* Subtle Background Lighting & Grid */}
      <BackgroundGrid />

      {/* Floating Pill Navigation */}
      <div className="relative z-20">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openCreateModal={() => setIsCreateModalOpen(true)}
          currentRecruiter={recruiter}
          onSwitchRecruiter={(id) => setCurrentRecruiterId(id)}
          dbStatus={dbStatus}
        />
      </div>

      {/* Main View Container */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto py-2">
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

        {activeTab === 'candidate' && <CandidateResumeView />}
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
