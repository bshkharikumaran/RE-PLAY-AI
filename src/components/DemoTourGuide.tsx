import React, { useState } from 'react';
import {
  X,
  Play,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  UserCheck,
  Activity,
  ShieldAlert,
  ClipboardCheck,
  Compass
} from 'lucide-react';

interface DemoTourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateStep: (tab: string, triggerAction?: string) => void;
}

const TOUR_STEPS = [
  {
    stepNumber: 1,
    title: 'Athlete Profile & Injury Context',
    roleTarget: 'player-marcus',
    targetTab: 'player-dashboard',
    highlight: 'Marcus Vance — Right High Ankle Sprain (Football Midfielder)',
    description: 'Explore Marcus Vance’s daily dashboard with his transparent 78/100 Recovery Score and active Phase 2 rehabilitation program supervised by Dr. Sarah Jenkins.',
    actionLabel: 'Go to Today’s Dashboard',
  },
  {
    stepNumber: 2,
    title: 'Medical Plan Upload & AI Extraction',
    roleTarget: 'player-marcus',
    targetTab: 'plan-exercises',
    highlight: 'Upload Professional Recovery Plan (OCR + Document Parsing)',
    description: 'See the structured phases extracted from the clinician’s discharge note. Notice strict restrictions: "Avoid running for 4 weeks; no forced dorsiflexion."',
    actionLabel: 'Inspect Active Plan & Timeline',
  },
  {
    stepNumber: 3,
    title: 'Daily Check-In & Smart Safety Check',
    roleTarget: 'player-marcus',
    targetTab: 'player-dashboard',
    triggerAction: 'open_checkin',
    highlight: 'Symptom logging + Real-Time Safety Engine',
    description: 'Try submitting a check-in with pain=3 (normal) or pain=8 (triggers immediate clinical warning modal with direct doctor/911 actions).',
    actionLabel: 'Open Daily Check-In Form',
  },
  {
    stepNumber: 4,
    title: 'RE:PLAY Coach (RAG Grounding & Safety)',
    roleTarget: 'player-marcus',
    targetTab: 'coach-chat',
    highlight: 'Conversational Assistant Grounded in Doctor’s Plan',
    description: 'Ask: "Can I play football this weekend?" Watch the AI cite Marcus’s Phase 2 restrictions and explain that only Dr. Jenkins can clear match play.',
    actionLabel: 'Talk with RE:PLAY Coach',
  },
  {
    stepNumber: 5,
    title: 'Prescribed Exercises & Live Form Check',
    roleTarget: 'player-marcus',
    targetTab: 'plan-exercises',
    highlight: 'Morning/Evening sessions, Timers, and AI Vision',
    description: 'Start an exercise session with interactive countdown timer. Test the AI Form Check camera simulator to measure joint angles and stability sway.',
    actionLabel: 'View Prescribed Exercises',
  },
  {
    stepNumber: 6,
    title: 'Recovery Progress Analytics',
    roleTarget: 'player-marcus',
    targetTab: 'analytics',
    highlight: 'Pain trajectory, Adherence, Sleep, and Recovery Score',
    description: 'Analyze the 7-day vs 30-day SVG healing curves demonstrating a steady pain drop from 6.0 down to 2.8 with 85% exercise adherence.',
    actionLabel: 'View Analytics Dashboard',
  },
  {
    stepNumber: 7,
    title: 'Return-to-Play Gated Milestones',
    roleTarget: 'player-marcus',
    targetTab: 'return-to-play',
    highlight: 'Objective criteria requiring in-person doctor assessment',
    description: 'Review physical checkpoints (ROM symmetry, single-leg balance > 30s) and note the mandatory clinician gate before clearance.',
    actionLabel: 'Check Return-to-Play Gates',
  },
  {
    stepNumber: 8,
    title: 'Doctor Portal & Partitioned AI Clinical Summary',
    roleTarget: 'prof-sarah',
    targetTab: 'prof-dashboard',
    highlight: 'Observed Data vs AI Interpretation vs Professional Decision',
    description: 'Switch to Dr. Sarah Jenkins’ viewpoint. Review patient triage, active alerts, and click "Authorize Next Phase Progression" to unlock Phase 3.',
    actionLabel: 'Open Clinician Portal',
  },
];

export const DemoTourGuide: React.FC<DemoTourGuideProps> = ({
  isOpen,
  onClose,
  onNavigateStep,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      onNavigateStep(TOUR_STEPS[nextIdx].targetTab, TOUR_STEPS[nextIdx].triggerAction);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      onNavigateStep(TOUR_STEPS[prevIdx].targetTab, TOUR_STEPS[prevIdx].triggerAction);
    }
  };

  const handleExecuteAction = () => {
    onNavigateStep(currentStep.targetTab, currentStep.triggerAction);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-slate-900/95 border border-emerald-500/50 rounded-2xl shadow-2xl backdrop-blur-xl p-5 space-y-4 animate-in slide-in-from-bottom-5">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
              Guided Product Loop Tour
            </span>
            <h4 className="text-xs font-black text-white">
              Step {currentStep.stepNumber} of {TOUR_STEPS.length}: {currentStep.title}
            </h4>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Step Content */}
      <div className="space-y-2 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-cyan-300 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>{currentStep.highlight}</span>
        </div>

        <p className="text-slate-300 leading-relaxed">
          {currentStep.description}
        </p>
      </div>

      {/* Direct Action Trigger */}
      <button
        onClick={handleExecuteAction}
        className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Play className="w-3 h-3" />
        <span>{currentStep.actionLabel}</span>
      </button>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
        <button
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        {/* Step dots */}
        <div className="flex items-center gap-1">
          {TOUR_STEPS.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                currentStepIndex === i ? 'w-4 bg-emerald-400' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold transition flex items-center gap-1 cursor-pointer"
        >
          <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
