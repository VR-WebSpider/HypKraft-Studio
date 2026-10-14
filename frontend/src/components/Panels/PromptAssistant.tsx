import React, { useState } from 'react';
import { Wand2, Send, Sparkles, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { ProjectData } from '../../types/timeline';

interface PromptAssistantProps {
  project: ProjectData;
  currentTime: number;
  onApplyPlan: (updatedTimeline: ProjectData) => void;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
  actions?: any[];
  timestamp: string;
}

const PRESET_PROMPTS = [
  '⚡ Add 3D Cyber Title "NEON HORIZON" at 2s',
  '🔊 Generate bass drop impact SFX',
  '✨ Add golden embers particle sparks',
  '📺 Apply retro VHS glitch shader',
  '✂️ Split video at 4 seconds',
  '🎞️ Add glassmorphism streamer lower third'
];

export const PromptAssistant: React.FC<PromptAssistantProps> = ({
  project,
  currentTime,
  onApplyPlan,
  onClose
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hello! I am your AI Video & Motion Graphics Co-Pilot. Tell me what to edit, generate, or add to your timeline.',
      timestamp: 'Just now'
    }
  ]);

  const handleSubmit = async (promptText: string) => {
    const textToSend = promptText.trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);

    try {
      const response = await api.executePrompt(textToSend, {
        ...project,
        currentTime
      });

      const assistantMsg: Message = {
        role: 'assistant',
        text: response.summary || 'Applied changes to the timeline.',
        actions: response.actions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (response.timeline) {
        onApplyPlan(response.timeline);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Error executing prompt: ${err.message || 'Please check provider connection.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-96 bg-[#0c101a] border-l border-[#1c2436] flex flex-col h-full shadow-2xl select-none z-10">
      {/* Panel Header */}
      <div className="h-12 border-b border-[#1c2436] px-4 flex items-center justify-between bg-[#0e1320]">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            AI Co-Pilot Editor
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 text-xs px-2 py-0.5 rounded hover:bg-slate-800 transition"
        >
          ✕
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3 rounded-lg text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium shadow-md shadow-cyan-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300'
              }`}
            >
              <div>{m.text}</div>

              {/* Action Pills */}
              {m.actions && m.actions.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1.5">
                  <div className="text-[10px] uppercase font-mono text-cyan-400 font-semibold">
                    Timeline Mutations:
                  </div>
                  {m.actions.map((act, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-slate-950/60 px-2 py-1 rounded border border-slate-800"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="text-slate-200 font-medium">{act.type}</span>
                      {act.text && <span className="text-cyan-300">"{act.text}"</span>}
                      {act.soundType && <span className="text-sky-300">[{act.soundType}]</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs text-slate-400">
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>AI reasoning & rendering timeline mutations...</span>
          </div>
        )}
      </div>

      {/* Preset Action Suggestions */}
      <div className="px-3 py-2 bg-[#090d16] border-t border-slate-800/60">
        <div className="text-[10px] uppercase font-mono text-slate-400 mb-1.5 px-1">
          Quick Edit Suggestions
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSubmit(p)}
              disabled={loading}
              className="text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 px-2 py-1 rounded border border-slate-800 hover:border-cyan-500/30 transition text-left truncate max-w-full"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Prompt Box */}
      <div className="p-3 bg-[#0e1320] border-t border-[#1c2436]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(prompt);
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type edit prompt (e.g. 'Add 3D title at 3s')..."
            disabled={loading}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg pl-3 pr-10 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || loading}
            className="absolute right-1.5 p-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-md transition disabled:opacity-30 disabled:pointer-events-none"
            title="Send Prompt"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
