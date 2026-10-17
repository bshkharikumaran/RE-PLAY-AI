import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  ShieldCheck,
  AlertTriangle,
  Info,
  Activity,
  UserCheck,
  CheckCircle2,
  PhoneCall,
  Bot
} from 'lucide-react';
import { RecoveryPlan } from '../types/index.js';

interface ChatMessage {
  id: string;
  sender: 'athlete' | 'coach';
  text: string;
  responseType?: string;
  basedOn?: string[];
  action?: string;
  warningLevel?: 'none' | 'info' | 'caution' | 'urgent';
  professionalReviewRequired?: boolean;
  timestamp: string;
}

interface ReplayCoachChatProps {
  playerId: string;
  activePlan: RecoveryPlan | null;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'coach',
    text: "Welcome back, Marcus. I am RE:PLAY Coach, your professional-guided recovery assistant. I'm actively monitoring your rehabilitation plan supervised by Dr. Sarah Jenkins (Phase 2: Controlled Mobility). How is your right ankle feeling today?",
    responseType: 'recovery_guidance',
    basedOn: ['doctor_recovery_plan', 'current_phase_restrictions'],
    action: 'Review today’s morning mobility session or ask any recovery question.',
    warningLevel: 'none',
    professionalReviewRequired: false,
    timestamp: '9:00 AM',
  },
];

const SUGGESTED_CHIPS = [
  'Can I play football this weekend?',
  'My ankle felt stiff after this morning’s exercises.',
  'Why do I need to avoid running right now?',
  'What should I do if my swelling increases tonight?',
];

export const ReplayCoachChat: React.FC<ReplayCoachChatProps> = ({ playerId, activePlan }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'athlete',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.sender === 'athlete' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }));

      const res = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          message: query,
          history: historyPayload,
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `msg-coach-${Date.now()}`,
        sender: 'coach',
        text: data.message || 'Please follow your prescribed exercises and consult your physiotherapist.',
        responseType: data.response_type,
        basedOn: data.based_on,
        action: data.action,
        warningLevel: data.warning_level,
        professionalReviewRequired: data.professional_review_required,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Failed to query RE:PLAY Coach:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'coach',
        text: "I am having temporary trouble reaching the clinical reasoning engine. Please consult your physician's written instructions directly.",
        responseType: 'safety_alert',
        warningLevel: 'caution',
        professionalReviewRequired: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl border-slate-800 overflow-hidden flex flex-col h-[750px] max-h-[85vh]">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-950">
            <Sparkles className="w-5 h-5 text-slate-950" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-slate-950 flex items-center justify-center border border-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">RE:PLAY Coach</h3>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                RAG Grounded
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Grounded in Dr. Sarah Jenkins' Approved Protocol • Non-Diagnostic
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Safety Intercept Active</span>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'athlete' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-2.5 text-xs shadow-md ${
                m.sender === 'athlete'
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 font-medium rounded-br-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              {/* If Coach, display structured badge & based on pill */}
              {m.sender === 'coach' && m.basedOn && (
                <div className="flex flex-wrap items-center gap-1 text-[10px] pb-1 border-b border-slate-800/80">
                  <span className="font-bold text-slate-400 uppercase">Grounding:</span>
                  {m.basedOn.map((b, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[9px] border border-slate-700"
                    >
                      {b.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}

              {/* Message text */}
              <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

              {/* Structured Action Pill */}
              {m.action && (
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] space-y-1">
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Recommended Step:
                  </span>
                  <p className="text-slate-300">{m.action}</p>
                </div>
              )}

              {/* Warning level badge if caution or urgent */}
              {m.warningLevel && m.warningLevel !== 'none' && (
                <div
                  className={`p-2 rounded-lg flex items-center gap-2 text-[11px] font-bold ${
                    m.warningLevel === 'urgent'
                      ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Clinical Flag: Contact clinic before continuing heavy sets.</span>
                </div>
              )}

              {/* Professional Review Required Flag */}
              {m.professionalReviewRequired && (
                <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-bold pt-0.5">
                  <UserCheck className="w-3 h-3" />
                  <span>Physiotherapist review recommended</span>
                </div>
              )}
            </div>

            <span className="text-[9px] text-slate-500 px-2 mt-1 font-mono">
              {m.timestamp}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>RE:PLAY Coach analyzing recovery plan & safety rules...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0">Suggestions:</span>
        {SUGGESTED_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about your exercises, symptoms, or current phase restrictions..."
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 flex items-center justify-center transition cursor-pointer shadow-md shadow-emerald-950"
          >
            <Send className="w-4 h-4 font-bold" />
          </button>
        </form>

        <div className="text-[10px] text-slate-500 text-center pt-2 flex items-center justify-center gap-1">
          <Info className="w-3 h-3" />
          <span>RE:PLAY Coach does not diagnose or replace medical advice. All guidance is grounded in your clinician's plan.</span>
        </div>
      </div>
    </div>
  );
};
