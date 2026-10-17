import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  AlertTriangle,
  Users,
  Activity,
  CheckCircle2,
  Calendar,
  FileText,
  Clock,
  Sparkles,
  Search,
  ArrowRight,
  ShieldAlert,
  Send,
  Unlock,
  ChevronRight,
  PhoneCall
} from 'lucide-react';
import { DailyCheckin, RecoveryPlan, SafetyAlert, User } from '../types/index.js';

interface ProfessionalDashboardProps {
  onSelectPlayer: (playerId: string) => void;
  onApprovePhase: (planId: string, phaseNumber: number) => Promise<void>;
  onResolveAlert: (alertId: string, note: string) => Promise<void>;
}

export const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({
  onSelectPlayer,
  onApprovePhase,
  onResolveAlert,
}) => {
  const [players, setPlayers] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlayerDetail, setSelectedPlayerDetail] = useState<any | null>(null);
  const [aiSummary, setAiSummary] = useState<any | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);
  const [newClinicalNote, setNewClinicalNote] = useState<string>('');
  const [noteVisibility, setNoteVisibility] = useState<'shared_with_player' | 'internal_clinical'>('shared_with_player');

  useEffect(() => {
    fetchPlayers();
    fetchAlerts();
  }, []);

  const fetchPlayers = async () => {
    try {
      const res = await fetch('/api/players');
      const data = await res.json();
      setPlayers(data);
      if (data.length > 0) {
        loadPlayerDetail(data[0].user.id);
      }
    } catch (err) {
      console.error('Error fetching players:', err);
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  const loadPlayerDetail = async (id: string) => {
    try {
      const res = await fetch(`/api/players/${id}`);
      const data = await res.json();
      setSelectedPlayerDetail(data);

      // Load AI Daily Clinical Summary
      setIsLoadingSummary(true);
      const sumRes = await fetch(`/api/professional/summary/${id}`);
      const sumData = await sumRes.json();
      setAiSummary(sumData);
    } catch (err) {
      console.error('Failed to load player details:', err);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerDetail || !newClinicalNote.trim()) return;

    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: selectedPlayerDetail.user.id,
          note: newClinicalNote,
          visibility: noteVisibility,
        }),
      });
      setNewClinicalNote('');
      loadPlayerDetail(selectedPlayerDetail.user.id);
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

  const filteredPlayers = players.filter((p) =>
    p.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.injury?.injuryType || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeAlerts = alerts.filter((a) => a.status === 'active');

  return (
    <div className="space-y-6">
      {/* Clinician Portal Header */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-cyan-400">
                Supervising Physical Therapist Portal
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                Dr. Sarah Jenkins, DPT, SCS
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              Athlete Recovery Triage & Clinical Decision Support
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Apex Sports & Orthopedic Clinic</span>
          </div>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="glass-card p-3.5 rounded-xl border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Active Athletes</span>
            <div className="text-2xl font-black text-white font-mono mt-1">24</div>
            <span className="text-[10px] text-slate-500">Under active rehab</span>
          </div>

          <div className="glass-card p-3.5 rounded-xl border-slate-800">
            <span className="text-[10px] font-bold text-amber-400 uppercase">Needing Review</span>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1">5</div>
            <span className="text-[10px] text-slate-500">Phase review or symptom change</span>
          </div>

          <div className="glass-card p-3.5 rounded-xl border-slate-800">
            <span className="text-[10px] font-bold text-rose-400 uppercase">New Safety Alerts</span>
            <div className="text-2xl font-black text-rose-400 font-mono mt-1">{activeAlerts.length}</div>
            <span className="text-[10px] text-rose-400 font-semibold">Immediate triage flag</span>
          </div>

          <div className="glass-card p-3.5 rounded-xl border-slate-800">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Average Adherence</span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">84%</div>
            <span className="text-[10px] text-slate-500">Last 7 days cohort</span>
          </div>

          <div className="glass-card p-3.5 rounded-xl border-slate-800">
            <span className="text-[10px] font-bold text-cyan-400 uppercase">Active Plans</span>
            <div className="text-2xl font-black text-cyan-400 font-mono mt-1">19</div>
            <span className="text-[10px] text-slate-500">Clinician verified</span>
          </div>
        </div>
      </div>

      {/* Main Split View: Player Table & Detailed Patient Decision Pane */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Patient List / Triage Table */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-4 rounded-2xl border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" /> Patient Roster
              </h3>
              <span className="text-xs text-slate-400">{filteredPlayers.length} total</span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search athlete name, injury..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Table Rows */}
            <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
              {filteredPlayers.map((p) => {
                const isSelected = selectedPlayerDetail?.user.id === p.user.id;
                const hasAlerts = p.activeAlertsCount > 0;

                return (
                  <div
                    key={p.user.id}
                    onClick={() => loadPlayerDetail(p.user.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-500 text-white'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
                          {p.user.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white leading-tight">{p.user.name}</h4>
                          <span className="text-[10px] text-slate-400">
                            {p.profile?.sport || 'Football'} • Phase {p.currentPhase}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-emerald-400 block">
                          {p.latestScore}/100
                        </span>
                        <span className="text-[9px] text-slate-500 uppercase">{p.readinessLevel}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                      <span className="truncate max-w-[180px]">{p.injury?.injuryType || 'Rehab Protocol'}</span>
                      {hasAlerts ? (
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/40 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Alert
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">All clear</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Selected Patient Clinical Review Drawer */}
        <div className="lg:col-span-7 space-y-4">
          {selectedPlayerDetail ? (
            <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-white">{selectedPlayerDetail.user.name}</h2>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      Phase {selectedPlayerDetail.injury?.currentPhase || 2}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedPlayerDetail.injury?.injuryType} • {selectedPlayerDetail.profile?.sport} ({selectedPlayerDetail.profile?.position})
                  </p>
                </div>

                {/* Phase Progression Approval Button */}
                {selectedPlayerDetail.plan && (
                  <button
                    onClick={() => {
                      const nextPhase = (selectedPlayerDetail.injury?.currentPhase || 1) + 1;
                      onApprovePhase(selectedPlayerDetail.plan.id, nextPhase);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-cyan-950 cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Authorize Next Phase Progression</span>
                  </button>
                )}
              </div>

              {/* CRUCIAL REQUIREMENT: AI DAILY SUMMARY */}
              {/* Strictly separating: 1. Observed Data | 2. AI Interpretation | 3. Professional Decision Required */}
              <div className="space-y-3 p-5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">
                      AI Daily Clinical Synthesis (Partitioned)
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Decision-Support Only
                  </span>
                </div>

                {isLoadingSummary ? (
                  <div className="py-6 text-center text-xs text-slate-400 space-y-2">
                    <Sparkles className="w-5 h-5 text-cyan-400 animate-spin mx-auto" />
                    <p>Generating structured clinical partition...</p>
                  </div>
                ) : aiSummary ? (
                  <div className="space-y-4 pt-1">
                    {/* SECTION 1: Observed Data */}
                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 1. Observed Objective Data (Factual Logs)
                      </span>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {aiSummary.observedData.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-400">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* SECTION 2: AI Interpretation */}
                    <div className="p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-900/40 space-y-1.5">
                      <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> 2. AI Biomechanical Interpretation (Signal Trends)
                      </span>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {aiSummary.aiInterpretation.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-cyan-400">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* SECTION 3: Professional Decision Required */}
                    <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-900/40 space-y-1.5">
                      <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5" /> 3. Professional Decision Required (Doctor/Physio Authority)
                      </span>
                      <ul className="space-y-1 text-xs text-slate-200">
                        {aiSummary.professionalDecisionRequired.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Active Clinical Alerts Triage for this athlete */}
              {selectedPlayerDetail.alerts?.filter((a: SafetyAlert) => a.status === 'active').length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    Active Safety Alerts Requiring Clinician Review
                  </h4>
                  <div className="space-y-2">
                    {selectedPlayerDetail.alerts
                      .filter((a: SafetyAlert) => a.status === 'active')
                      .map((alert: SafetyAlert) => (
                        <div
                          key={alert.id}
                          className="p-3 rounded-xl bg-rose-950/30 border border-rose-600/40 text-xs flex items-center justify-between gap-3"
                        >
                          <div>
                            <span className="font-bold text-white block">{alert.type}</span>
                            <p className="text-slate-300 text-[11px]">{alert.message}</p>
                          </div>
                          <button
                            onClick={() => onResolveAlert(alert.id, 'Reviewed by Dr. Jenkins. Guidance provided.')}
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold whitespace-nowrap cursor-pointer"
                          >
                            Resolve Alert
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Add Clinical Note Form */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Document Clinical Note
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setNoteVisibility('shared_with_player')}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border transition cursor-pointer ${
                        noteVisibility === 'shared_with_player'
                          ? 'bg-cyan-950 text-cyan-400 border-cyan-500'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      Visible to Athlete
                    </button>
                    <button
                      type="button"
                      onClick={() => setNoteVisibility('internal_clinical')}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border transition cursor-pointer ${
                        noteVisibility === 'internal_clinical'
                          ? 'bg-purple-950 text-purple-400 border-purple-500'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      Internal Only
                    </button>
                  </div>
                </div>

                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    rows={2}
                    value={newClinicalNote}
                    onChange={(e) => setNewClinicalNote(e.target.value)}
                    placeholder="Enter rehabilitation instructions or clinic notes..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newClinicalNote.trim()}
                      className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Clinical Note</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl border-slate-800 text-center text-xs text-slate-400">
              Select an athlete from the roster to review recovery telemetry and authorize clinical decisions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
