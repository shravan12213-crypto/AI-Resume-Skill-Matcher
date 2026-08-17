// frontend/src/components/ExplainMatchModal.tsx
import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, XCircle, Award, Database, BrainCircuit, Briefcase, HelpCircle, Loader2 } from 'lucide-react';
import { ExplainableMatch } from '../types';
import { api } from '../services/api';

interface ExplainMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: number | null;
  candidateId: number | null;
}

export const ExplainMatchModal: React.FC<ExplainMatchModalProps> = ({
  isOpen,
  onClose,
  jobId,
  candidateId,
}) => {
  const [data, setData] = useState<ExplainableMatch | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && jobId && candidateId) {
      setLoading(true);
      api
        .getExplainableMatch(jobId, candidateId)
        .then((res) => setData(res))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, jobId, candidateId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-indigo-400" />
              <span>Explainable Match Score Breakdown</span>
            </h2>
            <p className="text-xs text-slate-400">
              Deterministic scoring formula for <span className="text-indigo-400 font-semibold">{data?.scores?.candidate_name || 'Candidate'}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <span className="text-xs font-medium">Fetching relational match data...</span>
            </div>
          ) : (
            <>
              {/* Formula & Overall Score Banner */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-purple-950/50 border border-indigo-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                      Locked Weighting Formula
                    </span>
                    <div className="text-xs font-mono text-slate-300 mt-1">
                      Final = (Skill × 0.50) + (Semantic × 0.30) + (Exp × 0.20)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Final Score</div>
                    <div className="text-3xl font-black text-indigo-300">
                      {data?.scores?.final_score ?? 85}%
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Metric Score Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Skill Score (50%) */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center space-x-1 font-semibold text-slate-300">
                      <Database className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Skill Score</span>
                    </span>
                    <span className="text-indigo-400 font-bold">{data?.scores?.skill_score ?? 80}%</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">
                    Weight: <span className="text-slate-300 font-semibold">50%</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Contribution: <span className="text-indigo-400 font-bold">{(((data?.scores?.skill_score ?? 80) * 0.5)).toFixed(1)} pts</span>
                  </div>
                </div>

                {/* Semantic Score (30%) */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center space-x-1 font-semibold text-slate-300">
                      <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                      <span>pgvector Score</span>
                    </span>
                    <span className="text-purple-400 font-bold">{data?.scores?.semantic_score ?? 75}%</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">
                    Weight: <span className="text-slate-300 font-semibold">30%</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Contribution: <span className="text-purple-400 font-bold">{(((data?.scores?.semantic_score ?? 75) * 0.3)).toFixed(1)} pts</span>
                  </div>
                </div>

                {/* Experience Score (20%) */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center space-x-1 font-semibold text-slate-300">
                      <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                      <span>Experience Score</span>
                    </span>
                    <span className="text-blue-400 font-bold">{data?.scores?.experience_score ?? 100}%</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">
                    Weight: <span className="text-slate-300 font-semibold">20%</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Contribution: <span className="text-blue-400 font-bold">{(((data?.scores?.experience_score ?? 100) * 0.2)).toFixed(1)} pts</span>
                  </div>
                </div>
              </div>

              {/* Skills Verification Breakdown */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Required & Optional Skills Audit
                </h3>

                {/* Matched Skills */}
                <div className="space-y-2">
                  <div className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Matched Skills ({data?.skills_breakdown?.matched?.length || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data?.skills_breakdown?.matched?.map((s, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{s.skill_name}</span>
                        {s.candidate_years && (
                          <span className="text-[10px] text-emerald-400/70 font-mono">({s.candidate_years} yrs)</span>
                        )}
                      </div>
                    ))}
                    {(!data?.skills_breakdown?.matched || data.skills_breakdown.matched.length === 0) && (
                      <span className="text-xs text-slate-500 italic">No matching skills found</span>
                    )}
                  </div>
                </div>

                {/* Missing Required Skills */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="text-xs text-rose-400 font-semibold flex items-center space-x-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Missing Required Skills ({data?.skills_breakdown?.missing_required?.length || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data?.skills_breakdown?.missing_required?.map((s, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium"
                      >
                        <XCircle className="w-3 h-3 text-rose-400" />
                        <span>{s.skill_name}</span>
                        {s.required_years && (
                          <span className="text-[10px] text-rose-400/70 font-mono">(Req: {s.required_years} yrs)</span>
                        )}
                      </div>
                    ))}
                    {(!data?.skills_breakdown?.missing_required || data.skills_breakdown.missing_required.length === 0) && (
                      <span className="text-xs text-slate-500 italic">None — candidate meets all required skills!</span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
