import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { db } from './server/db.js';
import {
  evaluateSafetyRules,
  extractRecoveryPlanWithAI,
  chatWithReplayCoach,
  generateProfessionalSummary,
} from './server/ai.js';
import { DailyCheckin, RecoveryScore, SafetyAlert, User } from './src/types/index.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '15mb' }));

// Request logging
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

// Calculate transparent non-diagnostic recovery score
function calculateRecoveryScore(playerId: string, todayCheckin: Partial<DailyCheckin>): RecoveryScore {
  const allCheckins = db.get('dailyCheckins').filter((c) => c.playerId === playerId);
  const recent = [...allCheckins.slice(-6), todayCheckin as DailyCheckin];

  // 1. Adherence Score
  const completedSessions = recent.filter((c) => c.exerciseCompletion === 'completed').length;
  const partialSessions = recent.filter((c) => c.exerciseCompletion === 'partially_completed').length;
  const adherenceScore = Math.min(100, Math.round(((completedSessions + partialSessions * 0.5) / Math.max(1, recent.length)) * 100));

  // 2. Sleep Score
  const sleepHrs = todayCheckin.sleepHours ?? 7.5;
  const sleepQual = todayCheckin.sleepQuality ?? 8;
  let hrScore = 70;
  if (sleepHrs >= 8) hrScore = 100;
  else if (sleepHrs >= 7) hrScore = 90;
  else if (sleepHrs >= 6) hrScore = 75;
  else hrScore = 50;
  const sleepScore = Math.min(100, Math.round(hrScore * 0.6 + sleepQual * 10 * 0.4));

  // 3. Pain Trend Score
  const pain = todayCheckin.pain ?? 3;
  let painScore = 100 - pain * 10;
  if (painScore < 20) painScore = 20;

  // 4. Mobility Score
  const mobility = todayCheckin.mobility ?? 'same';
  const mobilityScore = mobility === 'better' ? 95 : mobility === 'same' ? 78 : 45;

  // 5. Hydration Score
  const hydro = todayCheckin.hydrationLiters ?? 2.8;
  const hydrationScore = hydro >= 2.8 ? 100 : hydro >= 2.4 ? 88 : hydro >= 2.0 ? 75 : 55;

  // 6. Consistency Score
  const consistencyScore = Math.min(100, recent.length >= 7 ? 95 : recent.length * 14);

  // Weighted overall
  const overall = Math.round(
    adherenceScore * 0.3 +
    painScore * 0.2 +
    mobilityScore * 0.15 +
    sleepScore * 0.15 +
    hydrationScore * 0.1 +
    consistencyScore * 0.1
  );

  let readinessLevel: 'Low' | 'Moderate' | 'Optimal' = 'Moderate';
  let readinessAdvice = "Today's recovery indicators suggest maintaining your current professional-approved activity level. Return-to-play decisions must be confirmed by your healthcare professional.";

  if (pain >= 6 || todayCheckin.exerciseResponse === 'severe_pain' || sleepHrs < 5) {
    readinessLevel = 'Low';
    readinessAdvice = 'Recovery indicators show elevated strain. Focus on gentle recovery and hydration. Contact your physiotherapist if pain does not subside.';
  } else if (overall >= 80 && pain <= 3 && mobility !== 'worse') {
    readinessLevel = 'Optimal';
    readinessAdvice = 'Positive recovery markers recorded. Continue adhering strictly to approved exercises; avoid self-advancing into unapproved activities.';
  }

  const todayStr = todayCheckin.date || new Date().toISOString().split('T')[0];

  return {
    id: `score-${playerId}-${todayStr}`,
    playerId,
    date: todayStr,
    overallScore: Math.min(98, Math.max(30, overall)),
    adherenceScore,
    sleepScore,
    painTrendScore: painScore,
    mobilityScore,
    hydrationScore,
    consistencyScore,
    readinessLevel,
    readinessAdvice,
  };
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// Active user session (defaults to Marcus Vance)
let currentActiveUserId = 'player-marcus';

app.get('/api/auth/me', (req, res) => {
  const users = db.get('users');
  const user = users.find((u) => u.id === currentActiveUserId) || users[0];
  const profiles = db.get('playerProfiles');
  const profile = profiles.find((p) => p.userId === user.id);
  const injuries = db.get('injuries');
  const injury = injuries.find((i) => i.playerId === user.id);

  res.json({
    user,
    profile,
    injury,
  });
});

app.post('/api/auth/switch', (req, res) => {
  const { userId } = req.body;
  const users = db.get('users');
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  currentActiveUserId = user.id;
  const profiles = db.get('playerProfiles');
  const profile = profiles.find((p) => p.userId === user.id);
  const injuries = db.get('injuries');
  const injury = injuries.find((i) => i.playerId === user.id);

  console.log(`[AUTH] Switched active user to: ${user.name} (${user.role})`);
  res.json({ user, profile, injury });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, role, sport, position, experienceLevel, age, gender, trainingFrequency, preferredLanguage, injuryType, injuredBodyPart, injuryDate, severity, surgeryPerformed } = req.body;

  const users = db.get('users');
  const newUserId = `user-${Date.now()}`;
  const newUser: User = {
    id: newUserId,
    name: name || 'New Athlete',
    email: email || `${newUserId}@replay-user.com`,
    role: role || 'player',
    createdAt: new Date().toISOString(),
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    title: position || 'Athlete',
    clinic: 'Apex Sports & Orthopedic Institute',
  };

  users.push(newUser);
  db.set('users', users);

  if (role === 'player') {
    const profiles = db.get('playerProfiles');
    profiles.push({
      id: `profile-${newUserId}`,
      userId: newUserId,
      sport: sport || 'Multi-Sport',
      position: position || 'Player',
      experienceLevel: experienceLevel || 'Amateur',
      age: Number(age) || 24,
      gender: gender || 'Other',
      trainingFrequency: trainingFrequency || '3-4 times/week',
      preferredLanguage: preferredLanguage || 'English',
    });
    db.set('playerProfiles', profiles);

    if (injuryType) {
      const injuries = db.get('injuries');
      injuries.push({
        id: `inj-${newUserId}`,
        playerId: newUserId,
        injuryType: injuryType,
        injuredBodyPart: injuredBodyPart || 'Lower Extremity',
        injuryDate: injuryDate || new Date().toISOString().split('T')[0],
        severity: severity || 'Grade II (Moderate)',
        surgeryPerformed: Boolean(surgeryPerformed),
        currentPhase: 1,
        professionalId: 'prof-sarah',
        professionalName: 'Dr. Sarah Jenkins, DPT, SCS',
      });
      db.set('injuries', injuries);
    }
  }

  currentActiveUserId = newUserId;
  res.json({ success: true, user: newUser });
});

