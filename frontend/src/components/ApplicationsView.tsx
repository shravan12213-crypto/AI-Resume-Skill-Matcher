// frontend/src/components/ApplicationsView.tsx
import React, { useState } from 'react';
import {
  Users,
  Filter,
  History,
  CheckCircle2,
  XCircle,
  Award,
  FileText,
  ChevronRight,
  Sparkles,
  Search,
  Clock
} from 'lucide-react';
import { Application, JobSummaryStats } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

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
  const [searchFilter, setSearchFilter] = useState<string>('');

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.application_status === statusFilter;
    const matchesSearch =
      (app.candidate_name || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (app.candidate_email || '').toLowerCase().includes(searchFilter.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return <Badge variant="success">Shortlisted</Badge>;
      case 'hired':
        return <Badge variant="accent">Hired</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Applied</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6">
      {/* Top Header & Position Selector */}
      <div className="relative rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300">
              <History className="w-3.5 h-3.5 text-zinc-400" />
              <span>Automated Audit Triggers (`application_status_history`)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display flex items-center gap-2.5">
              <Users className="w-7 h-7 text-zinc-200" />
              <span>Applicant Tracking Pipeline</span>
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-xl">
              Updating application status automatically invokes PostgreSQL row-level triggers to write timestamped audit records.
            </p>
          </div>

          {/* Job Selector Dropdown */}
          <div className="flex flex-col gap-1.5 min-w-[240px]">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Position</label>
            <select
              className="bg-zinc-900 border border-zinc-700/80 text-zinc-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-zinc-600 font-medium"
              value={selectedJobId || ''}
              onChange={(e) => setSelectedJobId(parseInt(e.target.value, 10))}
            >
              {jobs.map((j) => (
                <option key={j.job_id} value={j.job_id}>
                  {j.title} ({j.total_applications} applicants)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-zinc-900/60 p-1 rounded-2xl border border-zinc-800/60">
          {['all', 'applied', 'shortlisted', 'hired', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all select-none ${
                statusFilter === st
                  ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              {st} ({st === 'all' ? applications.length : applications.filter((a) => a.application_status === st).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Filter applicant name..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-xl overflow-hidden shadow-xl">
        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <Users className="w-10 h-10 mx-auto text-zinc-700 mb-2" />
            <p className="text-sm font-semibold text-zinc-300">No applications match this filter</p>
            <p className="text-xs text-zinc-500 mt-1">Try selecting another filter or posting.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900/90 text-zinc-400 font-mono uppercase text-[11px] border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-3.5">Candidate</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Match Score</th>
                  <th className="px-6 py-3.5">Applied At</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredApplications.map((app) => (
                  <tr key={app.application_id} className="hover:bg-zinc-900/40 transition-colors">
                    
                    {/* Candidate info */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-100">{app.candidate_name}</div>
                      <div className="text-zinc-500 text-[11px] font-mono">{app.candidate_email}</div>
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      {getStatusBadge(app.application_status)}
                    </td>

                    {/* Score */}
                    <td className="px-6 py-4">
                      {app.match_score !== null ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-zinc-200 text-sm">
                            {Number(app.match_score).toFixed(0)}%
                          </span>
                          <button
                            onClick={() => selectedJobId && onExplainMatch(selectedJobId, app.candidate_id)}
                            className="text-[11px] text-zinc-400 hover:text-zinc-200 underline"
                          >
                            Details
                          </button>
                        </div>
                      ) : (
                        <span className="text-zinc-600 font-mono">—</span>
                      )}
                    </td>

                    {/* Applied date */}
                    <td className="px-6 py-4 text-zinc-400 font-mono text-[11px]">
                      {new Date(app.applied_at).toLocaleDateString()}
                    </td>

                    {/* Workflow actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {/* Status Select */}
                        <select
                          value={app.application_status}
                          onChange={(e) =>
                            onUpdateStatus(
                              app.application_id,
                              e.target.value as 'applied' | 'shortlisted' | 'rejected' | 'hired'
                            )
                          }
                          className="bg-zinc-900 border border-zinc-700/80 text-zinc-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                        >
                          <option value="applied">Applied</option>
                          <option value="shortlisted">Shortlist</option>
                          <option value="hired">Hire</option>
                          <option value="rejected">Reject</option>
                        </select>

                        {/* Audit History Trigger */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewHistory(app.application_id)}
                          className="h-8 px-2 text-zinc-400 hover:text-zinc-200"
                          title="View Trigger Audit Trail"
                        >
                          <History className="w-3.5 h-3.5" />
                        </Button>
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
