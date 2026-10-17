import React from 'react';
import {
  X,
  Printer,
  Download,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { DailyCheckin, RecoveryPlan, RecoveryScore } from '../types/index.js';

interface PlayerReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: any;
  plan: RecoveryPlan | null;
  checkins: DailyCheckin[];
  scores: RecoveryScore[];
}

export const PlayerReportModal: React.FC<PlayerReportModalProps> = ({
  isOpen,
  onClose,
  player,
  plan,
  checkins,
  scores,
}) => {
  if (!isOpen) return null;

  const currentPhase = plan?.phases.find((p) => p.status === 'current') || plan?.phases[0];
  const last7 = checkins.slice(-7);
  const avgPain = (last7.reduce((a, b) => a + b.pain, 0) / Math.max(1, last7.length)).toFixed(1);
  const adherence = Math.round((last7.filter((c) => c.exerciseCompletion === 'completed').length / Math.max(1, last7.length)) * 100);
  const latestScore = scores.slice(-1)[0]?.overallScore || 78;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Modal Controls (Hidden in Print) */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Clinical Recovery Progress Report</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div className="p-8 space-y-6 bg-slate-950 text-slate-100 max-h-[80vh] overflow-y-auto print:max-h-none print:p-0 print:bg-white print:text-black">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white print:text-black">
                  RE:PLAY <span className="text-emerald-400 print:text-emerald-700">AI</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 print:bg-slate-200 print:text-black">
                  Clinical Recovery Summary
                </span>
              </div>
              <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                Doctor/Physiotherapist-Guided Rehabilitation Progress Dossier
              </p>
            </div>

            <div className="text-right text-xs font-mono text-slate-400 print:text-slate-600">
              <div>Date Generated: {new Date().toISOString().split('T')[0]}</div>
              <div>Report ID: REP-{Date.now().toString().slice(-6)}</div>
            </div>
          </div>

          {/* Athlete & Physician Meta */}
          <div className="grid grid-cols-2 gap-4 text-xs p-4 rounded-xl bg-slate-900/60 border border-slate-800 print:bg-slate-100 print:border-slate-300">
            <div>
              <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">Athlete Details</span>
              <div className="font-bold text-sm text-white print:text-black">{player?.user?.name || 'Marcus Vance'}</div>
              <div className="text-slate-300 print:text-slate-700">Sport: {player?.profile?.sport || 'Football'} ({player?.profile?.position})</div>
              <div className="text-slate-400 print:text-slate-600">Age: {player?.profile?.age || 24} • Status: Active Rehabilitation</div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">Supervising Clinician</span>
              <div className="font-bold text-sm text-white print:text-black">{plan?.professionalName || 'Dr. Sarah Jenkins, DPT, SCS'}</div>
              <div className="text-slate-300 print:text-slate-700">{plan?.clinicName || 'Apex Sports Physical Therapy'}</div>
              <div className="text-slate-400 print:text-slate-600">Follow-Up Review: {plan?.followUpDate || '2026-10-08'}</div>
            </div>
          </div>

          {/* Current Clinical Status */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Diagnostic Summary & Active Stage
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300 text-xs space-y-1">
              <span className="font-bold text-white print:text-black">{plan?.title}</span>
              <p className="text-slate-300 print:text-slate-700 leading-relaxed">{plan?.diagnosisSummary}</p>
              <div className="pt-2 text-[11px] text-emerald-400 print:text-emerald-700 font-semibold">
                Active Phase: Phase {currentPhase?.number}: {currentPhase?.name} ({currentPhase?.goal})
              </div>
            </div>
          </div>

          {/* 4 Quantitative Biomarkers */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-100 print:border-slate-300">
              <span className="text-[10px] text-slate-500 uppercase block">Current Score</span>
              <span className="text-xl font-black text-emerald-400 print:text-emerald-700 font-mono">{latestScore}/100</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Non-diagnostic</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-100 print:border-slate-300">
              <span className="text-[10px] text-slate-500 uppercase block">7-Day Avg Pain</span>
              <span className="text-xl font-black text-cyan-400 print:text-cyan-700 font-mono">{avgPain}/10</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">VAS scale</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-100 print:border-slate-300">
              <span className="text-[10px] text-slate-500 uppercase block">Adherence</span>
              <span className="text-xl font-black text-teal-400 print:text-teal-700 font-mono">{adherence}%</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Prescribed sets</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-100 print:border-slate-300">
              <span className="text-[10px] text-slate-500 uppercase block">Active Alerts</span>
              <span className="text-xl font-black text-slate-300 print:text-black font-mono">0</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Resolved</span>
            </div>
          </div>

          {/* Restrictions & Warning Signs */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 print:border-slate-300 space-y-1">
              <span className="font-bold text-red-400 print:text-red-700 block">Strict Restrictions:</span>
              <ul className="space-y-1 text-slate-300 print:text-slate-700">
                {plan?.restrictions.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 print:border-slate-300 space-y-1">
              <span className="font-bold text-amber-400 print:text-amber-700 block">Stop Activity Warnings:</span>
              <ul className="space-y-1 text-slate-300 print:text-slate-700">
                {plan?.warningSigns.slice(0, 3).map((w, i) => (
                  <li key={i}>• {w}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mandatory Clinical Disclaimer Footer */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 print:border-slate-400 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400 print:text-amber-800">
              <AlertTriangle className="w-4 h-4" />
              <span>MANDATORY CLINICAL DISCLAIMER</span>
            </div>
            <p className="text-[11px] text-slate-400 print:text-slate-600 leading-relaxed max-w-2xl mx-auto">
              This report is an AI-generated recovery summary based on athlete self-logged telemetry. It does NOT constitute an independent medical diagnosis, clearance for match competition, or a guarantee of complete healing. Formal clinical review by a licensed healthcare professional is required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
