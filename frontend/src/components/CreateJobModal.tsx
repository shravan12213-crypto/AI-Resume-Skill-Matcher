// frontend/src/components/CreateJobModal.tsx
import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2, AlertCircle, Briefcase, Sparkles, Layers } from 'lucide-react';
import { api } from '../services/api';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  recruiterId: number;
  onJobCreated: () => void;
}

const AVAILABLE_SKILLS = [
  { skill_id: 1, skill_name: 'Python', category: 'Programming Language' },
  { skill_id: 2, skill_name: 'SQL', category: 'Database' },
  { skill_id: 3, skill_name: 'React', category: 'Frontend Framework' },
  { skill_id: 4, skill_name: 'Node.js', category: 'Backend Framework' },
  { skill_id: 5, skill_name: 'Docker', category: 'DevOps' },
  { skill_id: 6, skill_name: 'Java', category: 'Programming Language' },
  { skill_id: 7, skill_name: 'C++', category: 'Programming Language' },
  { skill_id: 8, skill_name: 'PostgreSQL', category: 'Database' },
  { skill_id: 9, skill_name: 'JavaScript', category: 'Programming Language' },
  { skill_id: 10, skill_name: 'Git', category: 'Tools' },
];

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  recruiterId,
  onJobCreated,
}) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [experienceRequired, setExperienceRequired] = useState(3.0);
  const [description, setDescription] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<
    { skill_id: number; is_required: boolean; minimum_experience: number }[]
  >([
    { skill_id: 1, is_required: true, minimum_experience: 3.0 },
    { skill_id: 2, is_required: true, minimum_experience: 2.0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddSkill = (skillId: number) => {
    if (selectedSkills.some((s) => s.skill_id === skillId)) return;
    setSelectedSkills([...selectedSkills, { skill_id: skillId, is_required: true, minimum_experience: 2.0 }]);
  };

  const handleRemoveSkill = (skillId: number) => {
    setSelectedSkills(selectedSkills.filter((s) => s.skill_id !== skillId));
  };

  const handleToggleRequired = (skillId: number) => {
    setSelectedSkills(
      selectedSkills.map((s) =>
        s.skill_id === skillId ? { ...s, is_required: !s.is_required } : s
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Job title is required');
      return;
    }
    if (selectedSkills.length === 0) {
      setError('At least one skill requirement is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.createJob({
        recruiter_id: recruiterId,
        title,
        location,
        experience_required: Number(experienceRequired),
        description,
        skills: selectedSkills,
      });
      onJobCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create job posting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-900/90">
          <div>
            <h2 className="text-base font-semibold text-white font-display flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-zinc-300" />
              <span>Create New Position</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Persisted atomically across <code className="text-zinc-200 font-mono text-[11px]">jobs</code> and <code className="text-zinc-200 font-mono text-[11px]">job_skills</code> in a single transaction.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full">
            <X className="w-4 h-4 text-zinc-400" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Job Title */}
          <div className="space-y-1.5">
            <label className="font-medium text-zinc-300">Position Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Backend Engineer (PostgreSQL)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          {/* Location & Min Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-medium text-zinc-300">Location</label>
              <input
                type="text"
                placeholder="e.g. Remote / San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-medium text-zinc-300">Minimum Experience (Years)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={experienceRequired}
                onChange={(e) => setExperienceRequired(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-medium text-zinc-300">Job Description & Responsibilities</label>
            <textarea
              rows={3}
              placeholder="Describe core job responsibilities, tech stack, and requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          {/* Skill Requirements */}
          <div className="space-y-3 pt-2">
            <label className="font-medium text-zinc-300 flex items-center justify-between">
              <span>Required & Preferred Skills (Bridge Table: `job_skills`)</span>
              <span className="text-[11px] text-zinc-500 font-mono">
                {selectedSkills.length} configured
              </span>
            </label>

            {/* Quick Add Available Skills */}
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <span className="text-[11px] text-zinc-400 mr-2 py-0.5">Quick add:</span>
              {AVAILABLE_SKILLS.map((sk) => {
                const isSelected = selectedSkills.some((s) => s.skill_id === sk.skill_id);
                return (
                  <button
                    key={sk.skill_id}
                    type="button"
                    disabled={isSelected}
                    onClick={() => handleAddSkill(sk.skill_id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                      isSelected
                        ? 'bg-zinc-900 text-zinc-600 border border-zinc-900 cursor-not-allowed'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:text-white'
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>{sk.skill_name}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Skills Matrix */}
            <div className="space-y-2">
              {selectedSkills.map((sk) => {
                const skillInfo = AVAILABLE_SKILLS.find((s) => s.skill_id === sk.skill_id);
                return (
                  <div
                    key={sk.skill_id}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800/80"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-semibold text-zinc-200">
                        {skillInfo?.skill_name || `Skill #${sk.skill_id}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleRequired(sk.skill_id)}
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md font-semibold transition-colors ${
                          sk.is_required
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {sk.is_required ? 'Required (Mandatory)' : 'Preferred'}
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <span className="text-[11px]">Min exp:</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={sk.minimum_experience}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setSelectedSkills(
                              selectedSkills.map((s) =>
                                s.skill_id === sk.skill_id ? { ...s, minimum_experience: val } : s
                              )
                            );
                          }}
                          className="w-16 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 text-xs font-mono"
                        />
                        <span className="text-[11px]">yrs</span>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSkill(sk.skill_id)}
                        className="h-7 w-7 p-0 text-zinc-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? 'Creating Posting...' : 'Publish Job Posting'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