// All Users & Players
app.get('/api/users', (req, res) => {
  const users = db.get('users');
  res.json(users);
});

app.get('/api/players', (req, res) => {
  const users = db.get('users').filter((u) => u.role === 'player');
  const profiles = db.get('playerProfiles');
  const injuries = db.get('injuries');
  const scores = db.get('recoveryScores');
  const alerts = db.get('safetyAlerts');
  const checkins = db.get('dailyCheckins');
  const plans = db.get('recoveryPlans');

  const fullList = users.map((u) => {
    const prof = profiles.find((p) => p.userId === u.id);
    const inj = injuries.find((i) => i.playerId === u.id);
    const score = scores.filter((s) => s.playerId === u.id).slice(-1)[0];
    const userAlerts = alerts.filter((a) => a.playerId === u.id && a.status === 'active');
    const userCheckins = checkins.filter((c) => c.playerId === u.id);
    const lastCheckin = userCheckins.slice(-1)[0];
    const plan = plans.find((p) => p.playerId === u.id && p.status === 'active');

    return {
      user: u,
      profile: prof,
      injury: inj,
      latestScore: score?.overallScore || 75,
      readinessLevel: score?.readinessLevel || 'Moderate',
      activeAlertsCount: userAlerts.length,
      alerts: userAlerts,
      lastCheckinDate: lastCheckin?.date || 'No check-ins yet',
      currentPhase: inj?.currentPhase || 1,
      planTitle: plan?.title || 'No active plan',
      hasActivePlan: Boolean(plan),
    };
  });

  res.json(fullList);
});

