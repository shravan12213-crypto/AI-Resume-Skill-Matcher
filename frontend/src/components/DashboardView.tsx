// frontend/src/components/DashboardView.tsx
import React from 'react';
import { Briefcase, Users, CheckCircle2, TrendingUp, ArrowRight, PlusCircle, Sparkles, MapPin, Clock } from 'lucide-react';
import { JobSummaryStats, Recruiter } from '../types';

interface DashboardViewProps {
  recruiter: Recruiter | null;
  jobs: JobSummaryStats[];
  onSelectJob: (jobId: number, targetTab: 'applications' | 'ranking') => void;
  openCreateModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  recruiter,
  jobs,
  onSelectJob,
  openCreateModal,
}) => {
  // Aggregate summary metrics
  const totalJobs = jobs.length;
  const totalApplications = jobs.reduce((acc, j) => acc + Number(j.total_applications || 0), 0);
  const totalShortlisted = jobs.reduce((acc, j) => acc + Number(j.shortlisted_count || 0), 0);
  const avgScores = jobs.filter((j) => j.avg_match_score !== null).map((j) => Number(j.avg_match_score));
  const overallAvgScore = avgScores.length
    ? (avgScores.reduce((a, b) => a + b, 0) / avgScores.length).toFixed(1)
    : '85.0';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-purple-950/40">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DBMS Recruiter Intelligence Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {recruiter?.name || 'Diana'}
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Manage postings for <span className="text-indigo-400 font-semibold">{recruiter?.company_name || 'TechCorp'}</span>, track candidate submissions, and inspect explainable SQL + pgvector matching scores.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Job Posting</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-panel p-5 rounded-xl border border-slate-800/80 hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Jobs</span>
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mt-3">{totalJobs}</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
            <span className="text-emerald-400 font-medium">100% open</span>
            <span>in PostgreSQL</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800/80 hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Applicants</span>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mt-3">{totalApplications}</div>
          <div className="text-xs text-slate-400 mt-1">Across all active postings</div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800/80 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Shortlisted</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-400 mt-3">{totalShortlisted}</div>
          <div className="text-xs text-slate-400 mt-1">Candidates in shortlist queue</div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800/80 hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Match Score</span>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-400 mt-3">{overallAvgScore}%</div>
          <div className="text-xs text-slate-400 mt-1">50/30/20 SQL formula</div>
        </div>
      </div>

      {/* Active Jobs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Your Job Postings & Live Metrics</h2>
            <p className="text-xs text-slate-400">Sourced directly from <code className="text-indigo-400">recruiter_job_summary_view</code></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.job_id}
              className="glass-panel-interactive rounded-xl p-5 flex flex-col justify-between border border-slate-800"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-base text-white hover:text-indigo-400 transition-colors">
                    {job.job_title}
                  </h3>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      job.job_status === 'open'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {job.job_status}
                  </span>
                </div>

                {/* Job Stats Pill Grid */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2">
                    <div className="text-xs text-slate-400">Applicants</div>
                    <div className="text-sm font-bold text-white mt-0.5">{job.total_applications}</div>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2">
                    <div className="text-xs text-slate-400">Shortlisted</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">{job.shortlisted_count}</div>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2">
                    <div className="text-xs text-slate-400">Avg Match</div>
                    <div className="text-sm font-bold text-indigo-400 mt-0.5">
                      {job.avg_match_score ? `${job.avg_match_score}%` : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectJob(job.job_id, 'applications')}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Applicants ({job.total_applications})</span>
                </button>

                <button
                  onClick={() => onSelectJob(job.job_id, 'ranking')}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-xs font-semibold text-indigo-300 border border-indigo-500/30 transition-colors"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Rank Matches</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
