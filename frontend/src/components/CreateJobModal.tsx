// frontend/src/components/CreateJobModal.tsx
import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div>
            <h2 className="text-lg font-bold text-white">Post New Job Requirement</h2>
            <p className="text-xs text-slate-400">Atomic transactional insert into <code className="text-indigo-400">jobs</code> and <code className="text-indigo-400">job_skills</code></p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="flex items-center space-x-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lead PostgreSQL Architect"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote / New York, NY"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Experience Required (Years)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={experienceRequired}
              onChange={(e) => setExperienceRequired(parseFloat(e.target.value) || 0)}
              className="w-full sm:w-1/2 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Job Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the role, stack, and responsibilities..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Skill Selection Section */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Skills & Requirements (50% SQL Weight)
              </label>
              <span className="text-xs text-indigo-400">{selectedSkills.length} configured</span>
            </div>

            {/* Quick Add Pills */}
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_SKILLS.map((sk) => {
                const isSelected = selectedSkills.some((s) => s.skill_id === sk.skill_id);
                return (
                  <button
                    type="button"
                    key={sk.skill_id}
                    onClick={() => handleAddSkill(sk.skill_id)}
                    disabled={isSelected}
                    className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                      isSelected
                        ? 'bg-slate-800/40 text-slate-500 border-slate-800 cursor-not-allowed'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-indigo-500/50'
                    }`}
                  >
                    + {sk.skill_name}
                  </button>
                );
              })}
            </div>

            {/* Configured Skill Rows */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedSkills.map((sk) => {
                const skillInfo = AVAILABLE_SKILLS.find((s) => s.skill_id === sk.skill_id);
                return (
                  <div
                    key={sk.skill_id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                  >
                    <span className="font-semibold text-slate-200">{skillInfo?.skill_name}</span>

                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => handleToggleRequired(sk.skill_id)}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          sk.is_required
                            ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {sk.is_required ? 'Required (Mandatory)' : 'Optional'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(sk.skill_id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
            >
              {loading ? 'Creating...' : 'Publish Job Posting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