app.get('/api/players/:id', (req, res) => {
  const playerId = req.params.id;
  const users = db.get('users');
  const user = users.find((u) => u.id === playerId);
  if (!user) return res.status(404).json({ error: 'Player not found' });

  const profile = db.get('playerProfiles').find((p) => p.userId === playerId);
  const injury = db.get('injuries').find((i) => i.playerId === playerId);
  const plan = db.get('recoveryPlans').find((p) => p.playerId === playerId && p.status === 'active');
  const checkins = db.get('dailyCheckins').filter((c) => c.playerId === playerId);
  const scores = db.get('recoveryScores').filter((s) => s.playerId === playerId);
  const alerts = db.get('safetyAlerts').filter((a) => a.playerId === playerId);
  const notes = db.get('professionalNotes').filter((n) => n.playerId === playerId);
  const checkpoints = db.get('returnToCheckpoints').filter((r) => r.playerId === playerId);

  res.json({
    user,
    profile,
    injury,
    plan,
    checkins,
    scores,
    alerts,
    notes,
    checkpoints,
  });
});

// Recovery Plan Management
app.get('/api/recovery-plan/active/:playerId', (req, res) => {
  const plans = db.get('recoveryPlans');
  const activePlan = plans.find((p) => p.playerId === req.params.playerId && p.status === 'active') ||
                     plans.find((p) => p.status === 'active');
  res.json(activePlan || null);
});

// Upload and parse document / text with Gemini AI
app.post('/api/recovery-plan/upload', async (req, res) => {
  const { playerId, rawText, docName, isDemoSample } = req.body;
  const targetPlayerId = playerId || currentActiveUserId;

  console.log(`[RECOVERY_PLAN] Extracting plan for player ${targetPlayerId} from document "${docName}"`);

  try {
    const extracted = await extractRecoveryPlanWithAI(rawText || '', docName || 'uploaded_recovery_instructions.txt');

    const newPlanId = `plan-${Date.now()}`;
    const newPlan = {
      id: newPlanId,
      playerId: targetPlayerId,
      professionalId: 'prof-sarah',
      professionalName: 'Dr. Sarah Jenkins, DPT, SCS',
      clinicName: 'Apex Sports & Orthopedic Institute',
      title: extracted.title || 'Structured Recovery Plan',
      diagnosisSummary: extracted.diagnosisSummary || 'Sports physical therapy protocol.',
      phases: extracted.phases || [],
      prescribedExercises: (extracted.prescribedExercises || []).map((e, i) => ({
        ...e,
        id: `presc-${newPlanId}-${i + 1}`,
        recoveryPlanId: newPlanId,
      })),
      generalInstructions: extracted.generalInstructions || [],
      restrictions: extracted.restrictions || [],
      nutritionInstructions: extracted.nutritionInstructions || [],
      hydrationGuidelines: extracted.hydrationGuidelines || '2.8L daily',
      warningSigns: extracted.warningSigns || [],
      startDate: new Date().toISOString().split('T')[0],
      reviewDate: extracted.followUpDate || '2026-10-14',
      followUpDate: extracted.followUpDate || '2026-10-14',
      status: isDemoSample ? 'active' : 'pending_confirmation',
      extractedFromDocName: docName,
      extractedRawText: rawText,
      createdAt: new Date().toISOString(),
      confirmedAt: isDemoSample ? new Date().toISOString() : undefined,
      confirmedBy: isDemoSample ? 'Dr. Sarah Jenkins, DPT, SCS' : undefined,
    };

    const plans = db.get('recoveryPlans');
    // If activating immediately in demo, archive previous active plans for this player
    if (newPlan.status === 'active') {
      plans.forEach((p) => {
        if (p.playerId === targetPlayerId && p.status === 'active') {
          p.status = 'archived';
        }
      });
    }
    plans.unshift(newPlan as any);
    db.set('recoveryPlans', plans);

    // Audit log
    const auditLogs = db.get('auditLogs');
    auditLogs.unshift({
      id: `audit-${Date.now()}`,
      userId: currentActiveUserId,
      userName: 'User / Clinician',
      role: 'player_or_professional',
      action: 'UPLOAD_RECOVERY_PLAN',
      details: `Uploaded and extracted medical plan "${docName}". Status: ${newPlan.status}`,
      timestamp: new Date().toISOString(),
    });
    db.set('auditLogs', auditLogs);

    res.json({
      success: true,
      plan: newPlan,
      message: 'Plan parsed successfully. Requires professional confirmation before full activation.',
    });
  } catch (err: any) {
    console.error('Failed to extract recovery plan:', err);
    res.status(500).json({ error: 'Failed to process document', details: err.message });
  }
});

