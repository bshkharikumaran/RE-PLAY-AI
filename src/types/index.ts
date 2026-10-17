/**
 * RE:PLAY AI - Core Data Models & Types
 * Doctor/Physiotherapist-Guided AI Recovery Assistant
 */

export type UserRole = 'player' | 'professional' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  title?: string;
  clinic?: string;
  phone?: string;
  createdAt: string;
}

export interface PlayerProfile {
  id: string;
  userId: string;
  sport: string;
  position: string;
  experienceLevel: 'Amateur' | 'Semi-Pro' | 'Collegiate' | 'Professional';
  age: number;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  trainingFrequency: string;
  preferredLanguage: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface Injury {
  id: string;
  playerId: string;
  injuryType: string;
  injuredBodyPart: string;
  injuryDate: string;
  severity: 'Grade I (Mild)' | 'Grade II (Moderate)' | 'Grade III (Severe)' | 'Post-Surgical' | 'Chronic Overuse';
  surgeryPerformed: boolean;
  surgeryDate?: string;
  surgeryDetails?: string;
  currentPhase: number;
  professionalId: string;
  professionalName: string;
  notes?: string;
}

export interface RecoveryPhase {
  id: string;
  number: number;
  name: string;
  goal: string;
  allowedActivities: string[];
  avoidActivities: string[];
  status: 'completed' | 'current' | 'locked';
  approvedByProfessionalId?: string;
  approvedAt?: string;
  minDurationWeeks?: number;
}

export interface PrescribedExercise {
  id: string;
  recoveryPlanId: string;
  exerciseId: string;
  name: string;
  bodyArea: string;
  phaseNumber: number;
  frequency: string; // e.g. "Twice daily", "Daily"
  sets: number;
  reps: number;
  durationSeconds?: number;
  holdSeconds?: number;
  instructions: string;
  cautions?: string;
  videoUrl?: string;
  timing: 'morning' | 'evening' | 'anytime';
  approvalStatus: 'approved' | 'pending' | 'restricted';
}

export interface RecoveryPlan {
  id: string;
  playerId: string;
  professionalId: string;
  professionalName: string;
  clinicName: string;
  title: string;
  diagnosisSummary: string;
  phases: RecoveryPhase[];
  prescribedExercises: PrescribedExercise[];
  generalInstructions: string[];
  restrictions: string[];
  nutritionInstructions: string[];
  hydrationGuidelines: string;
  warningSigns: string[];
  startDate: string;
  reviewDate: string;
  followUpDate: string;
  status: 'draft' | 'pending_confirmation' | 'active' | 'archived';
  extractedFromDocName?: string;
  extractedRawText?: string;
  confirmedAt?: string;
  confirmedBy?: string;
  createdAt: string;
}

export interface DailyCheckin {
  id: string;
  playerId: string;
  date: string; // YYYY-MM-DD
  pain: number; // 0 to 10
  swelling: 'none' | 'mild' | 'moderate' | 'severe';
  mobility: 'better' | 'same' | 'worse';
  fatigue: number; // 0 to 10
  sleepHours: number;
  sleepQuality: number; // 0 to 10
  hydrationLiters: number;
  exerciseCompletion: 'completed' | 'partially_completed' | 'not_completed';
  exerciseResponse: 'comfortable' | 'mild_discomfort' | 'increased_pain' | 'severe_pain';
  mood: number; // 0 to 10
  notes?: string;
  safetyFlagTriggered: boolean;
  safetyFlagSeverity?: 'none' | 'info' | 'caution' | 'urgent';
  safetyFlagMessage?: string;
  loggedAt: string;
}

export interface ExerciseLog {
  id: string;
  playerId: string;
  exerciseId: string;
  date: string; // YYYY-MM-DD
  timeOfDay: 'morning' | 'evening';
  completed: boolean;
  discomfortLevel: 'comfortable' | 'mild_discomfort' | 'pain_increased' | 'severe_discomfort';
  notes?: string;
  loggedAt: string;
}

export interface RecoveryScore {
  id: string;
  playerId: string;
  date: string;
  overallScore: number; // 0 - 100
  adherenceScore: number;
  sleepScore: number;
  painTrendScore: number;
  mobilityScore: number;
  hydrationScore: number;
  consistencyScore: number;
  readinessLevel: 'Low' | 'Moderate' | 'Optimal';
  readinessAdvice: string;
}

export type AlertSeverity = 'info' | 'caution' | 'urgent';

export interface SafetyAlert {
  id: string;
  playerId: string;
  playerName: string;
  injuryName: string;
  severity: AlertSeverity;
  type: string;
  message: string;
  recommendedAction: string;
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
}

export interface ProfessionalNote {
  id: string;
  playerId: string;
  professionalId: string;
  professionalName: string;
  note: string;
  visibility: 'shared_with_player' | 'clinical_only';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface ReturnToPlayCheckpoint {
  id: string;
  playerId: string;
  category: 'Pain & Swelling' | 'Range of Motion' | 'Strength & Endurance' | 'Balance & Proprioception' | 'Sport-Specific Drills' | 'Clinical Clearance';
  name: string;
  criteria: string;
  status: 'cleared' | 'needs_work' | 'pending';
  professionalNotes?: string;
  updatedAt: string;
}

export interface ExerciseMaster {
  id: string;
  name: string;
  bodyArea: 'Ankle & Foot' | 'Knee' | 'Hip' | 'Shoulder' | 'Spine & Core' | 'Hamstring & Thigh';
  phaseMin: number;
  description: string;
  instructions: string[];
  cautions: string[];
  contraindications: string[];
  defaultSets: number;
  defaultReps: number;
  defaultHoldSeconds?: number;
  videoIllustration: string; // descriptive or svg tag
}

export interface ReturnToCheckpoint {
  id: string;
  playerId: string;
  criterion: string;
  description: string;
  currentMetric: string;
  targetThreshold: string;
  status: 'passed' | 'in_progress' | 'pending_review';
  lastEvaluated?: string;
  professionalNotes?: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  bodyArea: string;
  instructions: string;
  defaultSets: number;
  defaultReps?: number;
  difficulty: string;
}
