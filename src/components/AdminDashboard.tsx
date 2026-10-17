import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Users,
  ShieldCheck,
  FileCheck2,
  Database,
  Search,
  CheckCircle2,
  RotateCcw,
  AlertTriangle,
  Lock,
  Eye
} from 'lucide-react';
import { User, AuditLog, Exercise } from '../types/index.js';

interface AdminDashboardProps {
  onResetDemo: () => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onResetDemo }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [exerciseLibrary, setExerciseLibrary] = useState<Exercise[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'library' | 'audit' | 'safety'>('users');
  const [isResetting, setIsResetting] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [uRes, aRes, eRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/admin/audit-logs'),
        fetch('/api/exercises/library'),
      ]);
      const [uData, aData, eData] = await Promise.all([uRes.json(), aRes.json(), eRes.json()]);
      setUsers(uData);
      setAuditLogs(aData);
      setExerciseLibrary(eData);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all demo state back to default seed data?')) {
      setIsResetting(true);
      await onResetDemo();
      await fetchData();
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-purple-400">
                Compliance & System Operations
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40">
                Rachel Green (Admin)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              Platform Administration & Clinical Governance
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isResetting ? 'Resetting...' : 'Reset Demo Environment'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'users' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            User Governance ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'audit' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Clinical Audit Trail ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'library' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Master Exercise Library ({exerciseLibrary.length})
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'safety' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Safety Rule Engine Settings
          </button>
        </div>
      </div>

      {/* Tab 1: Users */}
      {activeTab === 'users' && (
        <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Registered Users & Role Credentials</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Organization / Position</th>
                  <th className="p-3">Verification</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/40">
                    <td className="p-3">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{u.email}</div>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        u.role === 'professional'
                          ? 'bg-cyan-950 text-cyan-400 border-cyan-500/40'
                          : u.role === 'admin'
                          ? 'bg-purple-950 text-purple-400 border-purple-500/40'
                          : 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">
                      {u.title || u.clinic || 'Apex Institute'}
                    </td>
                    <td className="p-3">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Licensed & Verified
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-slate-400 text-[11px]">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">System & Clinical Verification Audit Log</h3>
            <span className="text-xs text-slate-500 font-mono">Immutable Log Stream</span>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold border border-slate-700">
                      {log.action}
                    </span>
                    <span className="font-bold text-white">{log.userName}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Master Exercise Library */}
      {activeTab === 'library' && (
        <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Approved Sports Rehabilitation Exercise Library</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {exerciseLibrary.map((ex) => (
              <div key={ex.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{ex.name}</h4>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40">
                    {ex.bodyArea}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{ex.instructions}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800">
                  <span>Target: {ex.defaultSets} sets × {ex.defaultReps || '10'} reps</span>
                  <span className="text-emerald-400 font-semibold">{ex.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Safety Rule Engine Settings */}
      {activeTab === 'safety' && (
        <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Deterministic Clinical Safety Engine Guardrails</h3>
            <p className="text-xs text-slate-400">
              Configured threshold triggers that run ahead of all AI models to prevent unsafe exertion.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="font-bold text-rose-400 block">Severe Pain Threshold (&gt;= 7/10)</span>
              <p className="text-slate-400 leading-relaxed">
                Immediately blocks workout clearance. Flags urgent alert and instructs athlete to cease loading and contact attending clinic.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="font-bold text-rose-400 block">Emergency Red Flags Intercept</span>
              <p className="text-slate-400 leading-relaxed">
                Scans subjective notes for respiratory distress, chest pain, syncope, or calf swelling. Forces immediate 911 / emergency assistance prompt.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 block">Severe Swelling / Effusion</span>
              <p className="text-slate-400 leading-relaxed">
                Mandates rest and elevation protocol. Restricts next-phase exercise unlocks until clinician reassessment.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="font-bold text-cyan-400 block">Clinician-Gated Phase Advancement</span>
              <p className="text-slate-400 leading-relaxed">
                AI is hard-coded to refuse self-advancing phases. Only licensed physical therapists or orthopedic physicians can unlock higher-tier phases.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