// Professional confirms plan
app.post('/api/recovery-plan/confirm/:planId', (req, res) => {
  const { planId } = req.params;
  const { professionalName } = req.body;
  const plans = db.get('recoveryPlans');
  const plan = plans.find((p) => p.id === planId);

  if (!plan) return res.status(404).json({ error: 'Plan not found' });

  // Archive any other active plans for this player
  plans.forEach((p) => {
    if (p.playerId === plan.playerId && p.id !== planId && p.status === 'active') {
      p.status = 'archived';
    }
  });

  plan.status = 'active';
  plan.confirmedAt = new Date().toISOString();
  plan.confirmedBy = professionalName || 'Dr. Sarah Jenkins, DPT, SCS';
  db.set('recoveryPlans', plans);

  // Audit log
  const auditLogs = db.get('auditLogs');
  auditLogs.unshift({
    id: `audit-${Date.now()}`,
    userId: 'prof-sarah',
    userName: plan.confirmedBy || 'Dr. Sarah Jenkins, DPT, SCS',
    role: 'professional',
    action: 'CONFIRM_RECOVERY_PLAN',
    details: `Professional formally verified and activated recovery plan "${plan.title}" for athlete ${plan.playerId}.`,
    timestamp: new Date().toISOString(),
  });
  db.set('auditLogs', auditLogs);

  res.json({ success: true, plan });
});

// Professional approves progression to next phase
app.post('/api/recovery-plan/phase-progress/:planId', (req, res) => {
  const { planId } = req.params;
  const { targetPhaseNumber, professionalNotes } = req.body;
  const plans = db.get('recoveryPlans');
  const plan = plans.find((p) => p.id === planId);
  if (!plan) return res.status(404).json({ error: 'Plan not found' });

  const num = Number(targetPhaseNumber);
  plan.phases.forEach((p) => {
    if (p.number < num) {
      p.status = 'completed';
    } else if (p.number === num) {
      p.status = 'current';
      p.approvedByProfessionalId = 'prof-sarah';
      p.approvedAt = new Date().toISOString();
    } else {
      p.status = 'locked';
    }
  });

  // Update injury current phase
  const injuries = db.get('injuries');
  const injury = injuries.find((i) => i.playerId === plan.playerId);
  if (injury) {
    injury.currentPhase = num;
    db.set('injuries', injuries);
  }

  db.set('recoveryPlans', plans);

  // Clinical note
  if (professionalNotes) {
    const notes = db.get('professionalNotes');
    notes.unshift({
      id: `pnote-${Date.now()}`,
      playerId: plan.playerId,
      professionalId: 'prof-sarah',
      professionalName: 'Dr. Sarah Jenkins, DPT, SCS',
      note: `Progression Approval: Advanced to Phase ${num}. Note: ${professionalNotes}`,
      visibility: 'shared_with_player',
      createdAt: new Date().toISOString(),
    });
    db.set('professionalNotes', notes);
  }

  // Audit log
  const auditLogs = db.get('auditLogs');
  auditLogs.unshift({
    id: `audit-${Date.now()}`,
    userId: 'prof-sarah',
    userName: 'Dr. Sarah Jenkins, DPT, SCS',
    role: 'professional',
    action: 'APPROVE_PHASE_PROGRESSION',
    details: `Approved progression to Phase ${num} for player ${plan.playerId}.`,
    timestamp: new Date().toISOString(),
  });
  db.set('auditLogs', auditLogs);

  res.json({ success: true, plan });
});

// Daily Check-in & Smart Safety Check
app.get('/api/checkins/:playerId', (req, res) => {
  const checkins = db.get('dailyCheckins').filter((c) => c.playerId === req.params.playerId);
  res.json(checkins);
});

