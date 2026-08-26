// frontend/src/components/DashboardView.tsx
import React from 'react';
import {
  Briefcase,
  Users,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Sparkles,
  MapPin,
  Clock,
  Layers,
  Database,
  Search
} from 'lucide-react';
import { JobSummaryStats, Recruiter } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

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
    : '84.5';

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6">
      {/* Bento Hero Section */}
      <div className="relative rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-10 backdrop-blur-xl overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>In-Database PL/pgSQL Matching Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Welcome, {recruiter?.name || 'Recruiter'}
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Monitoring talent pipelines for <span className="text-zinc-100 font-semibold">{recruiter?.company_name || 'TechCorp'}</span>. Candidate ranking and scoring are computed deterministically inside PostgreSQL (70% Skill + 30% Experience).
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Button onClick={openCreateModal} className="h-11 px-5 shadow-lg whitespace-nowrap flex-shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              <span>Post New Position</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-zinc-700/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-mono text-xs uppercase tracking-wider text-zinc-400">
              Active Postings
            </CardDescription>
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Briefcase className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white font-display">{totalJobs}</div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <span>●</span> In `jobs` table
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-zinc-700/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-mono text-xs uppercase tracking-wider text-zinc-400">
              Total Applicants
            </CardDescription>
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white font-display">{totalApplications}</div>
            <p className="text-xs text-zinc-500 mt-1">Across all open pipelines</p>
          </CardContent>
        </Card>

        <Card className="hover:border-zinc-700/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-mono text-xs uppercase tracking-wider text-zinc-400">
              Shortlisted
            </CardDescription>
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400 font-display">{totalShortlisted}</div>
            <p className="text-xs text-zinc-500 mt-1">Qualified via SQL rules</p>
          </CardContent>
        </Card>

        <Card className="hover:border-zinc-700/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-mono text-xs uppercase tracking-wider text-zinc-400">
              Average Match
            </CardDescription>
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-300 font-display">{overallAvgScore}%</div>
            <p className="text-xs text-zinc-500 mt-1">From `recruiter_job_summary_view`</p>
          </CardContent>
        </Card>
      </div>

      {/* Mainline Job Positions Table / Bento Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white font-display">Active Job Openings</h2>
            <p className="text-xs text-zinc-400">Select a position to inspect real-time SQL candidate rankings or review applicants.</p>
          </div>
          <Badge variant="outline" className="font-mono text-[11px]">
            {jobs.length} Positions Available
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <Card
              key={job.job_id}
              className="group hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge
                    variant={job.status === 'open' ? 'success' : 'secondary'}
                    className="capitalize text-[11px]"
                  >
                    {job.status}
                  </Badge>
                  <span className="text-[11px] font-mono text-zinc-500">#{job.job_id}</span>
                </div>
                <CardTitle className="text-base font-semibold text-zinc-100 group-hover:text-white mt-2">
                  {job.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-zinc-500" />
                    {job.location || 'Remote'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    {job.experience_required_years}y min exp
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60 text-center">
                  <div>
                    <div className="text-xs font-bold text-zinc-200">{job.total_applications}</div>
                    <div className="text-[10px] text-zinc-500 uppercase">Applicants</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-400">{job.shortlisted_count}</div>
                    <div className="text-[10px] text-zinc-500 uppercase">Shortlisted</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-indigo-300">
                      {job.avg_match_score ? `${Math.round(Number(job.avg_match_score))}%` : '—'}
                    </div>
                    <div className="text-[10px] text-zinc-500 uppercase">Avg Match</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectJob(job.job_id, 'ranking')}
                    className="w-full text-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-zinc-400" />
                    <span>Rankings</span>
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onSelectJob(job.job_id, 'applications')}
                    className="w-full text-xs"
                  >
                    <Users className="w-3.5 h-3.5 mr-1" />
                    <span>Applicants</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
