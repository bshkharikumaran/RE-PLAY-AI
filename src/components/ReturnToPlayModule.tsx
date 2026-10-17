import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Clock,
  AlertTriangle,
  UserCheck,
  Calendar,
  FileCheck2,
  FileText
} from 'lucide-react';
import { ReturnToCheckpoint, UserRole } from '../types/index.js';

interface ReturnToPlayModuleProps {
  checkpoints: ReturnToCheckpoint[];
  userRole: UserRole;
  onUpdateCheckpointStatus?: (id: string, status: ReturnToCheckpoint['status'], notes?: string) => Promise<void>;
  onScheduleAssessment?: () => void;
}

export const ReturnToPlayModule: React.FC<ReturnToPlayModuleProps> = ({
  checkpoints,
  userRole,
  onUpdateCheckpointStatus,
  onScheduleAssessment,
}) => {
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<ReturnToCheckpoint | null>(null);
  const [professionalNotes, setProfessionalNotes] = useState<string>('');

  const passedCount = checkpoints.filter((c) => c.status === 'passed').length;
  const inProgressCount = checkpoints.filter((c) => c.status === 'in_progress').length;
  const totalCount = checkpoints.length;
  const completionPercentage = Math.round((passedCount / Math.max(1, totalCount)) * 100);

  const handleStatusChange = async (id: string, status: ReturnToCheckpoint['status']) => {
    if (!onUpdateCheckpointStatus) return;
    await onUpdateCheckpointStatus(id, status, professionalNotes);
    setSelectedCheckpoint(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Assessment Mandate */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
                Phase 5 Milestone Gate
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40">
                Professional Sign-Off Gated
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
              Return-to-Play Readiness Assessment
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Objective physical criteria and sport-specific testing required before match play authorization.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400">Gate Progress:</span>
              <span className="text-xl font-black text-amber-400 ml-2 font-mono">
                {passedCount} / {totalCount} Passed
              </span>
            </div>
          </div>
        </div>

        {/* Clinical Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="font-bold text-white block">
              Mandatory Multi-Disciplinary Clearance Policy:
            </span>
            <p className="text-slate-300 leading-relaxed">
              RE:PLAY AI never claims an athlete is medically cleared without verified professional sign-off. When physical checkpoints are fulfilled, you must schedule an in-person clinical assessment with your doctor/physiotherapist.
            </p>
          </div>
        </div>
      </div>

      {/* Checkpoints List */}
      <div className="space-y-3">
        {checkpoints.map((cp) => {
          const isPassed = cp.status === 'passed';
          const isInProgress = cp.status === 'in_progress';
          const isPending = cp.status === 'pending_review';

          return (
            <div
              key={cp.id}
              className={`p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isPassed
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : isInProgress
                  ? 'bg-cyan-950/20 border-cyan-500/30'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{cp.criterion}</h4>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      isPassed
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                        : isInProgress
                        ? 'bg-cyan-950 text-cyan-400 border-cyan-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {cp.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{cp.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                  <span>Current Metric: <strong className="text-white">{cp.currentMetric}</strong></span>
                  <span>Target: <strong className="text-emerald-400">{cp.targetThreshold}</strong></span>
                  {cp.lastEvaluated && <span>Evaluated: {cp.lastEvaluated}</span>}
                </div>

                {cp.professionalNotes && (
                  <p className="text-[11px] text-cyan-300 font-medium italic pt-1">
                    Physio Note: "{cp.professionalNotes}"
                  </p>
                )}
              </div>

              {/* Action / Evaluation Column */}
              <div className="flex items-center gap-2">
                {userRole === 'professional' ? (
                  <button
                    onClick={() => setSelectedCheckpoint(cp)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition cursor-pointer"
                  >
                    Update Status
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    {isPassed ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Clinician Approved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Physio Assessment Required
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Clinician Status Evaluation Modal */}
      {selectedCheckpoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Evaluate Checkpoint</h3>
              <button
                onClick={() => setSelectedCheckpoint(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase">Criterion:</h4>
              <p className="text-sm font-bold text-white">{selectedCheckpoint.criterion}</p>
              <p className="text-xs text-slate-400 mt-1">{selectedCheckpoint.description}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase">Clinician Notes:</label>
              <textarea
                value={professionalNotes}
                onChange={(e) => setProfessionalNotes(e.target.value)}
                placeholder="Document clinical observations, dynamometry, or functional tests..."
                rows={3}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                onClick={() => handleStatusChange(selectedCheckpoint.id, 'in_progress')}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                In Progress
              </button>
              <button
                onClick={() => handleStatusChange(selectedCheckpoint.id, 'pending_review')}
                className="py-2 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-500/40 font-bold text-xs"
              >
                Needs Review
              </button>
              <button
                onClick={() => handleStatusChange(selectedCheckpoint.id, 'passed')}
                className="py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow"
              >
                Authorize Passed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
