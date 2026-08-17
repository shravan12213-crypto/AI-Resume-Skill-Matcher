// frontend/src/components/Navbar.tsx
import React from 'react';
import { Briefcase, Users, Award, LayoutDashboard, PlusCircle, Activity, Building2 } from 'lucide-react';
import { Recruiter } from '../types';

interface NavbarProps {
  activeTab: 'dashboard' | 'jobs' | 'applications' | 'ranking';
  setActiveTab: (tab: 'dashboard' | 'jobs' | 'applications' | 'ranking') => void;
  openCreateModal: () => void;
  currentRecruiter: Recruiter | null;
  onSwitchRecruiter: (id: number) => void;
  dbStatus: { status: string; database: string };
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openCreateModal,
  currentRecruiter,
  onSwitchRecruiter,
  dbStatus,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold gradient-text tracking-tight">SkillMatch</span>
              <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Recruiter
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'jobs'
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Job Postings</span>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'applications'
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Applications</span>
            </button>

            <button
              onClick={() => setActiveTab('ranking')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'ranking'
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Matching & Ranking</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Create Job CTA */}
            <button
              onClick={openCreateModal}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Post New Job</span>
            </button>

            {/* Recruiter Switcher Dropdown */}
            <div className="relative flex items-center bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-indigo-400 mr-1.5" />
              <select
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs"
                value={currentRecruiter?.recruiter_id || 1}
                onChange={(e) => onSwitchRecruiter(parseInt(e.target.value, 10))}
              >
                <option value={1} className="bg-slate-900">Diana (TechCorp)</option>
                <option value={2} className="bg-slate-900">Evan (InnovateLLC)</option>
              </select>
            </div>

            {/* DB Status Badge */}
            <div
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                dbStatus.database === 'connected'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
              title={dbStatus.database === 'connected' ? 'Connected to PostgreSQL' : 'Mock/Offline Mode'}
            >
              <Activity className="w-3 h-3 animate-pulse" />
              <span className="hidden lg:inline">{dbStatus.database === 'connected' ? 'PostgreSQL Active' : 'Offline / Standalone'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
