import React from 'react';
import {
  Activity,
  ShieldCheck,
  CheckCircle,
  Moon,
  Droplets,
  Zap,
  TrendingUp,
  AlertCircle,
  Info
} from 'lucide-react';
import { RecoveryScore } from '../types/index.js';

interface RecoveryScoreGaugeProps {
  score: RecoveryScore | null;
  onOpenCheckin: () => void;
}

export const RecoveryScoreGauge: React.FC<RecoveryScoreGaugeProps> = ({ score, onOpenCheckin }) => {
  const currentScore = score?.overallScore ?? 78;
  const adherence = score?.adherenceScore ?? 85;
  const sleep = score?.sleepScore ?? 80;
  const painTrend = score?.painTrendScore ?? 72;
  const mobility = score?.mobilityScore ?? 75;
  const hydration = score?.hydrationScore ?? 82;
  const consistency = score?.consistencyScore ?? 88;
  const readiness = score?.readinessLevel ?? 'Moderate';
  const advice = score?.readinessAdvice ?? "Today's recovery indicators suggest maintaining your current professional-approved activity level. Return-to-play decisions must be confirmed by your healthcare professional.";

  // Calculate circular stroke values
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  const getReadinessBadge = (level: string) => {
    switch (level) {
      case 'Optimal':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Moderate':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      default:
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              Biometric & Activity Synthesis
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              Non-Diagnostic
            </span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
            Daily Recovery & Readiness
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getReadinessBadge(readiness)}`}>
            Readiness: {readiness}
          </span>
          <button
            onClick={onOpenCheckin}
            className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
          >
            Update Check-In
          </button>
        </div>
      </div>

      {/* Main Gauge + Explanation */}
      <div className="grid md:grid-cols-12 gap-6 items-center">
        {/* Left Gauge Ring */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <div className="relative flex items-center justify-center">
            <svg className="w-40 h-40 transform -rotate-90">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-800"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress Value */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-emerald-400 transition-all duration-1000 ease-out"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-white tracking-tight">{currentScore}</span>
              <span className="text-[11px] font-bold text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="text-center mt-3 space-y-1">
            <h3 className="text-sm font-extrabold text-white">
              Recovery Progress Score: {currentScore}/100
            </h3>
            <p className="text-[11px] text-slate-400 max-w-[220px] leading-relaxed">
              This score reflects your logged recovery activities and trends. It is not a medical assessment.
            </p>
          </div>
        </div>

        {/* Right Breakdown: 6 Signals */}
        <div className="md:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>6-Signal Activity Breakdown</span>
            <span className="text-[11px] text-slate-500 font-normal">Updated today</span>
          </div>

          <div className="space-y-2.5">
            {/* Adherence */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Prescribed Exercise Adherence
                </span>
                <span className="font-mono font-bold text-emerald-400">{adherence}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-700" style={{ width: `${adherence}%` }}></div>
              </div>
            </div>

            {/* Sleep */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <Moon className="w-3.5 h-3.5 text-cyan-400" /> Sleep Duration & Quality
                </span>
                <span className="font-mono font-bold text-cyan-400">{sleep}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full transition-all duration-700" style={{ width: `${sleep}%` }}></div>
              </div>
            </div>

            {/* Pain Trend */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <Activity className="w-3.5 h-3.5 text-teal-400" /> Pain Trend (Trajectory)
                </span>
                <span className="font-mono font-bold text-teal-400">{painTrend}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-400 h-full rounded-full transition-all duration-700" style={{ width: `${painTrend}%` }}></div>
              </div>
            </div>

            {/* Mobility */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> Joint Mobility Sensation
                </span>
                <span className="font-mono font-bold text-indigo-400">{mobility}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-400 h-full rounded-full transition-all duration-700" style={{ width: `${mobility}%` }}></div>
              </div>
            </div>

            {/* Hydration */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" /> Daily Hydration Target
                </span>
                <span className="font-mono font-bold text-blue-400">{hydration}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full rounded-full transition-all duration-700" style={{ width: `${hydration}%` }}></div>
              </div>
            </div>

            {/* Recovery Consistency */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <Zap className="w-3.5 h-3.5 text-purple-400" /> Logging & Protocol Consistency
                </span>
                <span className="font-mono font-bold text-purple-400">{consistency}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full transition-all duration-700" style={{ width: `${consistency}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Readiness Guidance Box */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <span className="font-bold text-white block">Clinical Readiness Status:</span>
          <p className="text-slate-300 leading-relaxed font-medium">
            "{advice}"
          </p>
        </div>
      </div>
    </div>
  );
};