app.post('/api/checkins', (req, res) => {
  const checkinData: Partial<DailyCheckin> = req.body;
  const playerId = checkinData.playerId || currentActiveUserId;

  const plan = db.get('recoveryPlans').find((p) => p.playerId === playerId && p.status === 'active');

  // 1. SMART CLINICAL SAFETY CHECK ENGINE
  const safetyResult = evaluateSafetyRules(checkinData, plan);

  const checkins = db.get('dailyCheckins');
  const todayStr = checkinData.date || new Date().toISOString().split('T')[0];

  const newCheckin: DailyCheckin = {
    id: `chk-${playerId}-${Date.now()}`,
    playerId,
    date: todayStr,
    pain: Number(checkinData.pain ?? 0),
    swelling: checkinData.swelling || 'none',
    mobility: checkinData.mobility || 'same',
    fatigue: Number(checkinData.fatigue ?? 3),
    sleepHours: Number(checkinData.sleepHours ?? 8),
    sleepQuality: Number(checkinData.sleepQuality ?? 8),
    hydrationLiters: Number(checkinData.hydrationLiters ?? 2.8),
    exerciseCompletion: checkinData.exerciseCompletion || 'completed',
    exerciseResponse: checkinData.exerciseResponse || 'comfortable',
    mood: Number(checkinData.mood ?? 8),
    notes: checkinData.notes || '',
    safetyFlagTriggered: !safetyResult.isSafe || safetyResult.severity !== 'none',
    safetyFlagSeverity: safetyResult.severity,
    safetyFlagMessage: safetyResult.message,
    loggedAt: new Date().toISOString(),
  };

  // Replace if checkin for same date exists or append
  const existingIdx = checkins.findIndex((c) => c.playerId === playerId && c.date === todayStr);
  if (existingIdx >= 0) {
    checkins[existingIdx] = newCheckin;
  } else {
    checkins.push(newCheckin);
  }
  db.set('dailyCheckins', checkins);

  // 2. If safety flag triggered, automatically raise a SafetyAlert in database
  if (safetyResult.severity === 'caution' || safetyResult.severity === 'urgent') {
    const alerts = db.get('safetyAlerts');
    const user = db.get('users').find((u) => u.id === playerId);
    const newAlert: SafetyAlert = {
      id: `alert-${Date.now()}`,
      playerId,
      playerName: user?.name || 'Athlete',
      injuryName: plan?.title || 'Sports Rehabilitation',
      severity: safetyResult.severity,
      type: safetyResult.title,
      message: safetyResult.message,
      recommendedAction: safetyResult.action,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    alerts.unshift(newAlert);
    db.set('safetyAlerts', alerts);
  }

  // 3. Re-calculate Daily Recovery Score & Readiness
  const updatedScore = calculateRecoveryScore(playerId, newCheckin);
  const scores = db.get('recoveryScores');
  const scoreIdx = scores.findIndex((s) => s.playerId === playerId && s.date === todayStr);
  if (scoreIdx >= 0) {
    scores[scoreIdx] = updatedScore;
  } else {
    scores.unshift(updatedScore);
  }
  db.set('recoveryScores', scores);

  res.json({
    success: true,
    checkin: newCheckin,
    safetyResult,
    recoveryScore: updatedScore,
  });
});

// Exercise Logging
app.post('/api/exercises/log', (req, res) => {
  const { playerId, exerciseId, timeOfDay, completed, discomfortLevel, notes } = req.body;
  const targetPlayerId = playerId || currentActiveUserId;
  const logs = db.get('exerciseLogs');
  const newLog = {
    id: `exlog-${Date.now()}`,
    playerId: targetPlayerId,
    exerciseId,
    date: new Date().toISOString().split('T')[0],
    timeOfDay: timeOfDay || 'morning',
    completed: Boolean(completed),
    discomfortLevel: discomfortLevel || 'comfortable',
    notes,
    loggedAt: new Date().toISOString(),
  };
  logs.push(newLog);
  db.set('exerciseLogs', logs);

  // If discomfort was increased or severe, flag caution alert
  if (discomfortLevel === 'pain_increased' || discomfortLevel === 'severe_discomfort') {
    const alerts = db.get('safetyAlerts');
    const user = db.get('users').find((u) => u.id === targetPlayerId);
    alerts.unshift({
      id: `alert-${Date.now()}`,
      playerId: targetPlayerId,
      playerName: user?.name || 'Athlete',
      injuryName: 'Exercise Discomfort Flare',
      severity: discomfortLevel === 'severe_discomfort' ? 'urgent' : 'caution',
      type: 'Post-Exercise Symptom Change',
      message: `Athlete logged ${discomfortLevel === 'severe_discomfort' ? 'severe discomfort' : 'increased pain'} during exercise ${exerciseId}.`,
      recommendedAction: 'Advise athlete to ice, rest, and pause further sets until clinician review.',
      status: 'active',
      createdAt: new Date().toISOString(),
    });
    db.set('safetyAlerts', alerts);
  }

  res.json({ success: true, log: newLog });
});

// Master Exercise Library
app.get('/api/exercises/library', (req, res) => {
  res.json(db.get('exerciseLibrary'));
});

// RE:PLAY Coach Chat
app.post('/api/coach/chat', async (req, res) => {
  const { playerId, message, history } = req.body;
  const targetPlayerId = playerId || currentActiveUserId;

  console.log(`[COACH] Query for player ${targetPlayerId}: "${message}"`);
  try {
    const aiResponse = await chatWithReplayCoach(targetPlayerId, message, history || []);
    res.json(aiResponse);
  } catch (err: any) {
    console.error('Coach chat error:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Clinical AI Daily Summary for Professional
app.get('/api/professional/summary/:playerId', async (req, res) => {
  try {
    const summary = await generateProfessionalSummary(req.params.playerId);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// Alerts
app.get('/api/alerts', (req, res) => {
  res.json(db.get('safetyAlerts'));
});

app.post('/api/alerts/:id/resolve', (req, res) => {
  const { id } = req.params;
  const { resolutionNote, status } = req.body;
  const alerts = db.get('safetyAlerts');
  const alert = alerts.find((a) => a.id === id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });

  alert.status = status || 'resolved';
  alert.resolutionNote = resolutionNote || 'Clinician reviewed and provided athlete guidance.';
  alert.resolvedAt = new Date().toISOString();
  alert.resolvedBy = 'Dr. Sarah Jenkins, DPT, SCS';
  db.set('safetyAlerts', alerts);

  res.json({ success: true, alert });
});

// Clinical Notes
app.get('/api/notes/:playerId', (req, res) => {
  const notes = db.get('professionalNotes').filter((n) => n.playerId === req.params.playerId);
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const { playerId, note, visibility } = req.body;
  const notes = db.get('professionalNotes');
  const newNote = {
    id: `pnote-${Date.now()}`,
    playerId,
    professionalId: 'prof-sarah',
    professionalName: 'Dr. Sarah Jenkins, DPT, SCS',
    note,
    visibility: visibility || 'shared_with_player',
    createdAt: new Date().toISOString(),
  };
  notes.unshift(newNote);
  db.set('professionalNotes', notes);
  res.json({ success: true, note: newNote });
});

// Return-to-Play Checkpoints
app.get('/api/return-to-play/:playerId', (req, res) => {
  const checkpoints = db.get('returnToCheckpoints').filter((c) => c.playerId === req.params.playerId);
  res.json(checkpoints);
});

app.post('/api/return-to-play/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, professionalNotes } = req.body;
  const checkpoints = db.get('returnToCheckpoints');
  const cp = checkpoints.find((c) => c.id === id);
  if (!cp) return res.status(404).json({ error: 'Checkpoint not found' });

  cp.status = status;
  if (professionalNotes) cp.professionalNotes = professionalNotes;
  cp.updatedAt = new Date().toISOString();
  db.set('returnToCheckpoints', checkpoints);

  res.json({ success: true, checkpoint: cp });
});

// Admin Audit Logs
app.get('/api/admin/audit-logs', (req, res) => {
  res.json(db.get('auditLogs'));
});

// Reset Demo Data
app.post('/api/demo/reset', (req, res) => {
  const reset = db.resetDemoData();
  currentActiveUserId = 'player-marcus';
  res.json({ success: true, message: 'Demo data restored to initial state' });
});

// -------------------------------------------------------------
// VITE SPA MIDDLEWARE / PRODUCTION STATIC SERVER
// -------------------------------------------------------------
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static('dist'));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve('dist', 'index.html'));
  });
}

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(` RE:PLAY AI - Full-Stack Sports Recovery Server      `);
  console.log(` Port: ${PORT} | Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Active Demo User: Marcus Vance (player-marcus)     `);
  console.log(`====================================================`);
});
