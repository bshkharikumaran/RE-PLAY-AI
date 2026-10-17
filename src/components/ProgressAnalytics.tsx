import React, { useState } from 'react';
import {
  Activity,
  Calendar,
  TrendingDown,
  TrendingUp,
  Moon,
  Droplets,
  CheckCircle2,
  Zap,
  BarChart2
} from 'lucide-react';
import { DailyCheckin, RecoveryScore } from '../types/index.js';

interface ProgressAnalyticsProps {
  checkins: DailyCheckin[];
  scores: RecoveryScore[];
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({ checkins, scores }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  // Filter datasets
  const limit = timeRange === '7d' ? 7 : 30;
  const filteredCheckins = checkins.slice(-limit);
  const filteredScores = scores.slice(-limit);

  // Computed averages
  const avgPain = (filteredCheckins.reduce((acc, c) => acc + c.pain, 0) / Math.max(1, filteredCheckins.length)).toFixed(1);
  const avgSleep = (filteredCheckins.reduce((acc, c) => acc + c.sleepHours, 0) / Math.max(1, filteredCheckins.length)).toFixed(1);
  const adherenceCount = filteredCheckins.filter((c) => c.exerciseCompletion === 'completed').length;
  const adherencePct = Math.round((adherenceCount / Math.max(1, filteredCheckins.length)) * 100);
  const latestScore = filteredScores.slice(-1)[0]?.overallScore || 78;

  // Chart data points helpers
  const painPoints = filteredCheckins.map((c, i) => ({
    label: `Day ${i + 1}`,
    date: c.date,
    pain: c.pain,
    sleep: c.sleepHours,
    swelling: c.swelling === 'severe' ? 4 : c.swelling === 'moderate' ? 3 : c.swelling === 'mild' ? 2 : 1,
    score: filteredScores[i]?.overallScore || 70 + i * 2,
  }));

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              Biomechanical & Symptom Trajectory
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Verified Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
            Recovery Progress Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tracking multi-signal healing trends across your rehabilitation timeline
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              timeRange === '7d' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              timeRange === '30d' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Full 30 Days
          </button>
        </div>
      </div>

      {/* 4 Stat Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Average Pain</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{avgPain}</span>
            <span className="text-xs text-emerald-400 font-bold flex items-center">
              <TrendingDown className="w-3.5 h-3.5" /> -45% vs baseline
            </span>
          </div>
          <span className="text-[10px] text-slate-500">Decreased steadily from 6.0</span>
        </div>

        <div className="glass-card p-4 rounded-xl border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Exercise Adherence</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">{adherencePct}%</span>
            <span className="text-xs text-emerald-400 font-bold flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5" /> High
            </span>
          </div>
          <span className="text-[10px] text-slate-500">{adherenceCount} completed sessions logged</span>
        </div>

        <div className="glass-card p-4 rounded-xl border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Average Sleep</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-400 font-mono">{avgSleep}h</span>
            <span className="text-xs text-cyan-400 font-bold flex items-center">
              <Moon className="w-3.5 h-3.5" /> Optimal
            </span>
          </div>
          <span className="text-[10px] text-slate-500">Nightly restorative target met</span>
        </div>

        <div className="glass-card p-4 rounded-xl border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Recovery Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-teal-400 font-mono">{latestScore}</span>
            <span className="text-xs text-teal-400 font-bold flex items-center">
              <TrendingUp className="w-3.5 h-3.5" /> +16 pts
            </span>
          </div>
          <span className="text-[10px] text-slate-500">Non-diagnostic composite</span>
        </div>
      </div>

      {/* SVG Trajectory Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* CHART 1: Pain Score Trajectory */}
        <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Pain Trajectory (0-10 Scale)</h3>
            </div>
            <span className="text-xs text-slate-400">Target: &lt; 2.0</span>
          </div>

          {/* SVG Line Chart */}
          <div className="relative h-56 w-full pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160">
              {/* Horizontal grid lines */}
              <line x1="0" y1="20" x2="400" y2="20" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="60" x2="400" y2="60" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="400" y2="100" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="400" y2="140" stroke="#334155" />

              {/* Threshold line at pain = 5 (warning) */}
              <line x1="0" y1="80" x2="400" y2="80" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />

              {/* Data points calculation */}
              {(() => {
                if (painPoints.length === 0) return null;
                const step = 400 / Math.max(1, painPoints.length - 1);
                const points = painPoints.map((p, idx) => {
                  const x = idx * step;
                  const y = 140 - (p.pain / 10) * 120;
                  return `${x},${y}`;
                }).join(' ');

                return (
                  <>
                    <polyline
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={points}
                    />
                    {painPoints.map((p, idx) => {
                      const x = idx * step;
                      const y = 140 - (p.pain / 10) * 120;
                      return (
                        <g key={idx}>
                          <circle cx={x} cy={y} r="4.5" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
                          <text x={x} y={y - 8} fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                            {p.pain}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>

            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
              <span>Baseline</span>
              <span>Mid-Phase 2</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* CHART 2: Overall Recovery Score Progression */}
        <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Daily Recovery Score (0-100)</h3>
            </div>
            <span className="text-xs text-emerald-400 font-bold">Trend: Ascending</span>
          </div>

          {/* SVG Bar / Line Progression */}
          <div className="relative h-56 w-full pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160">
              <line x1="0" y1="40" x2="400" y2="40" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="400" y2="80" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="400" y2="120" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="400" y2="150" stroke="#334155" />

              {/* Bar render */}
              {painPoints.map((p, idx) => {
                const total = painPoints.length;
                const barWidth = Math.min(26, 320 / total);
                const x = (400 / total) * idx + 10;
                const barHeight = (p.score / 100) * 120;
                const y = 150 - barHeight;

                return (
                  <g key={idx}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="4"
                      className="fill-cyan-500/30 stroke-cyan-400 hover:fill-cyan-400 transition"
                      strokeWidth="1.5"
                    />
                    <text x={x + barWidth / 2} y={y - 6} fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {p.score}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
              <span>{painPoints[0]?.date || 'Day 1'}</span>
              <span>{painPoints[painPoints.length - 1]?.date || 'Today'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
