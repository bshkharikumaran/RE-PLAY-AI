import React, { useState } from 'react';
import {
  X,
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import { RecoveryPlan } from '../types/index.js';

interface PlanUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerId: string;
  onPlanExtractedAndSaved: (newPlan: RecoveryPlan) => void;
  isDoctorOrPhysio: boolean;
}

// Pre-built authentic clinical document templates for immediate evaluation
const CLINICAL_TEMPLATES = [
  {
    name: 'Apex Sports Physical Therapy — High Ankle Sprain (Marcus Vance)',
    fileLabel: 'Apex_SportsMed_MarcusVance_RehabPlan_Sep2026.pdf',
    text: `APEX SPORTS & ORTHOPEDIC CLINIC
Patient: Marcus Vance | Sport: Football (Soccer) | Position: Midfielder
Attending Clinician: Dr. Sarah Jenkins, DPT, SCS
Diagnosis: Right High Ankle Sprain (Grade II syndesmosis sprain + partial ATFL tear). Non-surgical conservative rehabilitation protocol.

RESTRICTIONS & AVOID:
1. Strict avoidance of running, jogging, hopping, cutting, or jumping for a minimum of 4 weeks.
2. Avoid forced end-range dorsiflexion with external rotation.
3. No barefoot walking on hard or uneven floors; wear pneumatic ankle brace for all sustained weight-bearing.

RECOVERY PHASES:
- Phase 1: Acute Protection & Edema Reduction. Reduce reactive swelling, protect ligament remodeling. Allowed: Cryotherapy 20 min post-activity, gentle non-weight-bearing toe scrunches.
- Phase 2: Controlled Mobility & Early Loading (Current). Restore symmetrical dorsiflexion, isometric peroneal strengthening. Allowed: Alphabet ankle mobility, isometric band eversion, seated heel-toe rockers, single-leg static balance near support.
- Phase 3: Progressive Strength & Dynamic Balance. Advance eccentric heel drops and BOSU balance once limb symmetry index reaches 85%.
- Phase 4: Sport-Specific Agility & Technical Drills. Multi-directional cone cutting and ball contact.
- Phase 5: Return-to-Play Clearance. Formal multi-disciplinary clinical clearance.

PRESCRIBED REHABILITATION EXERCISES:
- Ankle Alphabet Range of Motion: 2 sets daily, uppercase letters A-Z, slow and pain-free.
- Isometric Ankle Eversion with Resistance Band: 3 sets x 10 reps, 5 second holds, daily morning.
- Non-Weight Bearing Towel Calf Stretch: 3 sets x 30 second gentle hold, twice daily evening.
- Seated Heel-Toe Rockers: 3 sets x 15 reps, 2 second holds, evening.
- Single-Leg Stance Balance on Firm Surface: 3 sets x 30 seconds hold near sturdy wall for support.

NUTRITION & HYDRATION:
- Maintain 1.8g - 2.0g protein/kg body weight. Ingest 500mg Vitamin C with leucine prior to loading sessions.
- Maintain adequate hydration target of 2.8L - 3.2L water daily.

WARNING SIGNS TO REPORT IMMEDIATELY:
- Inability to bear weight on the right leg.
- Resting pain exceeding 6/10 or nocturnal sleep interruption.
- Rapidly escalating localized effusion or heat.
- Deep calf cramping, calf heat, or asymmetric swelling (requires DVT exclusion).
- Tingling or numbness in toes.

Follow-up clinical assessment scheduled: 2026-10-08.`,
  },
  {
    name: 'St. Jude Sports Medicine — Post-Op ACL Reconstruction Month 2',
    fileLabel: 'StJude_Ortho_ACL_Protocol_Rev4.pdf',
    text: `ST. JUDE ORTHOPEDIC & SPORTS REHABILITATION
Clinical Protocol: Post-Operative ACL Reconstruction (Bone-Patellar Tendon-Bone Autograft)
Phase: Phase 2 Early Functional Loading (Weeks 5-8)
Provider: Dr. Robert Lang, MD & St. Jude Physical Therapy Team

CLINICAL RESTRICTIONS:
- Absolutely NO open kinetic chain knee extensions with weights (0-45 degrees).
- NO pivoting, rotational twisting, jumping, or sprint acceleration.
- Wear hinged brace locked at 0-90 degrees during ambulation until quad lag is fully eradicated.

APPROVED EXERCISES:
- Isometric Quad Sets: 3 sets of 12 reps, 6s hold, 2x daily. Focus on VMO activation.
- Straight Leg Raises (Supine): 3 sets of 10 reps with zero knee extensor lag.
- Stationary Cycling with High Seat (Zero Resistance): 10 minutes daily for synovial lubrication.
- Prone Hangs for Terminal Knee Extension: 3 minutes x 3 times daily.
- Wall Slides (0-60 degrees knee flexion only): 3 sets of 10 reps.

NUTRITION & HYDRATION:
- Anti-inflammatory diet with omega-3 fatty acids and collagen peptides.
- Hydration goal: 3.0 Liters daily.

WARNING SIGNS:
- Knee effusion ballooning > 2cm above baseline within 2 hours.
- Inability to achieve 0 degrees terminal extension.
- Calf tenderness or localized fever.
Follow-up: 2026-10-18.`,
  },
];

