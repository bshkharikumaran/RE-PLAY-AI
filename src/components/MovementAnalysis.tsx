import React, { useState, useEffect } from 'react';
import {
  Camera,
  Activity,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Info,
  ShieldAlert,
  Compass
} from 'lucide-react';

interface MovementAnalysisProps {
  exerciseName: string;
  onClose: () => void;
}

export const MovementAnalysis: React.FC<MovementAnalysisProps> = ({ exerciseName, onClose }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentAngle, setCurrentAngle] = useState<number>(18);
  const [symmetryIndex, setSymmetryIndex] = useState<number>(88);
  const [repCount, setRepCount] = useState<number>(0);
  const [feedbackCue, setFeedbackCue] = useState<string>('Align ankle directly beneath knee.');
  const [stabilityScore, setStabilityScore] = useState<number>(92);

  // Simulated live computer vision tracking loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        // fluctuate angle realistically
        setCurrentAngle((prev) => {
          const next = prev + (Math.random() * 6 - 2.8);
          return Math.max(10, Math.min(35, Math.round(next * 10) / 10));
        });

        setStabilityScore((prev) => {
          const change = Math.round(Math.random() * 4 - 2);
          return Math.min(99, Math.max(78, prev + change));
        });

        // random rep increment
        if (Math.random() > 0.7) {
          setRepCount((c) => c + 1);
        }

        const cues = [
          'Good neutral alignment. Keep foot planted evenly.',
          'Dorsiflexion angle reaching 22° target range.',
          'Avoid inward knee collapse (valgus).',
          'Smooth cadence maintained. Do not force end-range.',
          'Weight distributed across tripod of the foot.',
        ];
        setFeedbackCue(cues[Math.floor(Math.random() * cues.length)]);
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Disclaimer Banner */}
        <div className="bg-amber-950/70 border-b border-amber-600/30 px-4 py-2 flex items-center gap-2 text-xs text-amber-300">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
          <span className="font-semibold">
            Assistive Clinical Feature: AI movement analysis does not replace professional physical therapy assessment.
          </span>
        </div>

        {/* Viewport Content */}
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">
                Assistive Biomechanical Tracking
              </span>
              <h3 className="text-lg font-bold text-white">{exerciseName}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* Simulated Camera Feed Viewport */}
          <div className="relative w-full h-72 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
            {/* Visual Grid & Skeleton Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

            {/* Target Reticle / Joint Tracking Simulation */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-cyan-400/60 animate-pulse flex items-center justify-center relative">
                <div className="w-4 h-4 rounded-full bg-emerald-400/80 shadow-lg shadow-emerald-400"></div>
                <div className="absolute top-1 right-2 text-[10px] font-mono font-bold text-cyan-400 bg-slate-900/90 px-1.5 rounded">
                  θ: {currentAngle}°
                </div>
              </div>
              <div className="w-0.5 h-16 bg-gradient-to-b from-cyan-400 to-emerald-400"></div>
              <div className="w-20 h-4 rounded-full border border-emerald-400/80 bg-emerald-950/40"></div>
            </div>

            {/* Corner HUD Data */}
            <div className="absolute top-3 left-3 p-2 rounded-lg bg-slate-900/85 border border-slate-800 text-[11px] font-mono space-y-0.5 text-slate-300">
              <div>STATUS: <span className={isActive ? 'text-emerald-400 font-bold' : 'text-slate-500 font-bold'}>{isActive ? 'LIVE TRACKING' : 'IDLE / PAUSED'}</span></div>
              <div>ROM ANGLE: <span className="text-cyan-400 font-bold">{currentAngle}°</span></div>
              <div>STABILITY: <span className="text-teal-400 font-bold">{stabilityScore}%</span></div>
            </div>

            <div className="absolute top-3 right-3 p-2 rounded-lg bg-slate-900/85 border border-slate-800 text-[11px] font-mono space-y-0.5 text-slate-300 text-right">
              <div>REPS: <span className="text-white font-black text-sm">{repCount}</span></div>
              <div>SYMMETRY: <span className="text-emerald-400 font-bold">{symmetryIndex}%</span></div>
            </div>

            {/* Bottom Real-time Feedback Overlay */}
            <div className="absolute bottom-3 inset-x-3 p-2.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-center">
              <span className="text-xs font-semibold text-emerald-300 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {feedbackCue}
              </span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setRepCount(0);
                setCurrentAngle(18);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Counters</span>
            </button>

            <button
              onClick={() => setIsActive(!isActive)}
              className={`px-6 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 cursor-pointer shadow-lg ${
                isActive
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-950'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Tracking</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Live Form Check</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
