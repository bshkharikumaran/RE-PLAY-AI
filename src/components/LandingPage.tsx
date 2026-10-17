import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  Activity,
  HeartPulse,
  ClipboardCheck,
  LineChart,
  UserCheck,
  Sparkles,
  Award,
  AlertTriangle,
  PlayCircle,
  FileCheck2,
  CheckCircle2,
  Zap,
  Lock
} from 'lucide-react';

interface LandingPageProps {
  onStartRecovery: () => void;
  onSelectDoctorPortal: () => void;
  onStartDemoTour: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartRecovery,
  onSelectDoctorPortal,
  onStartDemoTour,
}) => {
  return (
    <div className="space-y-16 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-emerald-600/20 via-cyan-600/15 to-transparent blur-3xl pointer-events-none rounded-full"></div>

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Doctor/Physiotherapist-Guided AI Recovery Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
            Your Comeback Starts With{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Smarter Recovery.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
            Connect your professional rehabilitation plan with daily AI-powered monitoring, progress analytics, and an adaptive safety layer.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onStartRecovery}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm transition shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              <span>Start Athlete Recovery</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onSelectDoctorPortal}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>I'm a Doctor / Physio</span>
            </button>

            <button
              onClick={onStartDemoTour}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 font-semibold text-sm border border-cyan-800/60 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-cyan-400" />
              <span>Interactive Demo Tour</span>
            </button>
          </div>

          {/* Trust & Safety Callout */}
          <div className="pt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Professional-Gated Phases
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-cyan-400" /> Real-time Clinical Safety Alerts
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-slate-400" /> Private Health Data
            </span>
          </div>
        </div>
      </section>

      {/* CORE PRODUCT LOOP VISUALIZATION */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-400">
              The Closed-Loop Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              The Real-World Comeback Loop
            </h2>
            <p className="text-sm text-slate-400">
              Doctor/Physio decides. AI monitors and assists. Player follows and reports. The system connects every single day of the journey.
            </p>
          </div>

          {/* 8-Stage Pipeline */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">01 PLAN</span>
                <ClipboardCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Professional Plan</h3>
              <p className="text-xs text-slate-400">Doctor/Physio creates or uploads recovery plan with restrictions & approved exercises.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">02 FOLLOW</span>
                <HeartPulse className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Follow Regimen</h3>
              <p className="text-xs text-slate-400">Athlete executes morning & evening exercises within allowed boundaries.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-500/30">03 TRACK</span>
                <Activity className="w-4 h-4 text-teal-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Daily Check-In</h3>
              <p className="text-xs text-slate-400">Logs pain (0-10), swelling, mobility, sleep hours, hydration, and exercise response.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">04 ANALYZE</span>
                <LineChart className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="text-sm font-bold text-white">AI Trend Signals</h3>
              <p className="text-xs text-slate-400">Synthesizes 6-factor Recovery Score & Daily Readiness indicator automatically.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">05 ALERT</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Smart Safety Check</h3>
              <p className="text-xs text-slate-400">Detects pain spikes, red flags, or doctor warning criteria before activity continues.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30">06 REVIEW</span>
                <UserCheck className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Physio Review</h3>
              <p className="text-xs text-slate-400">Clinician reviews AI daily summaries, pain trajectories, and resolved flags.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">07 PROGRESS</span>
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Phase Advance</h3>
              <p className="text-xs text-slate-400">Professional authorizes next rehabilitation phase; unlocks progressive exercises.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">08 COMEBACK</span>
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Return-to-Play</h3>
              <p className="text-xs text-slate-400">Passes sport-specific physical criteria and secures formal multi-disciplinary clearance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM VS THE SOLUTION */}
      <section className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-red-900/40 border border-red-600/40 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">The Problem</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            "An injury doesn't end an athlete's journey. Poor monitoring can."
          </p>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              Athletes receive a static paper exercise handout and face a 2-4 week communication blackout before their next clinic appointment.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              Athletes push through sharp pain, mistaking joint damage for "muscle burn," causing reinjury or prolonged recovery.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              Unsupervised Internet AI chatbots give dangerous, generic advice without access to the actual doctor's surgical or clinical restrictions.
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-900/40 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">The Solution</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            "RE:PLAY AI connects professional recovery plans with continuous player monitoring."
          </p>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              Document OCR & AI extracts clinician instructions into structured phases with explicit restrictions.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              Daily check-ins monitor pain, swelling, mobility, sleep, and hydration with automated clinical safety checks.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              RE:PLAY Coach uses RAG strictly grounded in the approved plan. Phase progression remains strictly clinician-gated.
            </li>
          </ul>
        </div>
      </section>

      {/* DUAL PERSPECTIVES: FOR PLAYERS & FOR CLINICIANS */}
      <section className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-6">
        <div className="glass-panel p-7 rounded-2xl border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">For Athletes & Players</span>
              <h4 className="text-lg font-bold text-white">Know what your approved plan requires today</h4>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Never second-guess whether an exercise is permitted. Track morning and evening recovery sessions, view your transparent daily recovery score, and ask the RE:PLAY Coach questions about your specific injury stage.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">Interactive Timers</span>
              Track sets, reps, and log body feeling immediately.
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">Safety Guardrails</span>
              Instant alerts if pain or swelling exceeds safe thresholds.
            </div>
          </div>
        </div>

        <div className="glass-panel p-7 rounded-2xl border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">For Doctors & Physiotherapists</span>
              <h4 className="text-lg font-bold text-white">See recovery trends between appointments</h4>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Triage 20+ active athletes at a glance. Receive high-priority warnings for symptom flares, review structured AI summaries separating observed facts from AI interpretation, and authorize phase progressions with one click.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">AI Daily Summaries</span>
              Fact vs interpretation vs decision clearly partitioned.
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">Gated Authority</span>
              Only licensed clinicians can unlock advanced loading phases.
            </div>
          </div>
        </div>
      </section>

      {/* CORE MEDICAL SAFETY PRINCIPLE FOOTER */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-700 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 mb-1">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Safety & Medical Principle</h3>
          <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
            RE:PLAY AI is an assistive decision-support platform. It does NOT diagnose injuries, replace qualified healthcare providers, override doctor instructions, or prescribe medications. All recommendations derive strictly from professional-provided plans.
          </p>
          <div className="pt-2 text-[11px] text-slate-500">
            For emergency symptoms: Stop activity immediately and call emergency services (911).
          </div>
        </div>
      </section>
    </div>
  );
};