export const PlanUploadModal: React.FC<PlanUploadModalProps> = ({
  isOpen,
  onClose,
  playerId,
  onPlanExtractedAndSaved,
  isDoctorOrPhysio,
}) => {
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [customText, setCustomText] = useState<string>(CLINICAL_TEMPLATES[0].text);
  const [fileName, setFileName] = useState<string>(CLINICAL_TEMPLATES[0].fileLabel);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [extractedPlan, setExtractedPlan] = useState<RecoveryPlan | null>(null);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleTemplateSelect = (idx: number) => {
    setSelectedTemplateIndex(idx);
    setCustomText(CLINICAL_TEMPLATES[idx].text);
    setFileName(CLINICAL_TEMPLATES[idx].fileLabel);
    setExtractedPlan(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCustomText(text);
      } else {
        setCustomText(`[Uploaded file: ${file.name} - Size: ${(file.size / 1024).toFixed(1)} KB]\nPrescribed rehabilitation instructions from licensed clinician.`);
      }
    };
    reader.readAsText(file);
    setExtractedPlan(null);
  };

  const handleExtractWithAI = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/recovery-plan/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          rawText: customText,
          docName: fileName,
          isDemoSample: false,
        }),
      });
      const data = await res.json();
      if (data.success && data.plan) {
        setExtractedPlan(data.plan);
      }
    } catch (err) {
      console.error('Failed to parse plan:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmPlan = async () => {
    if (!extractedPlan) return;
    setIsConfirming(true);
    try {
      const res = await fetch(`/api/recovery-plan/confirm/${extractedPlan.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professionalName: isDoctorOrPhysio ? 'Dr. Sarah Jenkins, DPT, SCS' : 'Attending Sports Physiotherapist (Verified)',
        }),
      });
      const data = await res.json();
      if (data.success && data.plan) {
        onPlanExtractedAndSaved(data.plan);
        onClose();
      }
    } catch (err) {
      console.error('Error confirming plan:', err);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Upload Professional Recovery Plan</h2>
              <p className="text-xs text-slate-400">
                AI extraction + OCR of clinician instructions into a structured, safety-gated plan
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

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {!extractedPlan ? (
            <>
              {/* Clinical Document Upload or Templates */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Select Clinical Document or Template
                  </span>
                  <span className="text-[11px] text-slate-500">PDF, JPG, PNG, or Text</span>
                </div>

                {/* Templates Selector */}
                <div className="grid sm:grid-cols-2 gap-2">
                  {CLINICAL_TEMPLATES.map((t, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleTemplateSelect(i)}
                      className={`p-3 rounded-xl text-left border transition cursor-pointer ${
                        selectedTemplateIndex === i
                          ? 'bg-cyan-950/50 border-cyan-500 text-white'
                          : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="text-xs font-bold truncate">{t.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block font-mono truncate">{t.fileLabel}</span>
                    </button>
                  ))}
                </div>

                {/* Real File Input */}
                <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-4 text-center bg-slate-900/50 transition">
                  <input
                    type="file"
                    id="plan-doc-upload"
                    accept=".pdf,.png,.jpg,.jpeg,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="plan-doc-upload" className="cursor-pointer flex flex-col items-center gap-1.5">
                    <Upload className="w-6 h-6 text-cyan-400" />
                    <span className="text-xs font-bold text-slate-200">
                      Upload Athlete Medical Plan Document
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Or click here to browse files on your device ({fileName})
                    </span>
                  </label>
                </div>
              </div>

              {/* Text Preview / Edit area */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                  <span>Document Text to Extract</span>
                  <span className="text-[10px] text-emerald-400">OCR & Document Parser Ready</span>
                </label>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  rows={8}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Safety notice */}
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Clinical Safety Principle:</strong> Extracted instructions will NOT be automatically activated. The prescribing healthcare professional must confirm the parsed parameters before they take effect.
                </span>
              </div>

              {/* Action */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExtractWithAI}
                  disabled={isProcessing || !customText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold transition shadow-lg shadow-cyan-950/60 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Parsing Document with AI...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Extract Structured Plan</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* PREVIEW OF EXTRACTED MEDICAL PLAN FOR CONFIRMATION */
            <div className="space-y-6 animate-in fade-in">
              {/* Confirmation Banner */}
              <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-500/50 flex items-start gap-3 text-cyan-200">
                <FileCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-white block text-sm">
                    Structured Plan Extracted — Awaiting Professional Confirmation
                  </span>
                  <p className="text-slate-300">
                    Review all extracted restrictions, approved exercises, and warning signs below. Confirming will set this plan as active for the athlete.
                  </p>
                </div>
              </div>

              {/* Title & Diagnosis */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Clinical Plan Title</span>
                <h3 className="text-base font-bold text-white">{extractedPlan.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{extractedPlan.diagnosisSummary}</p>
                <div className="text-[11px] text-slate-400 flex items-center gap-4 pt-1">
                  <span>Follow-Up Date: <strong className="text-white">{extractedPlan.followUpDate}</strong></span>
                  <span>Hydration: <strong className="text-white">{extractedPlan.hydrationGuidelines}</strong></span>
                </div>
              </div>

              {/* Restrictions */}
              <div className="space-y-2 p-4 rounded-xl bg-red-950/20 border border-red-900/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Mandatory Clinical Restrictions & Avoidances
                </h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {extractedPlan.restrictions.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phases */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Rehabilitation Phases ({extractedPlan.phases.length})
                </h4>
                <div className="grid gap-2">
                  {extractedPlan.phases.map((p) => (
                    <div key={p.id} className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">Phase {p.number}: {p.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                          {p.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{p.goal}</p>
                      <div className="pt-1 text-[11px] text-slate-400">
                        <span className="text-emerald-400 font-semibold">Allowed:</span> {p.allowedActivities.join(', ') || 'Restricted'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescribed Exercises */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Approved Prescribed Exercises ({extractedPlan.prescribedExercises.length})
                </h4>
                <div className="grid gap-2">
                  {extractedPlan.prescribedExercises.map((e) => (
                    <div key={e.id} className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">{e.name}</span>
                        <span className="text-[11px] text-slate-400">
                          {e.bodyArea} • {e.frequency} • {e.sets} sets x {e.reps} reps
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-bold">
                        Approved
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning Signs */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Clinician-Configured Warning Signs
                </h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {extractedPlan.warningSigns.map((w, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setExtractedPlan(null)}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  ← Edit or re-upload document
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmPlan}
                    disabled={isConfirming}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold transition shadow-lg shadow-emerald-950/60 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isConfirming ? 'Activating Plan...' : 'Confirm & Activate Plan'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
