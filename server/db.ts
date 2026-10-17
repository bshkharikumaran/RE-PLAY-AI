import fs from 'fs';
import path from 'path';
import {
  User,
  PlayerProfile,
  Injury,
  RecoveryPlan,
  DailyCheckin,
  ExerciseLog,
  RecoveryScore,
  SafetyAlert,
  ProfessionalNote,
  AuditLog,
  ReturnToPlayCheckpoint,
  ExerciseMaster,
} from '../src/types/index.js';

interface DatabaseSchema {
  users: User[];
  playerProfiles: PlayerProfile[];
  injuries: Injury[];
  recoveryPlans: RecoveryPlan[];
  dailyCheckins: DailyCheckin[];
  exerciseLogs: ExerciseLog[];
  recoveryScores: RecoveryScore[];
  safetyAlerts: SafetyAlert[];
  professionalNotes: ProfessionalNote[];
  auditLogs: AuditLog[];
  returnToCheckpoints: ReturnToPlayCheckpoint[];
  exerciseLibrary: ExerciseMaster[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'replay_db.json');

const INITIAL_EXERCISES: ExerciseMaster[] = [
  {
    id: 'ex-ankle-alphabet',
    name: 'Ankle Alphabet Range of Motion',
    bodyArea: 'Ankle & Foot',
    phaseMin: 1,
    description: 'Trace letters A-Z with your big toe to restore active multi-planar ankle mobility.',
    instructions: [
      'Sit comfortably on a chair or bench with your leg elevated slightly.',
      'Using only your ankle and foot (keep your hip and knee still), trace each letter of the alphabet in uppercase from A to Z.',
      'Make the movements slow, deliberate, and within a pain-free boundary.',
    ],
    cautions: ['Do not push into sharp pinching pain at the front of the ankle.', 'Do not move your whole leg from the knee.'],
    contraindications: ['Acute unhealed ankle fracture', 'Severe unmanaged inflammation'],
    defaultSets: 2,
    defaultReps: 1,
    defaultHoldSeconds: 60,
    videoIllustration: 'ankle_rom',
  },
  {
    id: 'ex-ankle-iso-ever',
    name: 'Isometric Ankle Eversion with Band',
    bodyArea: 'Ankle & Foot',
    phaseMin: 2,
    description: 'Strengthen the peroneus longus and brevis stabilizing tendons without joint irritation.',
    instructions: [
      'Loop an elastic resistance band around the outer edge of your affected foot.',
      'Anchor the other end securely or hold with your other foot.',
      'Press outward into the band without letting your knee roll outward.',
      'Hold the contraction firmly for 5 seconds, then relax slowly for 2 seconds.',
    ],
    cautions: ['Ensure movement comes strictly from the subtalar joint.'],
    contraindications: ['Acute peroneal tendon subluxation'],
    defaultSets: 3,
    defaultReps: 10,
    defaultHoldSeconds: 5,
    videoIllustration: 'ankle_band',
  },
  {
    id: 'ex-towel-calf-stretch',
    name: 'Non-Weight Bearing Towel Calf Stretch',
    bodyArea: 'Ankle & Foot',
    phaseMin: 1,
    description: 'Gently elongate the gastrocnemius-soleus complex without axial compression.',
    instructions: [
      'Sit with your affected leg extended straight in front of you.',
      'Loop a towel or strap around the ball of your foot.',
      'Gently pull the towel towards your body until you feel a mild stretch in your calf.',
      'Keep your knee straight and maintain steady, slow breathing.',
    ],
    cautions: ['Do not yank forcefully. It should feel like a mild tension, never a sharp pull.'],
    contraindications: ['Acute Achilles tendon rupture'],
    defaultSets: 3,
    defaultReps: 1,
    defaultHoldSeconds: 30,
    videoIllustration: 'towel_stretch',
  },
  {
    id: 'ex-seated-rockers',
    name: 'Seated Heel-Toe Rockers',
    bodyArea: 'Ankle & Foot',
    phaseMin: 2,
    description: 'Promote gentle ankle dorsiflexion and plantarflexion in a supported seated position.',
    instructions: [
      'Sit on a firm chair with both feet flat on the floor, knees at 90 degrees.',
      'Lift your heels off the ground onto your toes, holding for 2 seconds.',
      'Lower heels and lift your toes off the ground onto your heels, holding for 2 seconds.',
      'Repeat in a smooth rhythm.',
    ],
    cautions: ['Stop if anterior ankle impingement occurs.'],
    contraindications: ['Weight-bearing restrictions from orthopedic surgeon'],
    defaultSets: 3,
    defaultReps: 15,
    defaultHoldSeconds: 2,
    videoIllustration: 'seated_rockers',
  },
  {
    id: 'ex-single-leg-balance',
    name: 'Single-Leg Stance Balance (Firm Surface)',
    bodyArea: 'Ankle & Foot',
    phaseMin: 2,
    description: 'Retrain mechanoreceptors and proprioceptive stability in the injured limb.',
    instructions: [
      'Stand near a sturdy wall or counter for safety support.',
      'Transfer body weight to your injured leg with a slight micro-bend in the knee.',
      'Lift your opposite foot 2-3 inches off the ground.',
      'Hold balance steady for 30 seconds. Tap toes down if losing balance.',
    ],
    cautions: ['Always stay within reach of support to prevent falls.'],
    contraindications: ['Non-weight-bearing status', 'Active acute dizziness'],
    defaultSets: 3,
    defaultReps: 3,
    defaultHoldSeconds: 30,
    videoIllustration: 'balance_stand',
  },
  {
    id: 'ex-quad-sets',
    name: 'Quadriceps Isometric Contractions (Quad Sets)',
    bodyArea: 'Knee',
    phaseMin: 1,
    description: 'Prevent quadriceps arthrogenic muscle inhibition after knee surgery or trauma.',
    instructions: [
      'Sit or lie flat with your injured leg extended straight.',
      'Tighten the top of your thigh muscle, pressing the back of your knee down toward the mat.',
      'Focus on contracting the VMO (inner thigh near kneecap).',
      'Hold the contraction for 6 seconds, then rest for 3 seconds.',
    ],
    cautions: ['Do not hold your breath during the isometric hold.'],
    contraindications: ['Acute patellar tendon avulsion'],
    defaultSets: 3,
    defaultReps: 12,
    defaultHoldSeconds: 6,
    videoIllustration: 'quad_sets',
  },
  {
    id: 'ex-straight-leg-raise',
    name: 'Straight Leg Raise (Supine)',
    bodyArea: 'Knee',
    phaseMin: 2,
    description: 'Build hip flexor and anterior chain stability without placing shear stress on the knee.',
    instructions: [
      'Lie flat on your back. Bend your uninjured knee with foot flat on floor.',
      'Contract your injured leg’s quad firmly to lock the knee straight.',
      'Lift the straight leg slowly to the height of the opposite knee (approx 45 degrees).',
      'Pause for 1 second at top, then lower under control.',
    ],
    cautions: ['If your knee bends or lags during the lift, return to quad sets.'],
    contraindications: ['Severe lumbar disc herniation with acute sciatica'],
    defaultSets: 3,
    defaultReps: 10,
    defaultHoldSeconds: 2,
    videoIllustration: 'straight_leg_raise',
  },
  {
    id: 'ex-hamstring-bridge',
    name: 'Glute-Hamstring Isometric Bridge',
    bodyArea: 'Hamstring & Thigh',
    phaseMin: 2,
    description: 'Activate posterior chain and pelvic stability with low elongation strain.',
    instructions: [
      'Lie on your back with knees bent at 90 degrees and feet flat on floor, hip-width apart.',
      'Drive through your heels to lift your hips toward the ceiling until knees, hips, and shoulders form a straight line.',
      'Squeeze glutes and hamstrings for 3 seconds at the top.',
      'Lower smoothly back to the floor.',
    ],
    cautions: ['Avoid overarching your lower back.'],
    contraindications: ['Acute Grade III hamstring tear within 7 days'],
    defaultSets: 3,
    defaultReps: 10,
    defaultHoldSeconds: 3,
    videoIllustration: 'glute_bridge',
  },
  {
    id: 'ex-pendulum-shoulder',
    name: 'Codman Pendulum Shoulder Exercises',
    bodyArea: 'Shoulder',
    phaseMin: 1,
    description: 'Gentle passive distraction and circulation for inflamed rotator cuff or labrum.',
    instructions: [
      'Lean forward supporting your good arm on a sturdy table.',
      'Let your injured arm dangle freely towards the floor.',
      'Use the momentum of your torso rocking gently to let the arm swing in small circles.',
      'Do not use your shoulder muscles to drive the movement; let gravity and body momentum move it.',
    ],
    cautions: ['Do not actively flex shoulder muscles.'],
    contraindications: ['Glenohumeral joint acute dislocation'],
    defaultSets: 2,
    defaultReps: 1,
    defaultHoldSeconds: 90,
    videoIllustration: 'shoulder_pendulum',
  },
  {
    id: 'ex-scapular-retraction',
    name: 'Scapular Retractions & Setting',
    bodyArea: 'Shoulder',
    phaseMin: 1,
    description: 'Restore scapulothoracic rhythm and posterior shoulder girdle tone.',
    instructions: [
      'Sit or stand tall with relaxed shoulders and arms at sides.',
      'Gently squeeze your shoulder blades back and slightly downward toward your back pockets.',
      'Hold for 5 seconds without shrugging upward toward your ears.',
      'Release slowly.',
    ],
    cautions: ['Avoid hiking shoulders up toward your neck.'],
    contraindications: ['Acute clavicle fracture'],
    defaultSets: 3,
    defaultReps: 12,
    defaultHoldSeconds: 5,
    videoIllustration: 'scapular_setting',
  },
];

const INITIAL_USERS: User[] = [
  {
    id: 'player-marcus',
    name: 'Marcus Vance',
    email: 'marcus.vance@athletes.com',
    role: 'player',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    title: 'Midfielder',
    clinic: 'Apex Sports & Orthopedic Institute',
    phone: '+1 (555) 234-8921',
    createdAt: '2026-08-15T09:00:00Z',
  },
  {
    id: 'player-elena',
    name: 'Elena Rostova',
    email: 'elena.rostova@tennis.com',
    role: 'player',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    title: 'WTA Tour Player',
    clinic: 'Apex Sports & Orthopedic Institute',
    phone: '+1 (555) 432-1188',
    createdAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'player-david',
    name: 'David Kim',
    email: 'david.kim@hoops.com',
    role: 'player',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    title: 'Point Guard',
    clinic: 'Apex Sports & Orthopedic Institute',
    phone: '+1 (555) 890-3342',
    createdAt: '2026-08-22T14:30:00Z',
  },
  {
    id: 'prof-sarah',
    name: 'Dr. Sarah Jenkins, DPT, SCS',
    email: 's.jenkins@apexsportsmed.com',
    role: 'professional',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
    title: 'Board-Certified Sports Clinical Specialist',
    clinic: 'Apex Sports & Orthopedic Institute',
    phone: '+1 (555) 019-2831',
    createdAt: '2026-07-01T08:00:00Z',
  },
  {
    id: 'prof-robert',
    name: 'Dr. Robert Lang, MD',
    email: 'r.lang@apexsportsmed.com',
    role: 'professional',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
    title: 'Orthopedic Sports Medicine Surgeon',
    clinic: 'Apex Sports & Orthopedic Institute',
    phone: '+1 (555) 019-2840',
    createdAt: '2026-07-01T08:00:00Z',
  },
  {
    id: 'admin-rachel',
    name: 'Rachel Green',
    email: 'rachel.green@replay-ai.internal',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    title: 'Clinical Operations & Safety Compliance Director',
    clinic: 'RE:PLAY Central Network',
    phone: '+1 (555) 800-7375',
    createdAt: '2026-06-15T08:00:00Z',
  },
];

const INITIAL_PLAYER_PROFILES: PlayerProfile[] = [
  {
    id: 'prof-rec-marcus',
    userId: 'player-marcus',
    sport: 'Football (Soccer)',
    position: 'Central Attacking Midfielder',
    experienceLevel: 'Professional',
    age: 24,
    gender: 'Male',
    trainingFrequency: '5-6 sessions / week',
    preferredLanguage: 'English',
    emergencyContactName: 'Laura Vance (Spouse)',
    emergencyContactPhone: '+1 (555) 234-8922',
  },
  {
    id: 'prof-rec-elena',
    userId: 'player-elena',
    sport: 'Tennis',
    position: 'Singles Player',
    experienceLevel: 'Professional',
    age: 22,
    gender: 'Female',
    trainingFrequency: '6 sessions / week',
    preferredLanguage: 'English',
  },
  {
    id: 'prof-rec-david',
    userId: 'player-david',
    sport: 'Basketball',
    position: 'Point Guard',
    experienceLevel: 'Collegiate',
    age: 26,
    gender: 'Male',
    trainingFrequency: '4 sessions / week',
    preferredLanguage: 'English',
  },
];

const INITIAL_INJURIES: Injury[] = [
  {
    id: 'inj-marcus-01',
    playerId: 'player-marcus',
    injuryType: 'Grade II High Ankle Sprain (Syndesmosis strain & ATFL partial tear)',
    injuredBodyPart: 'Right Ankle',
    injuryDate: '2026-09-02',
    severity: 'Grade II (Moderate)',
    surgeryPerformed: false,
    currentPhase: 2,
    professionalId: 'prof-sarah',
    professionalName: 'Dr. Sarah Jenkins, DPT, SCS',
    notes: 'Incurred during match tackle. MRI confirmed partial distal tibiofibular syndesmosis strain with ATFL tear; syndesmotic mortise remains stable. Non-surgical management selected.',
  },
  {
    id: 'inj-elena-01',
    playerId: 'player-elena',
    injuryType: 'Supraspinatus Tendinopathy & Subacromial Impingement',
    injuredBodyPart: 'Right Shoulder',
    injuryDate: '2026-08-25',
    severity: 'Grade I (Mild)',
    surgeryPerformed: false,
    currentPhase: 3,
    professionalId: 'prof-sarah',
    professionalName: 'Dr. Sarah Jenkins, DPT, SCS',
  },
  {
    id: 'inj-david-01',
    playerId: 'player-david',
    injuryType: 'Post-Op Partial Lateral Meniscectomy',
    injuredBodyPart: 'Left Knee',
    injuryDate: '2026-07-15',
    severity: 'Post-Surgical',
    surgeryPerformed: true,
    surgeryDate: '2026-07-20',
    surgeryDetails: 'Arthroscopic lateral partial meniscectomy, Dr. Robert Lang',
    currentPhase: 3,
    professionalId: 'prof-robert',
    professionalName: 'Dr. Robert Lang, MD',
  },
];

const INITIAL_RECOVERY_PLANS: RecoveryPlan[] = [
  {
    id: 'plan-marcus-01',
    playerId: 'player-marcus',
    professionalId: 'prof-sarah',
    professionalName: 'Dr. Sarah Jenkins, DPT, SCS',
    clinicName: 'Apex Sports & Orthopedic Institute',
    title: 'Syndesmosis & Lateral Ankle Complex Rehabilitation Plan',
    diagnosisSummary: 'Conservative rehabilitation of right high ankle sprain (Grade II syndesmosis + ATFL). Goal is restoring pain-free multi-planar mobility, progressive proprioception, and functional football return.',
    startDate: '2026-09-05',
    reviewDate: '2026-09-26',
    followUpDate: '2026-10-08',
    status: 'active',
    extractedFromDocName: 'Apex_SportsMed_MarcusVance_RehabPlan_Sep2026.pdf',
    confirmedAt: '2026-09-05T14:20:00Z',
    confirmedBy: 'Dr. Sarah Jenkins, DPT, SCS',
    createdAt: '2026-09-05T11:00:00Z',
    phases: [
      {
        id: 'phase-1',
        number: 1,
        name: 'Protection & Edema Reduction',
        goal: 'Control localized edema, protect healing syndesmotic collagen, restore gentle resting non-weight-bearing mobility.',
        allowedActivities: [
          'Cryotherapy and compression wrap 20 mins post-activity',
          'Active toe scrunches and gentle non-resisted ankle alphabet',
          'Elevated resting with limb supported above heart level',
          'Stationary bike with zero resistance in boot if authorized',
        ],
        avoidActivities: [
          'Running and jogging',
          'Jumping, bounding, or plyometrics',
          'Full barefoot weight-bearing without support boot',
          'Sudden pivoting or external ankle rotation',
        ],
        status: 'completed',
        approvedByProfessionalId: 'prof-sarah',
        approvedAt: '2026-09-15T10:00:00Z',
        minDurationWeeks: 2,
      },
      {
        id: 'phase-2',
        number: 2,
        name: 'Controlled Mobility & Early Loading',
        goal: 'Restore symmetrical dorsiflexion and eversion strength, retrain static proprioception, normalize gait in lace-up athletic brace.',
        allowedActivities: [
          'Prescribed isometric and light resistance band eversion',
          'Alphabet ankle mobility drills 2x daily',
          'Non-weight bearing calf towel stretches',
          'Seated heel-toe rockers',
          'Single-leg static balance on firm surface near support',
          'Targeted hydration (2.5L - 3.0L) and collagen/protein support',
        ],
        avoidActivities: [
          'Outdoor running and turf drills',
          'Cutting, rapid lateral direction changes, and ball striking',
          'Plyometric box jumps or landing forces',
          'End-range dorsiflexion under heavy dynamic load',
        ],
        status: 'current',
        approvedByProfessionalId: 'prof-sarah',
        approvedAt: '2026-09-15T10:00:00Z',
        minDurationWeeks: 2,
      },
      {
        id: 'phase-3',
        number: 3,
        name: 'Progressive Strength & Dynamic Balance',
        goal: 'Achieve >85% limb symmetry index in calf and peroneal endurance; introduce light treadmill jog progressions when cleared.',
        allowedActivities: [
          'Standing eccentric heel raises (double to single leg)',
          'BOSU and foam pad dynamic balance perturbation',
          'Light straight-line treadmill walk-jog intervals under clinical supervision',
        ],
        avoidActivities: ['Competitive team scrimmages', 'Max-effort sprinting', 'Tackling and unpredictable contact'],
        status: 'locked',
        minDurationWeeks: 3,
      },
      {
        id: 'phase-4',
        number: 4,
        name: 'Sport-Specific Training & Agility',
        goal: 'Tolerate multi-directional cutting, high-speed deceleration, and ball control drills without reactive swelling.',
        allowedActivities: [
          'Cone cutting drills (45 to 90 degrees)',
          'Shuttle runs with reactive braking',
          'Passing drills and technical ball mastery',
        ],
        avoidActivities: ['Full contact match play without clinical clearance'],
        status: 'locked',
        minDurationWeeks: 2,
      },
      {
        id: 'phase-5',
        number: 5,
        name: 'Return-to-Play Clearance & Match Readiness',
        goal: 'Pass comprehensive return-to-sport testing battery (Y-balance, triple hop for distance, psych readiness score).',
        allowedActivities: ['Full squad training', 'Reserve match minutes with protective taping'],
        avoidActivities: ['Over-scheduling consecutive 90-minute fixtures'],
        status: 'locked',
        minDurationWeeks: 2,
      },
    ],
    prescribedExercises: [
      {
        id: 'presc-01',
        recoveryPlanId: 'plan-marcus-01',
        exerciseId: 'ex-ankle-alphabet',
        name: 'Ankle Alphabet Range of Motion',
        bodyArea: 'Ankle & Foot',
        phaseNumber: 2,
        frequency: 'Twice daily',
        sets: 2,
        reps: 1,
        durationSeconds: 120,
        instructions: 'Trace uppercase letters A to Z with your big toe while seated with leg elevated. Slow and deliberate.',
        cautions: 'Keep knee and hip still; do not force end-range outward rotation if pinching occurs.',
        timing: 'morning',
        approvalStatus: 'approved',
      },
      {
        id: 'presc-02',
        recoveryPlanId: 'plan-marcus-01',
        exerciseId: 'ex-ankle-iso-ever',
        name: 'Isometric Ankle Eversion with Band',
        bodyArea: 'Ankle & Foot',
        phaseNumber: 2,
        frequency: 'Daily',
        sets: 3,
        reps: 10,
        holdSeconds: 5,
        instructions: 'Push outward against looped resistance band. Hold 5s firm, relax 2s.',
        cautions: 'Movement strictly from the ankle. Do not roll the knee outward.',
        timing: 'morning',
        approvalStatus: 'approved',
      },
      {
        id: 'presc-03',
        recoveryPlanId: 'plan-marcus-01',
        exerciseId: 'ex-towel-calf-stretch',
        name: 'Non-Weight Bearing Towel Calf Stretch',
        bodyArea: 'Ankle & Foot',
        phaseNumber: 2,
        frequency: 'Twice daily',
        sets: 3,
        reps: 1,
        holdSeconds: 30,
        instructions: 'Gently draw the towel toward your chest keeping your knee extended until a comfortable calf stretch is felt.',
        cautions: 'Maintain smooth, steady breathing. Never bounce or pull into acute pain.',
        timing: 'evening',
        approvalStatus: 'approved',
      },
      {
        id: 'presc-04',
        recoveryPlanId: 'plan-marcus-01',
        exerciseId: 'ex-seated-rockers',
        name: 'Seated Heel-Toe Rockers',
        bodyArea: 'Ankle & Foot',
        phaseNumber: 2,
        frequency: 'Daily',
        sets: 3,
        reps: 15,
        holdSeconds: 2,
        instructions: 'In a chair with feet flat, lift heels onto toes (hold 2s), then drop heels and lift toes (hold 2s).',
        cautions: 'Smooth rhythmic cadence without jerking.',
        timing: 'evening',
        approvalStatus: 'approved',
      },
      {
        id: 'presc-05',
        recoveryPlanId: 'plan-marcus-01',
        exerciseId: 'ex-single-leg-balance',
        name: 'Single-Leg Stance Balance (Firm Surface)',
        bodyArea: 'Ankle & Foot',
        phaseNumber: 2,
        frequency: 'Daily',
        sets: 3,
        reps: 3,
        holdSeconds: 30,
        instructions: 'Stand on injured right foot near wall for safety. Slight microbend in knee. Hold 30s.',
        cautions: 'Keep hand hovered near countertop or wall to catch balance if needed.',
        timing: 'morning',
        approvalStatus: 'approved',
      },
    ],
    generalInstructions: [
      'Wear supportive pneumatic ankle brace during all prolonged ambulation and standing tasks.',
      'Apply cryotherapy (ice pack with barrier cloth) for 15-20 minutes following rehabilitation exercises if warm to touch.',
      'Strictly avoid running or impact drills until formal clinical reassessment.',
      'Log daily pain, swelling, and exercise completion in the RE:PLAY app for continuous physio monitoring.',
    ],
    restrictions: [
      'NO running, jogging, or sprint mechanics.',
      'NO jumping, hopping, or drop landings.',
      'NO ball kicking or high-torque cutting maneuvers.',
      'NO barefoot walking on uneven surfaces or stairs without brace.',
    ],
    nutritionInstructions: [
      'Maintain daily protein intake at 1.8g - 2.0g per kg body weight to optimize soft tissue collagen remodeling.',
      'Incorporate Vitamin C (500mg) and dietary leucine 30 minutes prior to tendon/ligament loading exercises.',
      'Prioritize anti-inflammatory whole foods (berries, fatty fish, leafy greens, turmeric).',
    ],
    hydrationGuidelines: 'Target 2.8 - 3.2 liters of water daily with balanced electrolytes.',
    warningSigns: [
      'Sudden inability to bear weight on the right leg',
      'Resting pain exceeding 6/10 or sharp nocturnal awakening pain',
      'Rapidly escalating localized swelling or gross discoloration',
      'Calf pain, tenderness, heat, or asymmetric swelling (requires immediate DVT clinical exclusion)',
      'Tingling, numbness, or loss of sensation in toes or dorsal foot',
    ],
  },
];

// Seed 14 days of realistic daily check-ins for Marcus Vance
const generateMarcusCheckins = (): DailyCheckin[] => {
  const checkins: DailyCheckin[] = [];
  const baseDate = new Date('2026-09-09');

  const history = [
    { day: 0, pain: 6, swelling: 'moderate' as const, mobility: 'same' as const, fatigue: 6, sleep: 7.0, sleepQ: 6, hydro: 2.4, compl: 'partially_completed' as const, resp: 'mild_discomfort' as const, mood: 6, note: 'Ankle felt tight upon waking, used ice wrap.' },
    { day: 1, pain: 5, swelling: 'moderate' as const, mobility: 'same' as const, fatigue: 5, sleep: 7.5, sleepQ: 7, hydro: 2.6, compl: 'completed' as const, resp: 'comfortable' as const, mood: 7, note: 'Completed morning alphabet without issues.' },
    { day: 2, pain: 5, swelling: 'mild' as const, mobility: 'better' as const, fatigue: 4, sleep: 8.0, sleepQ: 8, hydro: 2.8, compl: 'completed' as const, resp: 'comfortable' as const, mood: 8, note: 'Walking felt slightly more natural in the brace.' },
    { day: 3, pain: 4, swelling: 'mild' as const, mobility: 'better' as const, fatigue: 4, sleep: 7.8, sleepQ: 8, hydro: 3.0, compl: 'completed' as const, resp: 'comfortable' as const, mood: 8, note: 'Single leg balance was steady today.' },
    { day: 4, pain: 4, swelling: 'mild' as const, mobility: 'better' as const, fatigue: 5, sleep: 7.2, sleepQ: 7, hydro: 2.7, compl: 'completed' as const, resp: 'mild_discomfort' as const, mood: 7, note: 'Slight soreness after evening towel stretch.' },
    { day: 5, pain: 4, swelling: 'mild' as const, mobility: 'same' as const, fatigue: 4, sleep: 7.5, sleepQ: 7, hydro: 2.9, compl: 'completed' as const, resp: 'comfortable' as const, mood: 8, note: 'Good session, practiced band eversion.' },
    { day: 6, pain: 3, swelling: 'mild' as const, mobility: 'better' as const, fatigue: 3, sleep: 8.2, sleepQ: 9, hydro: 3.1, compl: 'completed' as const, resp: 'comfortable' as const, mood: 9, note: 'Best morning so far. Zero pain at rest.' },
    { day: 7, pain: 3, swelling: 'mild' as const, mobility: 'better' as const, fatigue: 4, sleep: 7.5, sleepQ: 8, hydro: 2.2, compl: 'completed' as const, resp: 'comfortable' as const, mood: 8, note: 'Forgot my water bottle at home, drank less water today.' },
    { day: 8, pain: 3, swelling: 'none' as const, mobility: 'better' as const, fatigue: 3, sleep: 8.0, sleepQ: 8, hydro: 2.8, compl: 'completed' as const, resp: 'comfortable' as const, mood: 9, note: 'Swelling visibly reduced around lateral malleolus.' },
    { day: 9, pain: 3, swelling: 'none' as const, mobility: 'better' as const, fatigue: 3, sleep: 7.8, sleepQ: 8, hydro: 3.0, compl: 'completed' as const, resp: 'comfortable' as const, mood: 8, note: 'Balanced for 30s each rep without grabbing wall.' },
    { day: 10, pain: 4, swelling: 'mild' as const, mobility: 'same' as const, fatigue: 5, sleep: 7.0, sleepQ: 6, hydro: 2.7, compl: 'completed' as const, resp: 'mild_discomfort' as const, mood: 7, note: 'Went for longer grocery walk with family, ankle a bit tired.' },
    { day: 11, pain: 5, swelling: 'mild' as const, mobility: 'same' as const, fatigue: 5, sleep: 6.8, sleepQ: 6, hydro: 2.6, compl: 'completed' as const, resp: 'increased_pain' as const, mood: 6, note: 'Felt an increase in outer ankle ache after calf stretch. Caution alert generated.' },
    { day: 12, pain: 3, swelling: 'mild' as const, mobility: 'better' as const, fatigue: 4, sleep: 8.0, sleepQ: 8, hydro: 3.0, compl: 'completed' as const, resp: 'comfortable' as const, mood: 8, note: 'Pain settled right back down after resting and icing.' },
    { day: 13, pain: 2, swelling: 'none' as const, mobility: 'better' as const, fatigue: 3, sleep: 8.1, sleepQ: 9, hydro: 3.0, compl: 'completed' as const, resp: 'comfortable' as const, mood: 9, note: 'Feeling strong. Ankle feels confident in stance.' },
  ];

  history.forEach((h, index) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + h.day);
    const dateStr = d.toISOString().split('T')[0];

    checkins.push({
      id: `chk-marcus-${index + 1}`,
      playerId: 'player-marcus',
      date: dateStr,
      pain: h.pain,
      swelling: h.swelling,
      mobility: h.mobility,
      fatigue: h.fatigue,
      sleepHours: h.sleep,
      sleepQuality: h.sleepQ,
      hydrationLiters: h.hydro,
      exerciseCompletion: h.compl,
      exerciseResponse: h.resp,
      mood: h.mood,
      notes: h.note,
      safetyFlagTriggered: h.resp === 'increased_pain' || h.pain >= 5,
      safetyFlagSeverity: h.resp === 'increased_pain' ? 'caution' : h.pain >= 5 ? 'info' : 'none',
      safetyFlagMessage: h.resp === 'increased_pain' ? 'Post-exercise discomfort increased over baseline.' : undefined,
      loggedAt: `${dateStr}T19:30:00Z`,
    });
  });

  return checkins;
};

