import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Sparkles,
  Camera,
  AlertTriangle,
  RotateCcw,
  Volume2,
  ChevronRight,
  Activity,
  Info
} from 'lucide-react';
import { PrescribedExercise, RecoveryPlan } from '../types/index.js';
import { MovementAnalysis } from './MovementAnalysis.js';

interface ExerciseCenterProps {
  plan: RecoveryPlan | null;
  onLogExercise: (exerciseId: string, timeOfDay: string, completed: boolean, discomfort: string) => Promise<void>;
  onTriggerSafetyAlert?: (msg: string) => void;
}

export const ExerciseCenter: React.FC<ExerciseCenterProps> = ({
  plan,
  onLogExercise,
  onTriggerSafetyAlert,
}) => {
  const [selectedExercise, setSelectedExercise] = useState<PrescribedExercise | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [activeSessionTab, setActiveSessionTab] = useState<'morning' | 'evening'>('morning');
  const [showMovementCheck, setShowMovementCheck] = useState<boolean>(false);

  // Post-exercise body feeling modal
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [completedExerciseId, setCompletedExerciseId] = useState<string>('');

  // Finished exercise tracker state for today
  const [completedExercisesToday, setCompletedExercisesToday] = useState<Record<string, string>>({});

  const exercises = plan?.prescribedExercises || [];
  const currentPhase = plan?.phases.find((p) => p.status === 'current');

  // Filter exercises by timing
  const morningExercises = exercises.filter((e) => e.timing === 'morning' || e.timing === 'anytime');
  const eveningExercises = exercises.filter((e) => e.timing === 'evening');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      handleFinishSession();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleStartExercise = (ex: PrescribedExercise) => {
    setSelectedExercise(ex);
    const duration = ex.durationSeconds || (ex.holdSeconds ? ex.holdSeconds * (ex.reps || 10) : 60);
    setTimerSeconds(duration);
    setIsTimerRunning(true);
  };

  const handleFinishSession = () => {
    if (!selectedExercise) return;
    setIsTimerRunning(false);
    setCompletedExerciseId(selectedExercise.id);
    setShowFeedbackModal(true);
  };

  const submitPostExerciseFeedback = async (discomfort: 'comfortable' | 'mild_discomfort' | 'pain_increased' | 'severe_discomfort') => {
    setShowFeedbackModal(false);
    if (!completedExerciseId) return;

    setCompletedExercisesToday((prev) => ({
      ...prev,
      [completedExerciseId]: discomfort,
    }));

    await onLogExercise(completedExerciseId, activeSessionTab, true, discomfort);

    if (discomfort === 'pain_increased' || discomfort === 'severe_discomfort') {
      if (onTriggerSafetyAlert) {
        onTriggerSafetyAlert(`Exercise response indicated ${discomfort.replace('_', ' ')}. Please pause further sets and apply ice.`);
      }
    }
    setSelectedExercise(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                Phase {currentPhase?.number || 2} Prescribed Regimen
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Supervised Home Program
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
              Today's Rehabilitation Sessions
            </h2>
          </div>

          {/* Morning vs Evening Tab Toggle */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveSessionTab('morning')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeSessionTab === 'morning'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Morning Routine ({morningExercises.length})
            </button>
            <button
              onClick={() => setActiveSessionTab('evening')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeSessionTab === 'evening'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Evening Routine ({eveningExercises.length})
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Follow your physiotherapist’s prescribed sets and hold times. Never force into sharp impingement pain. If symptoms escalate, log your response to update your clinical safety status.
        </p>
      </div>

      {/* Active Workout Tracker HUD if an exercise is running */}
      {selectedExercise && (
        <div className="glass-panel-highlight p-6 rounded-2xl border-emerald-500/40 space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Current Exercise in Progress
              </span>
              <h3 className="text-xl font-extrabold text-white">{selectedExercise.name}</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Target: {selectedExercise.sets} sets × {selectedExercise.reps || '12'} reps
                {selectedExercise.holdSeconds ? ` • ${selectedExercise.holdSeconds}s isometric hold` : ''}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMovementCheck(true)}
                className="px-3.5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>AI Form Check</span>
              </button>

              <button
                onClick={handleFinishSession}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Complete Set</span>
              </button>
            </div>
          </div>

          {/* Interactive Countdown Timer */}
          <div className="grid sm:grid-cols-3 gap-4 items-center">
            <div className="sm:col-span-1 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-4xl font-black font-mono text-emerald-400">
                {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-[11px] text-slate-400 font-medium mt-1">Session Timer</span>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setTimerSeconds(60)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="sm:col-span-2 space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <strong className="text-white block mb-0.5 font-bold">Form & Technique Instructions:</strong>
                <p className="text-slate-300 leading-relaxed">{selectedExercise.instructions}</p>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-200">
                <strong className="block mb-0.5 font-bold flex items-center gap-1 text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" /> Clinical Caution:
                </strong>
                <p className="leading-relaxed">{selectedExercise.cautions || 'Stay within comfortable range.'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Cards Grid for Selected Session (Morning or Evening) */}
      <div className="grid md:grid-cols-2 gap-4">
        {(activeSessionTab === 'morning' ? morningExercises : eveningExercises).map((ex) => {
          const isDone = Boolean(completedExercisesToday[ex.id]);
          const responseState = completedExercisesToday[ex.id];

          return (
            <div
              key={ex.id}
              className={`p-5 rounded-2xl border transition relative flex flex-col justify-between ${
                isDone
                  ? 'bg-slate-900/40 border-slate-800 opacity-80'
                  : 'glass-card border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                      {ex.bodyArea}
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">{ex.name}</h4>
                  </div>

                  {isDone ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Logged
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {ex.frequency}
                    </span>
                  )}
                </div>

                {/* Parameters */}
                <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
                  <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">
                    {ex.sets} sets
                  </span>
                  <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">
                    {ex.reps || 10} reps
                  </span>
                  {ex.holdSeconds && (
                    <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">
                      {ex.holdSeconds}s hold
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {ex.instructions}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-4">
                <button
                  onClick={() => {
                    setSelectedExercise(ex);
                    setShowMovementCheck(true);
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>AI Form Check</span>
                </button>

                <button
                  onClick={() => handleStartExercise(ex)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isDone
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isDone ? 'Repeat Exercise' : 'Start Session'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* POST-EXERCISE BODY FEELING MODAL */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">How did your body feel?</h3>
              <p className="text-xs text-slate-400">
                Recording your immediate joint response updates your recovery safety index.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => submitPostExerciseFeedback('comfortable')}
                className="w-full p-3 rounded-xl bg-slate-800 hover:bg-emerald-950/60 border border-slate-700 hover:border-emerald-500/60 text-left transition cursor-pointer"
              >
                <div className="font-bold text-xs text-white">Comfortable</div>
                <div className="text-[11px] text-slate-400">Normal fatigue, zero or minimal joint irritation</div>
              </button>

              <button
                onClick={() => submitPostExerciseFeedback('mild_discomfort')}
                className="w-full p-3 rounded-xl bg-slate-800 hover:bg-teal-950/60 border border-slate-700 hover:border-teal-500/60 text-left transition cursor-pointer"
              >
                <div className="font-bold text-xs text-white">Mild Discomfort</div>
                <div className="text-[11px] text-slate-400">Tolerable stretch sensation that eases quickly upon resting</div>
              </button>

              <button
                onClick={() => submitPostExerciseFeedback('pain_increased')}
                className="w-full p-3 rounded-xl bg-slate-800 hover:bg-amber-950/60 border border-slate-700 hover:border-amber-500/60 text-left transition cursor-pointer"
              >
                <div className="font-bold text-xs text-amber-300">Pain Increased</div>
                <div className="text-[11px] text-slate-400">Persistent ache exceeding baseline; flags clinical review</div>
              </button>

              <button
                onClick={() => submitPostExerciseFeedback('severe_discomfort')}
                className="w-full p-3 rounded-xl bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/60 text-left transition cursor-pointer"
              >
                <div className="font-bold text-xs text-rose-400">Severe Discomfort</div>
                <div className="text-[11px] text-slate-400">Sharp pinching or giving way; triggers stop-activity protocol</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI MOVEMENT CHECK MODAL */}
      {showMovementCheck && (
        <MovementAnalysis
          exerciseName={selectedExercise?.name || 'Rehabilitation Mobility Drill'}
          onClose={() => setShowMovementCheck(false)}
        />
      )}
    </div>
  );
};
