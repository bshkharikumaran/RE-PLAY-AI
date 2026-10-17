import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { LandingPage } from './components/LandingPage.js';
import { RecoveryScoreGauge } from './components/RecoveryScoreGauge.js';
import { RecoveryPlanView } from './components/RecoveryPlanView.js';
import { PlanUploadModal } from './components/PlanUploadModal.js';
import { DailyCheckinModal } from './components/DailyCheckinModal.js';
import { ExerciseCenter } from './components/ExerciseCenter.js';
import { ReplayCoachChat } from './components/ReplayCoachChat.js';
import { ProgressAnalytics } from './components/ProgressAnalytics.js';
import { ReturnToPlayModule } from './components/ReturnToPlayModule.js';
import { ProfessionalDashboard } from './components/ProfessionalDashboard.js';
import { AdminDashboard } from './components/AdminDashboard.js';
import { PlayerReportModal } from './components/PlayerReportModal.js';
import { DemoTourGuide } from './components/DemoTourGuide.js';
import {
  DailyCheckin,
  Injury,
  PlayerProfile,
  RecoveryPlan,
  RecoveryScore,
  ReturnToCheckpoint,
  SafetyAlert,
  User,
  UserRole
} from './types/index.js';
import {
  Activity,
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  HeartPulse,
  Info,
  PhoneCall,
  PlayCircle,
  ShieldAlert,
  Sparkles,
  Upload,
  UserCheck
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);
  const [playerInjury, setPlayerInjury] = useState<Injury | null>(null);
  const [activePlan, setActivePlan] = useState<RecoveryPlan | null>(null);
  const [checkins, setCheckins] = useState<DailyCheckin[]>([]);
  const [scores, setScores] = useState<RecoveryScore[]>([]);
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [checkpoints, setCheckpoints] = useState<ReturnToCheckpoint[]>([]);
  const [activeTab, setActiveTab] = useState<string>('player-dashboard');

  // Modals state
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState<boolean>(false);

  // Load initial app data
  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setCurrentUser(data.user);
      setPlayerProfile(data.profile);
      setPlayerInjury(data.injury);

      if (data.user) {
        await loadUserData(data.user.id);
      }
    } catch (err) {
      console.error('Error loading auth session:', err);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      const [planRes, chkRes, detRes] = await Promise.all([
        fetch(`/api/recovery-plan/active/${userId}`),
        fetch(`/api/checkins/${userId}`),
        fetch(`/api/players/${userId}`),
      ]);

      const planData = await planRes.json();
      const chkData = await chkRes.json();
      const detData = await detRes.json();

      setActivePlan(planData);
      setCheckins(chkData);
      if (detData.scores) setScores(detData.scores);
      if (detData.alerts) setAlerts(detData.alerts);
      if (detData.checkpoints) setCheckpoints(detData.checkpoints);
    } catch (err) {
      console.error('Failed to load user specific data:', err);
    }
  };

  // Switch persona (Marcus Vance, Dr. Sarah Jenkins, Rachel Green)
  const handleSwitchUser = async (userId: string) => {
    try {
      const res = await fetch('/api/auth/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      setCurrentUser(data.user);
      setPlayerProfile(data.profile);
      setPlayerInjury(data.injury);

      await loadUserData(data.user.id);

      // Route tab logically based on switched user role
      if (data.user.role === 'professional') {
        setActiveTab('prof-dashboard');
      } else if (data.user.role === 'admin') {
        setActiveTab('admin-dashboard');
      } else {
        setActiveTab('player-dashboard');
      }
    } catch (err) {
      console.error('Failed to switch user:', err);
    }
  };

  // Daily Checkin submission
  const handleCheckinSubmit = async (checkinData: Partial<DailyCheckin>) => {
    if (!currentUser) return { safetyResult: { isSafe: true, severity: 'none' as const, title: '', message: '', action: '', requiresEmergency: false, requiresDoctorContact: false } };

    const res = await fetch('/api/checkins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...checkinData,
        playerId: currentUser.id,
      }),
    });
    const data = await res.json();

    if (data.success) {
      // reload checkins and scores
      await loadUserData(currentUser.id);
    }
    return { safetyResult: data.safetyResult };
  };

  // Exercise log submission
  const handleLogExercise = async (exerciseId: string, timeOfDay: string, completed: boolean, discomfort: string) => {
    if (!currentUser) return;
    try {
      await fetch('/api/exercises/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: currentUser.id,
          exerciseId,
          timeOfDay,
          completed,
          discomfortLevel: discomfort,
        }),
      });
      await loadUserData(currentUser.id);
    } catch (err) {
      console.error('Failed to log exercise:', err);
    }
  };

  // Phase Progression Approval
  const handleApprovePhase = async (planId: string, targetPhase: number) => {
    try {
      const res = await fetch(`/api/recovery-plan/phase-progress/${planId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetPhaseNumber: targetPhase,
          professionalNotes: 'Clinical assessment verified satisfactory healing markers. Approved next phase functional progression.',
        }),
      });
      const data = await res.json();
      if (data.success && data.plan) {
        setActivePlan(data.plan);
        if (currentUser) await loadUserData(currentUser.id);
      }
    } catch (err) {
      console.error('Failed to approve phase progression:', err);
    }
  };

  // Resolve Alert
  const handleResolveAlert = async (alertId: string, note: string) => {
    try {
      await fetch(`/api/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolutionNote: note }),
      });
      if (currentUser) await loadUserData(currentUser.id);
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  // Return to play checkpoint status update
  const handleUpdateCheckpointStatus = async (id: string, status: ReturnToCheckpoint['status'], notes?: string) => {
    try {
      await fetch(`/api/return-to-play/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, professionalNotes: notes }),
      });
      if (currentUser) await loadUserData(currentUser.id);
    } catch (err) {
      console.error('Failed to update checkpoint:', err);
    }
  };

  // Reset Demo Data
  const handleResetDemo = async () => {
    await fetch('/api/demo/reset', { method: 'POST' });
    await loadSession();
  };

  // Tour step navigator
  const handleTourNavigate = (targetTab: string, triggerAction?: string) => {
    setActiveTab(targetTab);
    if (triggerAction === 'open_checkin') {
      setIsCheckinModalOpen(true);
    }
  };

  const userRole: UserRole = currentUser?.role || 'player';
  const latestScore = scores.slice(-1)[0] || null;
  const activeAlertsList = alerts.filter((a) => a.status === 'active');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        currentRole={userRole}
        currentUserName={currentUser?.name || 'Marcus Vance'}
        onSwitchUser={handleSwitchUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCheckin={() => setIsCheckinModalOpen(true)}
        onStartDemoTour={() => setIsDemoTourOpen(true)}
        onOpenReport={() => setIsReportModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: OVERVIEW & CORE LOOP LANDING */}
        {activeTab === 'landing' && (
          <LandingPage
            onStartRecovery={() => {
              handleSwitchUser('player-marcus');
              setActiveTab('player-dashboard');
            }}
            onSelectDoctorPortal={() => {
              handleSwitchUser('prof-sarah');
              setActiveTab('prof-dashboard');
            }}
            onStartDemoTour={() => setIsDemoTourOpen(true)}
          />
        )}

        {/* TAB 2: ATHLETE TODAY'S RECOVERY DASHBOARD */}
        {activeTab === 'player-dashboard' && (
          <div className="space-y-6">
            {/* Athlete Profile & Injury Context Banner */}
            <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                      alt={currentUser?.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 text-[10px] font-bold text-emerald-400">
                      Phase {playerInjury?.currentPhase || 2}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-black text-white">{currentUser?.name}</h1>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                        {playerProfile?.sport || 'Football'} • {playerProfile?.position || 'Midfielder'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Diagnosis: <strong className="text-white">{playerInjury?.injuryType}</strong> ({playerInjury?.severity})
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Supervising Provider: <span className="text-cyan-400 font-semibold">{playerInjury?.professionalName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsCheckinModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-950 cursor-pointer"
                  >
                    <Activity className="w-4 h-4" />
                    <span>Complete Today's Check-In</span>
                  </button>
                </div>
              </div>

              {/* High Priority Active Safety Alerts if any */}
              {activeAlertsList.length > 0 && (
                <div className="space-y-2 pt-1">
                  {activeAlertsList.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                        alert.severity === 'urgent'
                          ? 'bg-rose-950/40 border-rose-600/50 text-rose-200'
                          : 'bg-amber-950/40 border-amber-600/50 text-amber-200'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-black uppercase tracking-wider block">
                            [{alert.severity.toUpperCase()}] {alert.type}
                          </span>
                          <p className="mt-0.5">{alert.message}</p>
                          <p className="text-[11px] mt-1 text-slate-300 font-semibold">
                            Action: {alert.recommendedAction}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href="tel:5550192831"
                          className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition flex items-center gap-1"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call Clinic</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DAILY RECOVERY SCORE & READINESS GAUGE */}
            <RecoveryScoreGauge
              score={latestScore}
              onOpenCheckin={() => setIsCheckinModalOpen(true)}
            />

            {/* QUICK ACTIONS & PRESCRIBED EXERCISE PREVIEW */}
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-4">
                <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                        Today's Prescribed Protocol
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        Approved Exercises for Phase {playerInjury?.currentPhase || 2}
                      </h3>
                    </div>

                    <button
                      onClick={() => setActiveTab('plan-exercises')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <span>View Full Plan & Timer</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Summary list */}
                  <div className="space-y-2.5">
                    {(activePlan?.prescribedExercises || []).slice(0, 3).map((ex) => (
                      <div
                        key={ex.id}
                        className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <span className="font-bold text-white block">{ex.name}</span>
                          <span className="text-[11px] text-slate-400">
                            {ex.bodyArea} • {ex.timing} • {ex.sets} sets × {ex.reps || 10} reps
                          </span>
                        </div>
                        <button
                          onClick={() => setActiveTab('plan-exercises')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold transition cursor-pointer"
                        >
                          Start
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Quick Coach & Clinical Notes Widget */}
              <div className="lg:col-span-4 space-y-4">
                {/* RE:PLAY Coach Teaser */}
                <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Sparkles className="w-4 h-4" />
                    <h3 className="text-xs font-black uppercase tracking-wider">RE:PLAY Coach</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Have a question about whether an activity is permitted or why you felt stiff today?
                  </p>
                  <button
                    onClick={() => setActiveTab('coach-chat')}
                    className="w-full py-2.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Ask RE:PLAY Coach</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Supervising Physio Info */}
                <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-2 text-xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Clinical Team</span>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs">
                      SJ
                    </div>
                    <div>
                      <div className="font-bold text-white">Dr. Sarah Jenkins, DPT</div>
                      <div className="text-[10px] text-slate-400">Apex Sports Physical Therapy</div>
                    </div>
                  </div>
                  <div className="pt-2 text-[11px] text-slate-400">
                    Next Clinic Reassessment: <strong className="text-white">{activePlan?.followUpDate || '2026-10-08'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PLAN & EXERCISES */}
        {activeTab === 'plan-exercises' && (
          <div className="space-y-8">
            <RecoveryPlanView
              plan={activePlan}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              userRole={userRole}
              onApprovePhaseProgression={(nextPhase) => {
                if (activePlan) handleApprovePhase(activePlan.id, nextPhase);
              }}
            />

            <ExerciseCenter
              plan={activePlan}
              onLogExercise={handleLogExercise}
              onTriggerSafetyAlert={(msg) => {
                console.warn('Exercise triggered safety alert:', msg);
              }}
            />
          </div>
        )}

        {/* TAB 4: RE:PLAY COACH CHAT */}
        {activeTab === 'coach-chat' && (
          <div className="max-w-4xl mx-auto">
            <ReplayCoachChat
              playerId={currentUser?.id || 'player-marcus'}
              activePlan={activePlan}
            />
          </div>
        )}

        {/* TAB 5: PROGRESS ANALYTICS */}
        {activeTab === 'analytics' && (
          <ProgressAnalytics
            checkins={checkins}
            scores={scores}
          />
        )}

        {/* TAB 6: RETURN-TO-PLAY */}
        {activeTab === 'return-to-play' && (
          <ReturnToPlayModule
            checkpoints={checkpoints}
            userRole={userRole}
            onUpdateCheckpointStatus={handleUpdateCheckpointStatus}
          />
        )}

        {/* TAB 7: CLINICIAN PORTAL */}
        {activeTab === 'prof-dashboard' && (
          <ProfessionalDashboard
            onSelectPlayer={(id) => handleSwitchUser(id)}
            onApprovePhase={handleApprovePhase}
            onResolveAlert={handleResolveAlert}
          />
        )}

        {/* TAB 8: ADMIN DASHBOARD */}
        {activeTab === 'admin-dashboard' && (
          <AdminDashboard
            onResetDemo={handleResetDemo}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="font-extrabold text-white">RE:PLAY AI</span>
          <span>—</span>
          <span>Doctor/Physiotherapist-Guided AI Recovery & Comeback Platform</span>
        </div>
        <p className="max-w-2xl mx-auto text-[11px] text-slate-500 leading-relaxed">
          RE:PLAY AI is an assistive sports recovery decision-support system. It does not replace medical advice, diagnosis, or clinical clearance. For medical emergencies, immediately contact emergency services (911).
        </p>
      </footer>

      {/* ALL MODALS */}
      {isCheckinModalOpen && (
        <DailyCheckinModal
          isOpen={isCheckinModalOpen}
          onClose={() => setIsCheckinModalOpen(false)}
          activePlan={activePlan}
          onSubmit={handleCheckinSubmit}
        />
      )}

      {isUploadModalOpen && (
        <PlanUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          playerId={currentUser?.id || 'player-marcus'}
          onPlanExtractedAndSaved={(plan) => {
            setActivePlan(plan);
            if (currentUser) loadUserData(currentUser.id);
          }}
          isDoctorOrPhysio={userRole === 'professional'}
        />
      )}

      {isReportModalOpen && (
        <PlayerReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          player={{ user: currentUser, profile: playerProfile, injury: playerInjury }}
          plan={activePlan}
          checkins={checkins}
          scores={scores}
        />
      )}

      {isDemoTourOpen && (
        <DemoTourGuide
          isOpen={isDemoTourOpen}
          onClose={() => setIsDemoTourOpen(false)}
          onNavigateStep={handleTourNavigate}
        />
      )}
    </div>
  );
}
