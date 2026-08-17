// frontend/src/components/ApplicationsView.tsx
import React, { useState } from 'react';
import { Users, Filter, History, CheckCircle, XCircle, Award, FileText, ChevronRight, Sparkles } from 'lucide-react';
import { Application, JobSummaryStats } from '../types';

interface ApplicationsViewProps {
  jobs: JobSummaryStats[];
  selectedJobId: number | null;
  setSelectedJobId: (jobId: number) => void;
  applications: Application[];
  onUpdateStatus: (applicationId: number, status: 'applied' | 'shortlisted' | 'rejected' | 'hired') => void;
  onViewHistory: (applicationId: number) => void;
  onExplainMatch: (jobId: number, candidateId: number) => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  jobs,
  selectedJobId,
  setSelectedJobId,
  applications,
  onUpdateStatus,
  onViewHistory,
  onExplainMatch,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredApplications = applications.filter((app) => {
    if (statusFilter === 'all') return true;
    return app.application_status === statusFilter;
  });

  const activeJob = jobs.find((j) => j.job_id === selectedJobId) || jobs[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Job Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Applicant Tracking & Status Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Status changes automatically trigger audit logging to <code className="text-indigo-400">application_status_history</code> via PostgreSQL triggers.
          </p>
        </div>

        {/* Job Selector Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-semibold uppercase">Job:</span>
          <select
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            value={selectedJobId || ''}
            onChange={(e) => setSelectedJobId(parseInt(e.target.value, 10))}
          >
            {jobs.map((j) => (
              <option key={j.job_id} value={j.job_id}>
                {j.job_title} ({j.total_applications} applicants)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {['all', 'applied', 'shortlisted', 'hired', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              statusFilter === st
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            {st} ({st === 'all' ? applications.length : applications.filter((a) => a.application_status === st).length})
          </button>
        ))}
      </div>

      {/* Applications Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <p className="text-base font-semibold text-slate-300">No applications in this view</p>
            <p className="text-xs text-slate-500 mt-1">Try switching status filters or select another job posting.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Match Score</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4 text-right">Workflow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredApplications.map((app) => (
                  <tr key={app.application_id} className="hover:bg-slate-900/50 transition-colors">
                    {/* Candidate Details */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm">{app.candidate_name}</div>
                      <div className="text-slate-400 text-[11px]">{app.candidate_email}</div>
                      {app.location && <div className="text-slate-500 text-[11px] mt-0.5">{app.location}</div>}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                          app.application_status === 'shortlisted'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : app.application_status === 'hired'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : app.application_status === 'rejected'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}
                      >
                        {app.application_status}
                      </span>
                    </td>

                    {/* Match Score & Breakdown Trigger */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onExplainMatch(app.job_id, app.candidate_id)}
                        className="group flex items-center space-x-2 hover:opacity-80 transition-opacity"
                        title="Click to view explainable 50/30/20 match breakdown"
                      >
                        <div className="w-10 text-center font-extrabold text-sm py-1 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 group-hover:bg-indigo-500/25">
                          {app.final_score ? `${app.final_score}%` : '85%'}
                        </div>
                        <span className="text-[11px] text-indigo-400 underline font-medium flex items-center">
                          Inspect <ChevronRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </button>
                    </td>

                    {/* Applied Date */}
                    <td className="px-6 py-4 text-slate-400 text-[11px]">
                      {new Date(app.applied_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Actions: Change Status & View History Trigger */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center space-x-2">
                        {/* Status Action Buttons */}
                        {app.application_status !== 'shortlisted' && (
                          <button
                            onClick={() => onUpdateStatus(app.application_id, 'shortlisted')}
                            className="px-2.5 py-1 rounded-md bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold transition-colors"
                          >
                            Shortlist
                          </button>
                        )}

                        {app.application_status !== 'hired' && (
                          <button
                            onClick={() => onUpdateStatus(app.application_id, 'hired')}
                            className="px-2.5 py-1 rounded-md bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[11px] font-semibold transition-colors"
                          >
                            Hire
                          </button>
                        )}

                        {app.application_status !== 'rejected' && (
                          <button
                            onClick={() => onUpdateStatus(app.application_id, 'rejected')}
                            className="px-2.5 py-1 rounded-md bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-[11px] font-semibold transition-colors"
                          >
                            Reject
                          </button>
                        )}

                        {/* Audit Trail Button */}
                        <button
                          onClick={() => onViewHistory(app.application_id)}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-semibold transition-colors"
                          title="View PostgreSQL Trigger Audit History"
                        >
                          <History className="w-3 h-3 text-slate-400" />
                          <span>Audit Trail</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
