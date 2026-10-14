import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  FolderOpen,
  Video,
  Image as ImageIcon,
  Music,
  Layers,
  Star,
  ChevronRight,
  Cloud,
  HardDrive
} from 'lucide-react';
import { Clip } from '../../types/timeline';

interface HypKraftRightSidebarProps {
  selectedClip: Clip | null;
  onUpdateClip: (clipId: string, updates: Partial<Clip>) => void;
  onDeleteClip: (clipId: string) => void;
  onAddClip: (trackId: string, clip: Clip) => void;
  currentTime: number;
}

export const HypKraftRightSidebar: React.FC<HypKraftRightSidebarProps> = ({
  selectedClip,
  onUpdateClip,
  onDeleteClip,
  onAddClip,
  currentTime
}) => {
  const [activeTab, setActiveTab] = useState<'generator' | 'manual' | 'project'>('generator');
  const [modelMode, setModelMode] = useState<'cloud' | 'local'>('cloud');

  // Cloud models state toggles
  const [cloudModels, setCloudModels] = useState([
    { id: 'gpt4o', name: 'OpenAI GPT-4o', type: 'Text / Video', enabled: true },
    { id: 'sdxl', name: 'Stable Diffusion XL', type: 'Image', enabled: true },
    { id: 'runway', name: 'Runway Gen-3', type: 'Video', enabled: true },
    { id: 'elevenlabs', name: 'ElevenLabs', type: 'Audio', enabled: true },
    { id: 'pika', name: 'Pika', type: 'Video', enabled: true }
  ]);

  // Local models state toggles
  const [localModels, setLocalModels] = useState([
    { id: 'llama', name: 'Llama 3.2', type: 'Text / Image', enabled: true },
    { id: 'local_sdxl', name: 'SDXL (ComfyUI)', type: 'Image', enabled: true },
    { id: 'animatediff', name: 'AnimateDiff', type: 'Video', enabled: true },
    { id: 'riffusion', name: 'Riffusion / AudioCraft', type: 'Music', enabled: true }
  ]);

  const toggleCloudModel = (id: string) => {
    setCloudModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const toggleLocalModel = (id: string) => {
    setLocalModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const handleCategoryClick = (cat: string) => {
    if (cat === 'motion') {
      const clip: Clip = {
        id: `clip_mg_${Date.now()}`,
        name: 'Neon Text Animation',
        type: 'motion_graphics',
        text: 'Neon Text Animation',
        color: '#00dfd8',
        glowColor: '#7928ca',
        start: currentTime,
        duration: 4.5,
        inPoint: 0
      };
      onAddClip('track_graphics', clip);
    } else if (cat === 'fx') {
      const clip: Clip = {
        id: `clip_fx_${Date.now()}`,
        name: 'Particle FX',
        type: 'particle_fx',
        start: currentTime,
        duration: 5.0,
        inPoint: 0
      };
      onAddClip('track_fx', clip);
    } else if (cat === 'audio') {
      const clip: Clip = {
        id: `clip_sfx_${Date.now()}`,
        name: 'Voice Over',
        type: 'audio',
        start: currentTime,
        duration: 3.5,
        inPoint: 0,
        volume: 0.9
      };
      onAddClip('track_audio_1', clip);
    }
  };

  const transform = selectedClip?.transform || { x: 0, y: 0, z: 0, scale: 1.0, rotation: 0 };

  return (
    <aside className="w-80 bg-white/95 border-l border-slate-200/90 flex flex-col h-full select-none shrink-0 shadow-xs backdrop-blur-md overflow-hidden">
      {/* Top Tabs matching reference: AI Generator, Manual Edit, Project */}
      <div className="flex border-b border-slate-200/80 p-2 gap-1 bg-slate-50/50">
        <button
          onClick={() => setActiveTab('generator')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'generator'
              ? 'bg-white text-violet-700 shadow-sm border border-slate-200/80'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-600" />
          <span>AI Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'manual'
              ? 'bg-white text-violet-700 shadow-sm border border-slate-200/80'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Manual Edit</span>
        </button>

        <button
          onClick={() => setActiveTab('project')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'project'
              ? 'bg-white text-violet-700 shadow-sm border border-slate-200/80'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Project</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {activeTab === 'generator' ? (
          <>
            {/* AI Generator Category Cards matching reference */}
            <div className="space-y-2">
              {/* Video Generation */}
              <div
                onClick={() => handleCategoryClick('video')}
                className="p-2.5 rounded-xl border border-slate-200/80 hover:border-violet-300 bg-white hover:bg-slate-50/80 flex items-center justify-between cursor-pointer transition shadow-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Video Generation</div>
                    <div className="text-[10px] text-slate-400">
                      Generate full videos from text prompts, images or ideas.
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 transition" />
              </div>

              {/* Image Generation */}
              <div
                onClick={() => handleCategoryClick('image')}
                className="p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 bg-white hover:bg-slate-50/80 flex items-center justify-between cursor-pointer transition shadow-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-xs">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Image Generation</div>
                    <div className="text-[10px] text-slate-400">
                      Create stunning images in any style.
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
              </div>

              {/* Audio Generation */}
              <div
                onClick={() => handleCategoryClick('audio')}
                className="p-2.5 rounded-xl border border-slate-200/80 hover:border-pink-300 bg-white hover:bg-slate-50/80 flex items-center justify-between cursor-pointer transition shadow-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Audio Generation</div>
                    <div className="text-[10px] text-slate-400">
                      Generate music, voiceovers, sound effects and more.
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-pink-600 transition" />
              </div>

              {/* Motion Graphics Generation */}
              <div
                onClick={() => handleCategoryClick('motion')}
                className="p-2.5 rounded-xl border border-slate-200/80 hover:border-cyan-300 bg-white hover:bg-slate-50/80 flex items-center justify-between cursor-pointer transition shadow-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Motion Graphics Generation</div>
                    <div className="text-[10px] text-slate-400">
                      Create dynamic motion graphics and animations.
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition" />
              </div>

              {/* FX Generation */}
              <div
                onClick={() => handleCategoryClick('fx')}
                className="p-2.5 rounded-xl border border-slate-200/80 hover:border-violet-300 bg-white hover:bg-slate-50/80 flex items-center justify-between cursor-pointer transition shadow-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-purple-500 text-white flex items-center justify-center shadow-xs">
                    <Star className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">FX Generation</div>
                    <div className="text-[10px] text-slate-400">
                      Add amazing visual effects to your videos.
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 transition" />
              </div>
            </div>

            {/* Model Selector Card matching reference */}
            <div className="pt-2">
              <div className="flex items-center gap-1.5 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                <h4 className="text-xs font-bold text-slate-800">Model Selector</h4>
              </div>

              {/* Mode switch pills */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 mb-3">
                <button
                  onClick={() => setModelMode('cloud')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1 rounded-md text-[11px] font-semibold transition ${
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
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1 rounded-md text-[11px] font-semibold transition ${
                    modelMode === 'local'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <HardDrive className="w-3 h-3 text-emerald-600" />
                  <span>Local Models</span>
                </button>
              </div>

              {/* Cloud Models List */}
              {modelMode === 'cloud' && (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    Available Models
                  </div>
                  {cloudModels.map((m) => (
                    <div
                      key={m.id}
                      className="p-2 bg-slate-50/70 border border-slate-200/80 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800">{m.name}</div>
                        <div className="text-[10px] text-slate-400">({m.type})</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 bg-violet-100 text-violet-700 rounded-md font-bold">
                          Cloud
                        </span>
                        {/* Toggle switch */}
                        <button
                          onClick={() => toggleCloudModel(m.id)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                            m.enabled ? 'bg-violet-600' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform ${
                              m.enabled ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Local Models List */}
              {modelMode === 'local' && (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    Local Models (Installed)
                  </div>
                  {localModels.map((m) => (
                    <div
                      key={m.id}
                      className="p-2 bg-slate-50/70 border border-slate-200/80 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800">{m.name}</div>
                        <div className="text-[10px] text-slate-400">({m.type})</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-md font-bold">
                          Local
                        </span>
                        <button
                          onClick={() => toggleLocalModel(m.id)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                            m.enabled ? 'bg-emerald-600' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform ${
                              m.enabled ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : activeTab === 'manual' ? (
          /* Manual Inspector Controls */
          selectedClip ? (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-800 mb-1">
                  Editing: {selectedClip.name}
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  {selectedClip.start.toFixed(2)}s - {(selectedClip.start + selectedClip.duration).toFixed(2)}s
                </div>
              </div>

              {selectedClip.text !== undefined && (
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                    Text Content
                  </label>
                  <input
                    type="text"
                    value={selectedClip.text || ''}
                    onChange={(e) => onUpdateClip(selectedClip.id, { text: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-violet-500"
                  />
                </div>
              )}

              {/* 3D Transform Sliders */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-700">3D Position & Scale</div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
                    <span>X Position</span>
                    <span className="font-mono">{transform.x.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.1"
                    value={transform.x}
                    onChange={(e) =>
                      onUpdateClip(selectedClip.id, {
                        transform: { ...transform, x: Number(e.target.value) }
                      })
                    }
                    className="w-full h-1 bg-slate-200 rounded accent-violet-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
                    <span>Y Position</span>
                    <span className="font-mono">{transform.y.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="-4"
                    max="4"
                    step="0.1"
                    value={transform.y}
                    onChange={(e) =>
                      onUpdateClip(selectedClip.id, {
                        transform: { ...transform, y: Number(e.target.value) }
                      })
                    }
                    className="w-full h-1 bg-slate-200 rounded accent-violet-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
                    <span>Scale</span>
                    <span className="font-mono">{transform.scale.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.1"
                    value={transform.scale}
                    onChange={(e) =>
                      onUpdateClip(selectedClip.id, {
                        transform: { ...transform, scale: Number(e.target.value) }
                      })
                    }
                    className="w-full h-1 bg-slate-200 rounded accent-violet-600"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onDeleteClip(selectedClip.id)}
                  className="w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-semibold transition"
                >
                  Delete Clip
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-400">
              Select any clip on the timeline to edit properties manually.
            </div>
          )
        ) : (
          /* Project Tab */
          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800 mb-1">HypKraft Project Specs</div>
              <div>Renderer: Hardware FFmpeg (GPU)</div>
              <div>Canvas: Three.js WebGL / WebGPU</div>
              <div>Audio: Local Procedural / ElevenLabs</div>
              <div>MCP: Active on port 8000</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
