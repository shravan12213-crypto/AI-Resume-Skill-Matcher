// frontend/src/components/RankingView.tsx
import React from 'react';
import { Award, TrendingUp, Sparkles, UserCheck, ChevronRight, BrainCircuit, Database, Briefcase } from 'lucide-react';
import { RankedCandidate, JobSummaryStats } from '../types';

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
  const activeJob = jobs.find((j) => j.job_id === selectedJobId) || jobs[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-purple-950/30 via-slate-900/60 to-indigo-950/30">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SQL Relational + pgvector Cosine Model</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Award className="w-6 h-6 text-amber-400" />
            <span>Candidate Ranking Leaderboard</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Ranked via <code className="text-indigo-400">get_top_candidates(job_id)</code> using the locked weighted formula:
            <span className="text-slate-200 font-semibold ml-1">50% Skills + 30% Semantic Embeddings + 20% Experience</span>.
          </p>
        </div>

        {/* Job Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-semibold uppercase">Target Job:</span>
          <select
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 font-medium"
            value={selectedJobId || ''}
            onChange={(e) => setSelectedJobId(parseInt(e.target.value, 10))}
          >
            {jobs.map((j) => (
              <option key={j.job_id} value={j.job_id}>
                {j.job_title} ({j.total_applications} candidates)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="space-y-4">
        {rankedCandidates.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center text-slate-400">
            <Award className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <p className="text-base font-semibold text-slate-300">No scored candidates found for this job</p>
            <p className="text-xs text-slate-500 mt-1">Submit applications or calculate match scores in the database.</p>
          </div>
        ) : (
          rankedCandidates.map((c, index) => {
            const rank = index + 1;
            return (
              <div
                key={c.candidate_id}
                className={`glass-panel-interactive rounded-2xl p-5 border transition-all ${
                  rank === 1
                    ? 'border-amber-500/40 bg-gradient-to-r from-amber-500/5 via-slate-900 to-slate-900'
                    : rank === 2
                    ? 'border-slate-400/40'
                    : rank === 3
                    ? 'border-amber-700/40'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Rank & Candidate Details */}
                  <div className="flex items-start space-x-4">
                    {/* Rank Badge */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg flex-shrink-0 shadow-lg ${
                        rank === 1
                          ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                          : rank === 2
                          ? 'bg-slate-300 text-slate-950 shadow-slate-300/20'
                          : rank === 3
                          ? 'bg-amber-700 text-amber-100 shadow-amber-700/20'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      #{rank}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-white">{c.candidate_name}</h3>
                        {c.application_status && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                            {c.application_status}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{c.email}</div>
                      {c.location && <div className="text-[11px] text-slate-500 mt-0.5">{c.location}</div>}
                    </div>
                  </div>

                  {/* Middle: 3 Score Components Meter */}
                  <div className="flex-1 grid grid-cols-3 gap-3 max-w-xl">
                    {/* 50% Skill Score */}
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Database className="w-3 h-3 text-indigo-400" />
                          <span>Skill (50%)</span>
                        </span>
                        <span className="font-bold text-indigo-400">{c.skill_score}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${c.skill_score}%` }}
                        />
                      </div>
                    </div>

                    {/* 30% Semantic Score */}
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center space-x-1">
                          <BrainCircuit className="w-3 h-3 text-purple-400" />
                          <span>pgvector (30%)</span>
                        </span>
                        <span className="font-bold text-purple-400">{c.semantic_score}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-purple-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${c.semantic_score}%` }}
                        />
                      </div>
                    </div>

                    {/* 20% Experience Score */}
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Briefcase className="w-3 h-3 text-blue-400" />
                          <span>Exp (20%)</span>
                        </span>
                        <span className="font-bold text-blue-400">{c.experience_score}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${c.experience_score}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: Final Weighted Total & Action */}
                  <div className="flex items-center justify-between lg:justify-end space-x-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Final Match</div>
                      <div className="text-2xl font-black text-white">{c.final_score}%</div>
                    </div>

                    <button
                      onClick={() => onExplainMatch(selectedJobId || activeJob.job_id, c.candidate_id)}
                      className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
                    >
                      <span>Explain Breakdown</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
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
