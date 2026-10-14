import React, { useState } from 'react';
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  Music,
  Layers,
  Star,
  Cloud,
  HardDrive,
  Wand2,
  Loader2
} from 'lucide-react';
import { api } from '../../services/api';
import { ProjectData } from '../../types/timeline';

interface HypKraftCreateWithAIProps {
  project: ProjectData;
  currentTime: number;
  onApplyPlan: (updated: ProjectData) => void;
  onOpenModelSettings: () => void;
}

export const HypKraftCreateWithAI: React.FC<HypKraftCreateWithAIProps> = ({
  project,
  currentTime,
  onApplyPlan,
  onOpenModelSettings
}) => {
  const [prompt, setPrompt] = useState(
    'A futuristic city at sunset with flying cars, neon lights, and cinematic lighting'
  );
  const [activeCategory, setActiveCategory] = useState<string>('video');
  const [modelMode, setModelMode] = useState<'cloud' | 'local'>('cloud');
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'video', label: 'Video', icon: Video },
    { id: 'image', label: 'Image', icon: ImageIcon },
    { id: 'audio', label: 'Audio', icon: Music },
    { id: 'motion', label: 'Motion Graphics', icon: Layers },
    { id: 'fx', label: 'FX', icon: Star }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    try {
      setLoading(true);
      const res = await api.executePrompt(prompt, {
        ...project,
        currentTime
      });
      if (res.timeline) {
        onApplyPlan(res.timeline);
      }
    } catch (err: any) {
      alert(`Generation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/95 rounded-2xl p-4 border border-slate-200/90 shadow-xs mb-3 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded-md bg-violet-100 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-violet-600" />
        </div>
        <h2 className="text-sm font-bold text-slate-800">Create with AI</h2>
      </div>
      <p className="text-[11px] text-slate-500 mb-3">
        Describe your vision or use an example. Our AI will generate stunning videos, images, audio, motion graphics and more.
      </p>

      {/* Input Field + Generate Button */}
      <div className="relative flex items-center mb-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleGenerate();
          }}
          placeholder="Describe what you want to edit or generate..."
          disabled={loading}
          className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white rounded-xl pl-3 pr-28 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition"
        />

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="absolute right-1.5 px-4 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg shadow-md shadow-violet-500/20 transition active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5" />
              <span>Generate</span>
            </>
          )}
        </button>
      </div>

      {/* Bottom Filters: Category Pills + Model Mode Selector */}
      <div className="flex items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5">
          {categories.map((c) => {
            const Icon = c.icon;
            const isSelected = activeCategory === c.id;

            return (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                  isSelected
                    ? 'bg-violet-50 text-violet-700 border-violet-200 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-violet-600' : 'text-slate-400'}`} />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Model Mode Toggle Pills matching reference */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setModelMode('cloud')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
              modelMode === 'cloud'
                ? 'bg-white text-violet-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cloud className="w-3 h-3 text-violet-600" />
            <span>Cloud Models</span>
          </button>

          <button
            onClick={() => setModelMode('local')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
              modelMode === 'local'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <HardDrive className="w-3 h-3 text-emerald-600" />
            <span>Local Models</span>
          </button>
        </div>
      </div>
    </div>
  );
};
