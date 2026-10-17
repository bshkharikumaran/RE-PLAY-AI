import React, { useState } from 'react';
import {
  Activity,
  ShieldAlert,
  UserCheck,
  Award,
  ChevronDown,
  Sparkles,
  ClipboardList,
  HeartPulse,
  Compass,
  FileText,
  User,
  Sliders,
  PlayCircle
} from 'lucide-react';
import { UserRole } from '../types/index.js';

interface NavbarProps {
  currentRole: UserRole;
  currentUserName: string;
  onSwitchUser: (userId: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCheckin: () => void;
  onStartDemoTour: () => void;
  onOpenReport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentUserName,
  onSwitchUser,
  activeTab,
  setActiveTab,
  onOpenCheckin,
  onStartDemoTour,
  onOpenReport,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-xl">
      {/* Top Clinical Safety Micro-Banner */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-cyan-950/90 border-b border-emerald-500/20 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium text-[11px] border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            CLINICAL SAFETY DIRECTIVE
          </span>
          <span className="hidden sm:inline text-slate-300">
            Doctor/Physiotherapist-Guided Decision Support. Never replaces clinical diagnosis or emergency medical care.
          </span>
          <span className="sm:hidden text-slate-300 truncate">
            Physiotherapist-Guided AI Decision Support
          </span>
        </div>

        <button
          onClick={onStartDemoTour}
          className="hidden md:flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 transition cursor-pointer"
        >
          <PlayCircle className="w-3.5 h-3.5 text-cyan-400" />
          Interactive Demo Tour
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 shadow-lg shadow-emerald-900/30 border border-emerald-400/40">
              <Activity className="w-5 h-5 text-slate-950 font-black stroke-[2.5]" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-950 flex items-center justify-center border border-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  RE:PLAY <span className="text-emerald-400 font-black">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  v2.4 Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Sports Recovery & Comeback Assistant
              </p>
            </div>
          </div>

          {/* Navigation Links based on Role */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                activeTab === 'landing'
                  ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Overview & Loop
            </button>

            {currentRole === 'player' && (
              <>
                <button
                  onClick={() => setActiveTab('player-dashboard')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                    activeTab === 'player-dashboard'
                      ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <HeartPulse className="w-3.5 h-3.5" />
                  Today's Recovery
                </button>

                <button
                  onClick={() => setActiveTab('plan-exercises')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                    activeTab === 'plan-exercises'
                      ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  Plan & Exercises
                </button>

                <button
                  onClick={() => setActiveTab('coach-chat')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                    activeTab === 'coach-chat'
                      ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  RE:PLAY Coach
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                    activeTab === 'analytics'
                      ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  Analytics
                </button>

                <button
                  onClick={() => setActiveTab('return-to-play')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                    activeTab === 'return-to-play'
                      ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Return-to-Play
                </button>
              </>
            )}

            {currentRole === 'professional' && (
              <>
                <button
                  onClick={() => setActiveTab('prof-dashboard')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                    activeTab === 'prof-dashboard'
                      ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Clinician Portal
                </button>

                <button
                  onClick={() => setActiveTab('plan-exercises')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                    activeTab === 'plan-exercises'
                      ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  Plan Builder & Upload
                </button>

                <button
                  onClick={() => setActiveTab('return-to-play')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                    activeTab === 'return-to-play'
                      ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  RTP Assessment
                </button>
              </>
            )}

            {currentRole === 'admin' && (
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                  activeTab === 'admin-dashboard'
                    ? 'text-purple-400 bg-purple-950/40 border border-purple-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Compliance & Admin
              </button>
            )}
          </nav>

          {/* Action Buttons & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentRole === 'player' && (
              <button
                onClick={onOpenCheckin}
                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs transition shadow-md shadow-emerald-950 cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Daily Check-In</span>
              </button>
            )}

            <button
              onClick={onOpenReport}
              title="Generate Downloadable Clinical Report"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Report</span>
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                  {currentRole === 'player' ? 'ATH' : currentRole === 'professional' ? 'PT' : 'ADM'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-[11px] font-bold text-white leading-tight truncate max-w-[110px]">{currentUserName}</p>
                  <p className="text-[9px] text-slate-400 capitalize">{currentRole}</p>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Switch Perspective / User</p>
                    <p className="text-[10px] text-slate-500">Test platform from all clinical & athlete viewpoints</p>
                  </div>

                  <div className="space-y-1">
                    {/* Athlete: Marcus Vance */}
                    <button
                      onClick={() => {
                        onSwitchUser('player-marcus');
                        setActiveTab('player-dashboard');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-center gap-2.5 transition cursor-pointer ${
                        currentUserName.includes('Marcus') ? 'bg-emerald-950/60 border border-emerald-500/40 text-white' : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400">
                        MV
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold truncate">Marcus Vance</p>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-500/30">Athlete</span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">Football • High Ankle Sprain (Phase 2)</p>
                      </div>
                    </button>

                    {/* Professional: Dr. Sarah Jenkins */}
                    <button
                      onClick={() => {
                        onSwitchUser('prof-sarah');
                        setActiveTab('prof-dashboard');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-center gap-2.5 transition cursor-pointer ${
                        currentUserName.includes('Sarah') ? 'bg-cyan-950/60 border border-cyan-500/40 text-white' : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-cyan-900/60 border border-cyan-500/40 flex items-center justify-center text-xs font-bold text-cyan-400">
                        SJ
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold truncate">Dr. Sarah Jenkins, DPT</p>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-900/40 text-cyan-400 border border-cyan-500/30">Physio</span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">Lead Sports Physical Therapist</p>
                      </div>
                    </button>

                    {/* Admin: Rachel Green */}
                    <button
                      onClick={() => {
                        onSwitchUser('admin-rachel');
                        setActiveTab('admin-dashboard');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-center gap-2.5 transition cursor-pointer ${
                        currentUserName.includes('Rachel') ? 'bg-purple-950/60 border border-purple-500/40 text-white' : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-xs font-bold text-purple-400">
                        RG
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold truncate">Rachel Green</p>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-900/40 text-purple-400 border border-purple-500/30">Admin</span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">Clinical Operations & Compliance</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center justify-between overflow-x-auto py-2.5 border-t border-slate-800/80 gap-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('landing')}
            className={`text-xs px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${
              activeTab === 'landing' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
            }`}
          >
            Overview
          </button>
          {currentRole === 'player' && (
            <>
              <button
                onClick={() => setActiveTab('player-dashboard')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${
                  activeTab === 'player-dashboard' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setActiveTab('plan-exercises')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${
                  activeTab === 'plan-exercises' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
                }`}
              >
                Plan
              </button>
              <button
                onClick={() => setActiveTab('coach-chat')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${
                  activeTab === 'coach-chat' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
                }`}
              >
                Coach
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${
                  activeTab === 'analytics' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('return-to-play')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${
                  activeTab === 'return-to-play' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
                }`}
              >
                RTP
              </button>
            </>
          )}

          {currentRole === 'professional' && (
            <>
              <button
                onClick={() => setActiveTab('prof-dashboard')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${
                  activeTab === 'prof-dashboard' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'
                }`}
              >
                Patients
              </button>
              <button
                onClick={() => setActiveTab('plan-exercises')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${
                  activeTab === 'plan-exercises' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'
                }`}
              >
                Plan Builder
              </button>
              <button
                onClick={() => setActiveTab('return-to-play')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${
                  activeTab === 'return-to-play' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'
                }`}
              >
                RTP Gates
              </button>
            </>
          )}

          {currentRole === 'admin' && (
            <button
              onClick={() => setActiveTab('admin-dashboard')}
              className={`text-xs px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${
                activeTab === 'admin-dashboard' ? 'bg-slate-800 text-purple-400' : 'text-slate-400'
              }`}
            >
              System Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
