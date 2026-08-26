// frontend/src/components/Navbar.tsx
import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  Award,
  LayoutDashboard,
  Plus,
  Activity,
  Building2,
  FileText,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { Recruiter } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface NavbarProps {
  activeTab: 'dashboard' | 'jobs' | 'applications' | 'ranking' | 'candidate';
  setActiveTab: (tab: 'dashboard' | 'jobs' | 'applications' | 'ranking' | 'candidate') => void;
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
  const [showRecruiterDropdown, setShowRecruiterDropdown] = useState(false);

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs' as const, label: 'Jobs', icon: Briefcase },
    { id: 'applications' as const, label: 'Applications', icon: Users },
    { id: 'ranking' as const, label: 'Matching', icon: Award },
    { id: 'candidate' as const, label: 'AI Extraction', icon: Sparkles },
  ];

  return (
    <header className="sticky top-3 z-50 w-full px-2 sm:px-4 lg:px-6 mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 glass-pill rounded-3xl px-3 sm:px-4 py-2 sm:py-2.5 transition-all duration-300">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-400 flex items-center justify-center text-zinc-950 font-bold text-xs sm:text-sm shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
            SM
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-xs sm:text-sm tracking-tight text-white whitespace-nowrap">
              SkillMatch
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/60">
              DBMS
            </span>
          </div>
        </div>

        {/* Navigation Tabs - with horizontal scroll support on small screens */}
        <nav className="flex items-center gap-1 bg-zinc-900/60 p-1 rounded-2xl border border-zinc-800/60 backdrop-blur-md overflow-x-auto max-w-[calc(100vw-220px)] sm:max-w-none scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 select-none whitespace-nowrap flex-shrink-0 ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-950 shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-zinc-950' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* PostgreSQL Live Indicator */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400 flex-shrink-0 whitespace-nowrap">
            <span className={`w-2 h-2 rounded-full ${dbStatus.status === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="font-mono text-zinc-300">PL/pgSQL</span>
          </div>

          {/* Recruiter Switcher */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowRecruiterDropdown(!showRecruiterDropdown)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 text-xs text-zinc-200 transition-colors whitespace-nowrap"
            >
              <Building2 className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
              <span className="max-w-[80px] sm:max-w-[120px] truncate font-medium">
                {currentRecruiter ? currentRecruiter.company_name : 'Recruiter'}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-500 flex-shrink-0" />
            </button>

            {showRecruiterDropdown && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-zinc-800 mb-1">
                  <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Switch Recruiter (Demo)</div>
                </div>
                {[
                  { id: 1, name: 'Sarah Connor', company: 'TechCorp Solutions' },
                  { id: 2, name: 'Marcus Wright', company: 'CloudScale Systems' },
                  { id: 3, name: 'Elena Fisher', company: 'Apex Robotics' },
                ].map((rec) => (
                  <button
                    key={rec.id}
                    onClick={() => {
                      onSwitchRecruiter(rec.id);
                      setShowRecruiterDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex flex-col transition-colors ${
                      currentRecruiter?.recruiter_id === rec.id
                        ? 'bg-zinc-800 text-white font-medium'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                    }`}
                  >
                    <span className="font-semibold text-zinc-200">{rec.company}</span>
                    <span className="text-[11px] text-zinc-500">{rec.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* New Job CTA */}
          <Button onClick={openCreateModal} size="sm" className="hidden sm:inline-flex flex-shrink-0 whitespace-nowrap">
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Post Job</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
