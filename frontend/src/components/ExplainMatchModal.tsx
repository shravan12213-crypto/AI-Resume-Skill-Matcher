// frontend/src/components/ExplainMatchModal.tsx
import React, { useEffect, useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  Award,
  Database,
  Briefcase,
  Loader2,
  Sparkles,
  Calculator
} from 'lucide-react';
import { ExplainableMatch } from '../types';
import { api } from '../services/api';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

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

  const skillScore = Number(data?.scores?.skill_score || 0);
  const expScore = Number(data?.scores?.experience_score || 0);
  const finalScore = Number(data?.scores?.final_score || 0);
  const semanticScore = Number(data?.scores?.semantic_score || 0);

  const skillContribution = (skillScore * 0.5).toFixed(1);
  const semanticContribution = (semanticScore * 0.3).toFixed(1);
  const expContribution = (expScore * 0.2).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-900/90">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-zinc-400" />
              <h2 className="text-base font-semibold text-white font-display">
                Transparent Match Calculation
              </h2>
            </div>
            <p className="text-xs text-zinc-400">
              Deterministic breakdown for candidate <span className="text-zinc-200 font-medium">{data?.scores?.candidate_name || `#${candidateId}`}</span>
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full">
            <X className="w-4 h-4 text-zinc-400" />
          </Button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-zinc-400 space-y-2">
              <Loader2 className="w-7 h-7 animate-spin text-zinc-400" />
              <span className="text-xs font-medium">Computing in-database score breakdown...</span>
            </div>
          ) : (
            <>
              {/* Formula & Overall Score Banner */}
              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                      Locked Weighting Formula
                    </span>
                    <div className="text-xs font-mono text-zinc-200 bg-zinc-900/80 px-2 py-1 rounded-lg border border-zinc-800">
                      Final Score = (Skill Score × 0.50) + (Semantic Score × 0.30) + (Experience Score × 0.20)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Overall Match</div>
                    <div className="text-3xl font-bold font-display text-white">
                      {finalScore.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Metric Score Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Skill Score (50%) */}
                <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5 font-medium text-zinc-200">
                      <Database className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Skill Match</span>
                    </span>
                    <span className="text-emerald-400 font-bold font-mono">{skillScore.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/50">
                    <span>Weight: <strong className="text-zinc-200">50%</strong></span>
                    <span>Contribution: <strong className="text-emerald-300 font-mono">+{skillContribution} pts</strong></span>
                  </div>
                </div>

                {/* Semantic Score (30%) */}
                <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5 font-medium text-zinc-200">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>Semantic Match</span>
                    </span>
                    <span className="text-purple-400 font-bold font-mono">{semanticScore.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/50">
                    <span>Weight: <strong className="text-zinc-200">30%</strong></span>
                    <span>Contribution: <strong className="text-purple-300 font-mono">+{semanticContribution} pts</strong></span>
                  </div>
                </div>

                {/* Experience Score (20%) */}
                <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5 font-medium text-zinc-200">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Experience Match</span>
                    </span>
                    <span className="text-indigo-400 font-bold font-mono">{expScore.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/50">
                    <span>Weight: <strong className="text-zinc-200">20%</strong></span>
                    <span>Contribution: <strong className="text-indigo-300 font-mono">+{expContribution} pts</strong></span>
                  </div>
                </div>
              </div>

              {/* Matched vs Missing Skills */}
              <div className="space-y-4 pt-1">
                {/* Matched Skills */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Matched Skills</span>
                    <span className="text-zinc-500 font-mono text-[11px]">
                      ({data?.matched_skills?.length || 0})
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {data?.matched_skills && data.matched_skills.length > 0 ? (
                      data.matched_skills.map((s, idx) => (
                        <Badge key={idx} variant="matched" className="py-1 px-2.5 gap-1.5">
                          <span>✓</span>
                          <span>{s.skill_name}</span>
                          {s.proficiency && (
                            <span className="text-[10px] text-emerald-400/80 font-mono">
                              ({s.proficiency})
                            </span>
                          )}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-zinc-500 italic">No matching skills found.</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Missing Required Skills</span>
                    <span className="text-zinc-500 font-mono text-[11px]">
                      ({data?.missing_skills?.length || 0})
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {data?.missing_skills && data.missing_skills.length > 0 ? (
                      data.missing_skills.map((s, idx) => (
                        <Badge key={idx} variant="missing" className="py-1 px-2.5 gap-1.5">
                          <span className="text-rose-400">✕</span>
                          <span>{s.skill_name}</span>
                          {s.is_required && (
                            <span className="text-[9px] uppercase font-mono text-amber-400 font-bold">
                              Required
                            </span>
                          )}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="success" className="text-xs">
                        All required job skills are satisfied!
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/60 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Breakdown
          </Button>
        </div>
      </div>
    </div>
  );
};