const INITIAL_CHECKINS = generateMarcusCheckins();

const INITIAL_RECOVERY_SCORES: RecoveryScore[] = [
  {
    id: 'score-marcus-latest',
    playerId: 'player-marcus',
    date: '2026-09-22',
    overallScore: 82,
    adherenceScore: 92,
    sleepScore: 84,
    painTrendScore: 80,
    mobilityScore: 85,
    hydrationScore: 88,
    consistencyScore: 90,
    readinessLevel: 'Moderate',
    readinessAdvice: "Today's recovery indicators suggest maintaining your current professional-approved activity level. Progressing safely in Phase 2.",
  },
];

const INITIAL_ALERTS: SafetyAlert[] = [
  {
    id: 'alert-01',
    playerId: 'player-marcus',
    playerName: 'Marcus Vance',
    injuryName: 'High Ankle Sprain (Right)',
    severity: 'caution',
    type: 'Post-Exercise Symptom Flare',
    message: 'Marcus logged "Increased Pain" and a pain jump to 5/10 following evening calf stretches on Day 12.',
    recommendedAction: 'Advise athlete to ease stretch tension. Symptoms resolved to 3/10 following rest and cryotherapy.',
    status: 'acknowledged',
    createdAt: '2026-09-20T20:15:00Z',
    resolvedBy: 'Dr. Sarah Jenkins, DPT, SCS',
    resolutionNote: 'Reviewed via in-app note. Guided Marcus to avoid end-range over-pulling on towel.',
  },
  {
    id: 'alert-02',
    playerId: 'player-marcus',
    playerName: 'Marcus Vance',
    injuryName: 'High Ankle Sprain (Right)',
    severity: 'info',
    type: 'Hydration Target Under-delivery',
    message: 'Hydration logged below 2.5L clinical guideline on 2026-09-16 (2.2L recorded).',
    recommendedAction: 'Automated hydration reminder dispatched. Recovered on subsequent days.',
    status: 'resolved',
    createdAt: '2026-09-16T21:00:00Z',
    resolvedAt: '2026-09-17T08:00:00Z',
    resolvedBy: 'System Automated Rule',
  },
];

