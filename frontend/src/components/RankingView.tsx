// frontend/src/components/RankingView.tsx
import React, { useState } from 'react';
import {
  Award,
  TrendingUp,
  Sparkles,
  UserCheck,
  ChevronRight,
  Database,
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { RankedCandidate, JobSummaryStats } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface RankingViewProps {
  jobs: JobSummaryStats[];
  selectedJobId: number | null;
  setSelectedJobId: (jobId: number) => void;
  rankedCandidates: RankedCandidate[];
  onExplainMatch: (jobId: number, candidateId: number) => void;
}

export const RankingView: React.FC<RankingViewProps> = ({
  jobs,
  selectedJobId,
  setSelectedJobId,
  rankedCandidates,
  onExplainMatch,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const activeJob = jobs.find((j) => j.job_id === selectedJobId) || jobs[0];

  const filteredCandidates = rankedCandidates.filter((c) =>
    (c.candidate_name || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
    (c.candidate_email || '').toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header Section */}
      <div className="relative rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <span>Table-Valued PL/pgSQL Function</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display flex items-center gap-2.5">
              <Award className="w-7 h-7 text-zinc-200" />
              <span>Candidate Matching Leaderboard</span>
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Evaluating candidate qualification via <code className="font-mono text-zinc-200 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">get_top_candidates(p_job_id)</code> using the relational formula:
              <span className="text-zinc-100 font-semibold ml-1">70% Skill Score + 30% Experience Score</span>.
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>
        <div className="text-xs font-mono text-zinc-500 self-end sm:self-center">
          Showing {filteredCandidates.length} candidate{filteredCandidates.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Leaderboard Cards */}
      <div className="space-y-3">
        {filteredCandidates.length === 0 ? (
          <div className="p-12 rounded-2xl border border-zinc-800/80 bg-zinc-950/40 text-center text-zinc-500">
            <Award className="w-10 h-10 mx-auto text-zinc-700 mb-2" />
            <p className="text-sm font-semibold text-zinc-300">No scored candidates found</p>
            <p className="text-xs text-zinc-500 mt-1">Submit applications or calculate match scores in the database.</p>
          </div>
        ) : (
          filteredCandidates.map((c, index) => {
            const rank = index + 1;
            const finalScore = Number(c.final_score || 0);
            const skillScore = Number(c.skill_score || 0);
            const expScore = Number(c.experience_score || 0);

            return (
              <div
                key={c.candidate_id}
                className="group p-5 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Left: Rank badge & Candidate Profile */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 border ${
                        rank === 1
                          ? 'bg-zinc-100 text-zinc-950 border-white shadow-md'
                          : rank === 2
                          ? 'bg-zinc-800 text-zinc-200 border-zinc-700'
                          : rank === 3
                          ? 'bg-zinc-900 text-zinc-300 border-zinc-800'
                          : 'bg-zinc-950 text-zinc-500 border-zinc-900'
                      }`}
                    >
                      #{rank}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white">
                          {c.candidate_name}
                        </h3>
                        {rank === 1 && (
                          <Badge variant="default" className="text-[10px] py-0 px-2">
                            Top Match
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400">{c.candidate_email}</p>
                      <div className="flex items-center gap-3 text-[11px] text-zinc-500 pt-0.5">
                        <span>Candidate ID: #{c.candidate_id}</span>
                        {c.years_experience !== undefined && (
                          <span>• {c.years_experience} yrs exp</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Score Progress Indicators (70/30) */}
                  <div className="flex-1 max-w-md grid grid-cols-2 gap-4 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/50">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-400">Skill (70%)</span>
                        <span className="font-mono text-zinc-200 font-semibold">{skillScore.toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${Math.min(100, Math.max(0, skillScore))}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-400">Exp (30%)</span>
                        <span className="font-mono text-zinc-200 font-semibold">{expScore.toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-400 rounded-full"
                          style={{ width: `${Math.min(100, Math.max(0, expScore))}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: Overall Score & Explain Action */}
                  <div className="flex items-center justify-between lg:justify-end gap-5">
                    <div className="text-right">
                      <div className="text-2xl font-bold font-display text-white">
                        {finalScore.toFixed(1)}%
                      </div>
                      <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                        Final Score
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => selectedJobId && onExplainMatch(selectedJobId, c.candidate_id)}
                      className="text-xs gap-1.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Explain</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
