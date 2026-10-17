import React, { useState } from 'react';
import {
  ClipboardCheck,
  ShieldAlert,
  AlertTriangle,
  Upload,
  Lock,
  Unlock,
  CheckCircle2,
  Calendar,
  Activity,
  Droplets,
  Apple,
  FileText,
  UserCheck,
  ArrowRight
} from 'lucide-react';
import { RecoveryPlan, UserRole } from '../types/index.js';

interface RecoveryPlanViewProps {
  plan: RecoveryPlan | null;
  onOpenUploadModal: () => void;
  userRole: UserRole;
  onApprovePhaseProgression?: (targetPhase: number) => void;
}

export const RecoveryPlanView: React.FC<RecoveryPlanViewProps> = ({
  plan,
  onOpenUploadModal,
  userRole,
  onApprovePhaseProgression,
}) => {
  const [selectedPhaseNumber, setSelectedPhaseNumber] = useState<number>(2);

  if (!plan) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center space-y-4 border-slate-800">
        <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">No Active Recovery Plan</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Upload your physical therapy or orthopedic doctor’s discharge instructions to initialize your structured recovery protocol.
        </p>
        <button
          onClick={onOpenUploadModal}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition inline-flex items-center gap-2 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Professional Plan</span>
        </button>
      </div>
    );
  }

  const currentPhase = plan.phases.find((p) => p.status === 'current') || plan.phases[0];
  const activeDetailPhase = plan.phases.find((p) => p.number === selectedPhaseNumber) || currentPhase;

  return (
    <div className="space-y-6">
      {/* Active Plan Header Card */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
                Active Verified Protocol
              </span>
              <span className="text-xs text-slate-400">ID: {plan.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {plan.title}
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {plan.diagnosisSummary}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenUploadModal}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Upload / Update Plan</span>
            </button>
          </div>
        </div>

        {/* Clinician Meta Info */}
        <div className="grid sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-1">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">Prescribing Clinician</span>
            <span className="font-bold text-white block">{plan.professionalName}</span>
            <span className="text-[11px] text-slate-400">{plan.clinicName}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">Timeline & Review</span>
            <span className="font-bold text-white block">Follow-Up: {plan.followUpDate}</span>
            <span className="text-[11px] text-slate-400">Active since {plan.startDate}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">Verification Status</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Clinician Confirmed
            </span>
            <span className="text-[11px] text-slate-400">Verified by {plan.confirmedBy || plan.professionalName}</span>
          </div>
        </div>
      </div>

      {/* VISUAL RECOVERY TIMELINE (PHASE 1 to PHASE 5) */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              Rehabilitation Progression
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">Recovery Phase Timeline</h2>
          </div>
          <span className="text-xs text-slate-400">
            Current: <strong className="text-emerald-400">Phase {currentPhase.number}</strong>
          </span>
        </div>

        {/* Visual Step Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {plan.phases.map((p) => {
            const isSelected = p.number === selectedPhaseNumber;
            const isCompleted = p.status === 'completed';
            const isCurrent = p.status === 'current';
            const isLocked = p.status === 'locked';

            return (
              <div
                key={p.id}
                onClick={() => setSelectedPhaseNumber(p.number)}
                className={`p-3.5 rounded-xl border transition cursor-pointer relative flex flex-col justify-between min-h-[110px] ${
                  isSelected
                    ? 'ring-2 ring-emerald-400 bg-slate-800/90 border-transparent shadow-lg'
                    : isCurrent
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                    : isCompleted
                    ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isCurrent ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    Phase {p.number}
                  </span>

                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {isCurrent && <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />}
                  {isLocked && <Lock className="w-3.5 h-3.5 text-slate-500" />}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                  <span className={`text-[10px] font-semibold uppercase mt-0.5 block ${
                    isCurrent ? 'text-emerald-400' : isCompleted ? 'text-teal-400' : 'text-slate-500'
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Phase Deep Details Card */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4 mt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">
                  Phase {activeDetailPhase.number}: {activeDetailPhase.name}
                </span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                  activeDetailPhase.status === 'current'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : activeDetailPhase.status === 'completed'
                    ? 'bg-teal-500/20 text-teal-400 border-teal-500/40'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}>
                  {activeDetailPhase.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{activeDetailPhase.goal}</p>
            </div>

            {/* Doctor Phase Progression Controls */}
            {userRole === 'professional' && activeDetailPhase.status === 'locked' && onApprovePhaseProgression && (
              <button
                onClick={() => onApprovePhaseProgression(activeDetailPhase.number)}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Approve Athlete for Phase {activeDetailPhase.number}</span>
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Allowed Activities */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Permitted & Approved Activities
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {activeDetailPhase.allowedActivities.map((act, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Avoided Activities / Strict Restrictions */}
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Strictly Avoided / Prohibited Actions
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {activeDetailPhase.avoidActivities.map((act, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* GENERAL RESTRICTIONS, NUTRITION & CLINICAL WARNING SIGNS */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Global Restrictions */}
        <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-red-400">
            <ShieldAlert className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Overall Restrictions</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {plan.restrictions.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Nutrition & Hydration Guidelines */}
        <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-teal-400">
            <Droplets className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Tissue Healing Nutrition</h3>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px]">
              <strong className="text-white block">Hydration Target:</strong>
              {plan.hydrationGuidelines}
            </div>
            <ul className="space-y-1 text-xs">
              {plan.nutritionInstructions.map((n, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-teal-400">•</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Warning Signs from Doctor */}
        <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Stop & Report Triggers</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            If any of the following occur, discontinue exercises immediately:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {plan.warningSigns.map((w, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