const INITIAL_PROFESSIONAL_NOTES: ProfessionalNote[] = [
  {
    id: 'pnote-01',
    playerId: 'player-marcus',
    professionalId: 'prof-sarah',
    professionalName: 'Dr. Sarah Jenkins, DPT, SCS',
    note: 'Marcus is progressing well through Week 3. Synergistic balance stability is ahead of schedule. We will test dorsiflexion weight-bearing lunge symmetry at next in-clinic follow-up on Oct 8 before unlocking Phase 3.',
    visibility: 'shared_with_player',
    createdAt: '2026-09-21T11:30:00Z',
  },
  {
    id: 'pnote-02',
    playerId: 'player-marcus',
    professionalId: 'prof-sarah',
    professionalName: 'Dr. Sarah Jenkins, DPT, SCS',
    note: 'Internal Clinical Audit: Syndesmotic squeeze test was negative at last visit. Palpation of AITFL shows minimal tenderness. Cleared to continue Phase 2 home exercise protocol.',
    visibility: 'clinical_only',
    createdAt: '2026-09-15T15:00:00Z',
  },
];

const INITIAL_RETURN_CHECKPOINTS: ReturnToPlayCheckpoint[] = [
  {
    id: 'rtp-01',
    playerId: 'player-marcus',
    category: 'Pain & Swelling',
    name: 'Resting Pain ≤ 1/10 & Zero Effusion Post-Load',
    criteria: '48 consecutive hours of zero reactive ankle effusion and resting pain not exceeding 1/10.',
    status: 'cleared',
    professionalNotes: 'Achieved during Week 2-3 monitoring.',
    updatedAt: '2026-09-21T10:00:00Z',
  },
  {
    id: 'rtp-02',
    playerId: 'player-marcus',
    category: 'Range of Motion',
    name: 'Weight-Bearing Lunge Test (Dorsiflexion Symmetry)',
    criteria: 'Knee-to-wall distance within 10% of uninjured left limb (target ≥ 10 cm without heel lift).',
    status: 'needs_work',
    professionalNotes: 'Current right ankle is at 7.5 cm vs 11.0 cm on left. Working on calf compliance.',
    updatedAt: '2026-09-20T09:00:00Z',
  },
  {
    id: 'rtp-03',
    playerId: 'player-marcus',
    category: 'Strength & Endurance',
    name: 'Single-Leg Heel Raise Repetition Max (≥ 25 reps)',
    criteria: 'Perform 25 unbroken controlled single-leg heel raises matching uninjured limb cadence.',
    status: 'pending',
    professionalNotes: 'Phase 3 progression prerequisite.',
    updatedAt: '2026-09-15T09:00:00Z',
  },
  {
    id: 'rtp-04',
    playerId: 'player-marcus',
    category: 'Balance & Proprioception',
    name: 'Y-Balance Test Composite Score > 95%',
    criteria: 'Anterior, posteromedial, and posterolateral excursion within 4cm of contralateral limb.',
    status: 'pending',
    professionalNotes: 'Scheduled for Phase 4 assessment.',
    updatedAt: '2026-09-15T09:00:00Z',
  },
  {
    id: 'rtp-05',
    playerId: 'player-marcus',
    category: 'Sport-Specific Drills',
    name: 'T-Drill & Illinois Agility Tolerance at 100% Speed',
    criteria: 'Complete repeated agility shuttle with no compensatory gait or post-drill apprehension.',
    status: 'pending',
    professionalNotes: 'Phase 4 milestone.',
    updatedAt: '2026-09-15T09:00:00Z',
  },
  {
    id: 'rtp-06',
    playerId: 'player-marcus',
    category: 'Clinical Clearance',
    name: 'Multi-Disciplinary Medical Clearance Sign-Off',
    criteria: 'Formal clinical sign-off by Dr. Sarah Jenkins (PT) and Team Physician Dr. Robert Lang.',
    status: 'pending',
    professionalNotes: 'Final barrier before match day roster selection.',
    updatedAt: '2026-09-15T09:00:00Z',
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-01',
    userId: 'prof-sarah',
    userName: 'Dr. Sarah Jenkins, DPT, SCS',
    role: 'professional',
    action: 'CONFIRM_RECOVERY_PLAN',
    details: 'Reviewed and confirmed extracted recovery plan for athlete Marcus Vance (plan-marcus-01).',
    timestamp: '2026-09-05T14:20:00Z',
  },
  {
    id: 'audit-02',
    userId: 'prof-sarah',
    userName: 'Dr. Sarah Jenkins, DPT, SCS',
    role: 'professional',
    action: 'APPROVE_PHASE_PROGRESSION',
    details: 'Approved progression of Marcus Vance from Phase 1 (Protection) to Phase 2 (Controlled Mobility).',
    timestamp: '2026-09-15T10:00:00Z',
  },
  {
    id: 'audit-03',
    userId: 'prof-sarah',
    userName: 'Dr. Sarah Jenkins, DPT, SCS',
    role: 'professional',
    action: 'ACKNOWLEDGE_SAFETY_ALERT',
    details: 'Acknowledged post-exercise symptom flare alert on Day 12 for Marcus Vance.',
    timestamp: '2026-09-20T21:00:00Z',
  },
];

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read existing DB file, seeding new database:', e);
    }

    const initial: DatabaseSchema = {
      users: INITIAL_USERS,
      playerProfiles: INITIAL_PLAYER_PROFILES,
      injuries: INITIAL_INJURIES,
      recoveryPlans: INITIAL_RECOVERY_PLANS,
      dailyCheckins: INITIAL_CHECKINS,
      exerciseLogs: [],
      recoveryScores: INITIAL_RECOVERY_SCORES,
      safetyAlerts: INITIAL_ALERTS,
      professionalNotes: INITIAL_PROFESSIONAL_NOTES,
      auditLogs: INITIAL_AUDIT_LOGS,
      returnToCheckpoints: INITIAL_RETURN_CHECKPOINTS,
      exerciseLibrary: INITIAL_EXERCISES,
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database file:', err);
    }
  }

  public get<K extends keyof DatabaseSchema>(table: K): DatabaseSchema[K] {
    return this.data[table];
  }

  public set<K extends keyof DatabaseSchema>(table: K, value: DatabaseSchema[K]) {
    this.data[table] = value;
    this.saveData(this.data);
  }

  public resetDemoData() {
    const initial: DatabaseSchema = {
      users: INITIAL_USERS,
      playerProfiles: INITIAL_PLAYER_PROFILES,
      injuries: INITIAL_INJURIES,
      recoveryPlans: INITIAL_RECOVERY_PLANS,
      dailyCheckins: INITIAL_CHECKINS,
      exerciseLogs: [],
      recoveryScores: INITIAL_RECOVERY_SCORES,
      safetyAlerts: INITIAL_ALERTS,
      professionalNotes: INITIAL_PROFESSIONAL_NOTES,
      auditLogs: INITIAL_AUDIT_LOGS,
      returnToCheckpoints: INITIAL_RETURN_CHECKPOINTS,
      exerciseLibrary: INITIAL_EXERCISES,
    };
    this.data = initial;
    this.saveData(initial);
    return initial;
  }
}

export const db = new DatabaseManager();
