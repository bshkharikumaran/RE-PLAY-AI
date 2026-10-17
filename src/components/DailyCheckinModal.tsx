import React, { useState } from 'react';
import {
  X,
  Activity,
  AlertTriangle,
  PhoneCall,
  ShieldAlert,
  Droplets,
  Moon,
  Smile,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { DailyCheckin, RecoveryPlan } from '../types/index.js';

interface DailyCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePlan: RecoveryPlan | null;
  onSubmit: (checkinData: Partial<DailyCheckin>) => Promise<{
    safetyResult: {
      isSafe: boolean;
      severity: 'none' | 'info' | 'caution' | 'urgent';
      title: string;
      message: string;
      action: string;
      requiresEmergency: boolean;
      requiresDoctorContact: boolean;
    };
  }>;
}

export const DailyCheckinModal: React.FC<DailyCheckinModalProps> = ({
  isOpen,
  onClose,
  activePlan,
  onSubmit,
}) => {
  const [pain, setPain] = useState<number>(3);
  const [swelling, setSwelling] = useState<'none' | 'mild' | 'moderate' | 'severe'>('mild');
  const [mobility, setMobility] = useState<'better' | 'same' | 'worse'>('better');
  const [fatigue, setFatigue] = useState<number>(4);
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [sleepQuality, setSleepQuality] = useState<number>(8);
  const [hydrationLiters, setHydrationLiters] = useState<number>(2.8);
  const [exerciseCompletion, setExerciseCompletion] = useState<'completed' | 'partially_completed' | 'not_completed'>('completed');
  const [exerciseResponse, setExerciseResponse] = useState<'comfortable' | 'mild_discomfort' | 'increased_pain' | 'severe_pain'>('comfortable');
  const [mood, setMood] = useState<number>(8);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Safety Warning State if triggered
  const [safetyWarning, setSafetyWarning] = useState<{
    severity: 'none' | 'info' | 'caution' | 'urgent';
    title: string;
    message: string;
    action: string;
    requiresEmergency: boolean;
    requiresDoctorContact: boolean;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await onSubmit({
        pain,
        swelling,
        mobility,
        fatigue,
        sleepHours,
        sleepQuality,
        hydrationLiters,
        exerciseCompletion,
        exerciseResponse,
        mood,
        notes,
      });

      if (result.safetyResult.severity === 'urgent' || result.safetyResult.severity === 'caution') {
        setSafetyWarning(result.safetyResult);
      } else {
        onClose();
      }
    } catch (err) {
      console.error('Checkin submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPainColor = (val: number) => {
    if (val === 0) return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
    if (val <= 3) return 'text-teal-400 bg-teal-950/60 border-teal-500/40';
    if (val <= 6) return 'text-amber-400 bg-amber-950/60 border-amber-500/40';
    return 'text-rose-400 bg-rose-950/60 border-rose-500/40 animate-pulse';
  };

  const getPainDescription = (val: number) => {
    if (val === 0) return '0 — No Pain';
    if (val <= 3) return `${val} — Mild Discomfort (Tolerable)`;
    if (val <= 6) return `${val} — Moderate Pain (Requires caution)`;
    return `${val} — Severe Pain (Stop & consult physio)`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Daily Recovery Check-In</h2>
              <p className="text-xs text-slate-400">
                Log today’s physiological metrics to update your score & safety layer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form or Safety Warning view */}
        {safetyWarning ? (
          <div className="p-6 space-y-6 animate-in fade-in">
            <div className={`p-5 rounded-xl border ${
              safetyWarning.severity === 'urgent'
                ? 'bg-rose-950/40 border-rose-600/60 text-rose-300'
                : 'bg-amber-950/40 border-amber-600/60 text-amber-300'
            } space-y-3`}>
              <div className="flex items-center gap-3">
                <AlertTriangle className={`w-7 h-7 ${safetyWarning.severity === 'urgent' ? 'text-rose-400' : 'text-amber-400'}`} />
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950/60 border border-current">
                    {safetyWarning.severity.toUpperCase()} SAFETY ALERT
                  </span>
                  <h3 className="text-lg font-black text-white mt-1">{safetyWarning.title}</h3>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-slate-200">
                {safetyWarning.message}
              </p>

              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-white block">Recommended Action:</span>
                <p>{safetyWarning.action}</p>
              </div>
            </div>

            {/* Direct Contact Actions */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Immediate Clinical Assistance
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${activePlan?.clinicName ? '+1-555-019-2831' : '555-0100'}`}
                  className="p-3.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/50 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <PhoneCall className="w-4 h-4 text-cyan-400" />
                  <span>Contact {activePlan?.professionalName || 'Doctor/Physio'}</span>
                </a>

                {safetyWarning.requiresEmergency && (
                  <a
                    href="tel:911"
                    className="p-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-rose-950"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Call Emergency (911)</span>
                  </a>
                )}

                <button
                  onClick={onClose}
                  className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center transition cursor-pointer"
                >
                  I Understand & Acknowledge
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* PAIN SLIDER */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  How is your pain today? (0 - 10)
                </label>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getPainColor(pain)}`}>
                  {getPainDescription(pain)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={pain}
                onChange={(e) => setPain(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 px-1 font-mono">
                <span>0 (None)</span>
                <span>3 (Mild)</span>
                <span>6 (Moderate)</span>
                <span>10 (Severe)</span>
              </div>
            </div>

            {/* SWELLING & MOBILITY */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Joint Swelling
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['none', 'mild', 'moderate', 'severe'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSwelling(level)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-semibold capitalize border transition cursor-pointer ${
                        swelling === level
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Mobility Compared to Yesterday
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['better', 'same', 'worse'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMobility(m)}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold capitalize border transition cursor-pointer ${
                        mobility === m
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* EXERCISE COMPLETION & POST-EXERCISE RESPONSE */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Today's Exercise Completion
                </label>
                <select
                  value={exerciseCompletion}
                  onChange={(e) => setExerciseCompletion(e.target.value as any)}
                  className="w-full py-2.5 px-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-medium focus:border-emerald-500 focus:outline-none"
                >
                  <option value="completed">Completed all prescribed tasks</option>
                  <option value="partially_completed">Partially completed (some sets skipped)</option>
                  <option value="not_completed">Not completed</option>
                </select>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Post-Exercise Response
                </label>
                <select
                  value={exerciseResponse}
                  onChange={(e) => setExerciseResponse(e.target.value as any)}
                  className="w-full py-2.5 px-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-medium focus:border-emerald-500 focus:outline-none"
                >
                  <option value="comfortable">Comfortable (minimal or zero irritation)</option>
                  <option value="mild_discomfort">Mild discomfort (resolved with rest)</option>
                  <option value="increased_pain">Increased pain (lingering ache)</option>
                  <option value="severe_pain">Severe pain / sharp joint impingement</option>
                </select>
              </div>
            </div>

            {/* SLEEP, HYDRATION & FATIGUE */}
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <Moon className="w-3.5 h-3.5 text-cyan-400" /> Sleep (Hours)
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-400">{sleepHours}h</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none accent-cyan-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-teal-400" /> Hydration
                  </span>
                  <span className="text-xs font-mono font-bold text-teal-400">{hydrationLiters}L</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={hydrationLiters}
                  onChange={(e) => setHydrationLiters(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none accent-teal-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <Smile className="w-3.5 h-3.5 text-amber-400" /> Mood / Confidence
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">{mood}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none accent-amber-400"
                />
              </div>
            </div>

            {/* OPTIONAL NOTES */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Daily Subjective Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="How did your limb feel today? Any stiffness, popping, or observations to report to your physiotherapist?"
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Safety Reminder Note */}
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-400">
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Your metrics are analyzed against your physician’s explicit safety rules. In the event of alarming symptoms, warning actions will display automatically.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold transition shadow-lg shadow-emerald-950/60 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Evaluating Safety Rules...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Daily Check-In</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
