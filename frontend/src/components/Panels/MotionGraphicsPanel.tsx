import React, { useState } from 'react';
import { Layers, Sparkles, Sliders, Plus, Zap, Eye } from 'lucide-react';
import { Clip } from '../../types/timeline';

interface MotionGraphicsPanelProps {
  currentTime: number;
  onAddClip: (trackId: string, clip: Clip) => void;
  onClose: () => void;
}

const PRESET_CATEGORIES = [
  { id: '3d_titles', label: '3D Titles' },
  { id: 'lower_thirds', label: 'Lower Thirds' },
  { id: 'particles', label: 'Particle VFX' },
  { id: 'shaders', label: 'Shader FX' }
];

export const MotionGraphicsPanel: React.FC<MotionGraphicsPanelProps> = ({
  currentTime,
  onAddClip,
  onClose
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('3d_titles');

  const handleAdd3DTitle = (preset: {
    id: string;
    text: string;
    color: string;
    glowColor: string;
    name: string;
  }) => {
    const clip: Clip = {
      id: `clip_title_${Date.now()}`,
      name: `3D: ${preset.name}`,
      type: 'motion_graphics',
      category: '3d_title',
      presetId: preset.id,
      text: preset.text,
      color: preset.color,
      glowColor: preset.glowColor,
      start: currentTime,
      duration: 4.5,
      inPoint: 0,
      transform: { x: 0, y: 0.5, z: 0, scale: 1.0, rotation: 0 }
    };
    onAddClip('track_graphics', clip);
  };

  const handleAddLowerThird = (preset: {
    id: string;
    text: string;
    color: string;
    name: string;
  }) => {
    const clip: Clip = {
      id: `clip_lt_${Date.now()}`,
      name: `LT: ${preset.name}`,
      type: 'motion_graphics',
      category: 'lower_third',
      presetId: preset.id,
      text: preset.text,
      color: preset.color,
      start: currentTime,
      duration: 5.0,
      inPoint: 0,
      transform: { x: 0, y: -2.5, z: 0.5, scale: 0.9, rotation: 0 }
    };
    onAddClip('track_graphics', clip);
  };

  const handleAddParticles = (preset: {
    id: string;
    name: string;
    color: string;
    particleCount: number;
  }) => {
    const clip: Clip = {
      id: `clip_p_${Date.now()}`,
      name: `FX: ${preset.name}`,
      type: 'particle_fx',
      presetId: preset.id,
      color: preset.color,
      particleCount: preset.particleCount,
      start: currentTime,
      duration: 6.0,
      inPoint: 0
    };
    onAddClip('track_fx', clip);
  };

  const handleAddShader = (preset: {
    id: string;
    name: string;
    uniforms: Record<string, number>;
  }) => {
    const clip: Clip = {
      id: `clip_s_${Date.now()}`,
      name: `Shader: ${preset.name}`,
      type: 'shader_fx',
      shaderId: preset.id,
      uniforms: preset.uniforms,
      start: currentTime,
      duration: 4.0,
      inPoint: 0
    };
    onAddClip('track_fx', clip);
  };

  return (
    <div className="w-96 bg-[#0c101a] border-l border-[#1c2436] flex flex-col h-full shadow-2xl select-none z-10">
      {/* Panel Header */}
      <div className="h-12 border-b border-[#1c2436] px-4 flex items-center justify-between bg-[#0e1320]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            3D Motion Graphics & VFX
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 text-xs px-2 py-0.5 rounded hover:bg-slate-800 transition"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800/80 bg-slate-950/40 p-1 gap-1">
        {PRESET_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-1 py-1.5 rounded text-[11px] font-medium transition ${
              activeCategory === cat.id
                ? 'bg-purple-600/30 text-purple-300 font-semibold border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Preset Cards List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeCategory === '3d_titles' && (
          <>
            <div className="p-3 bg-slate-900/80 border border-cyan-500/30 rounded-lg group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-300">Cyberpunk 3D Title</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-cyan-950 text-cyan-400 rounded border border-cyan-800/60">
                  Neon Glow
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                Extruded futuristic 3D text with dual-tone chromatic bloom and pulse animation.
              </p>
              <button
                onClick={() =>
                  handleAdd3DTitle({
                    id: 'cyber_title_3d',
                    name: 'Cyber Title',
                    text: 'CYBER HORIZON',
                    color: '#00ffcc',
                    glowColor: '#ff007f'
                  })
                }
                className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-medium rounded border border-cyan-500/40 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add at {currentTime.toFixed(1)}s
              </button>
            </div>

            <div className="p-3 bg-slate-900/80 border border-sky-500/30 rounded-lg group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-300">Holographic Projection</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-sky-950 text-sky-400 rounded border border-sky-800/60">
                  Sci-Fi Wireframe
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                Cyan wireframe 3D typography with scanline shimmer and ethereal field glow.
              </p>
              <button
                onClick={() =>
                  handleAdd3DTitle({
                    id: 'hologram_text',
                    name: 'Hologram Title',
                    text: 'SYSTEM ONLINE',
                    color: '#38bdf8',
                    glowColor: '#0284c7'
                  })
                }
                className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-medium rounded border border-sky-500/40 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add at {currentTime.toFixed(1)}s
              </button>
            </div>

            <div className="p-3 bg-slate-900/80 border border-amber-500/30 rounded-lg group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-300">Cinematic Gold Blockbuster</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-950 text-amber-400 rounded border border-amber-800/60">
                  Metallic Trailer
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                Reflective golden 3D typography with cinematic push-in movement and lens flares.
              </p>
              <button
                onClick={() =>
                  handleAdd3DTitle({
                    id: 'cinematic_bold',
                    name: 'Gold Trailer',
                    text: 'THE CHRONICLES',
                    color: '#f59e0b',
                    glowColor: '#d97706'
                  })
                }
                className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium rounded border border-amber-500/40 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add at {currentTime.toFixed(1)}s
              </button>
            </div>
          </>
        )}

        {activeCategory === 'lower_thirds' && (
          <>
            <div className="p-3 bg-slate-900/80 border border-indigo-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-300">Glassmorphism Lower Third</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-indigo-950 text-indigo-400 rounded border border-indigo-800/60">
                  Streamer / Host
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                Frosted glass bar with clean typography and accent neon borders.
              </p>
              <button
                onClick={() =>
                  handleAddLowerThird({
                    id: 'streamer_lower_third',
                    name: 'Glass Lower Third',
                    text: 'Alex Vance | Creative Lead',
                    color: '#818cf8'
                  })
                }
                className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-medium rounded border border-indigo-500/40 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add at {currentTime.toFixed(1)}s
              </button>
            </div>

            <div className="p-3 bg-slate-900/80 border border-red-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-red-300">Breaking News Bar</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-red-950 text-red-400 rounded border border-red-800/60">
                  Urgent Broadcast
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                High-contrast alert ticker banner for urgent news and announcements.
              </p>
              <button
                onClick={() =>
                  handleAddLowerThird({
                    id: 'breaking_news_bar',
                    name: 'News Ticker',
                    text: 'BREAKING: AI Video Editor Online',
                    color: '#f87171'
                  })
                }
                className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-medium rounded border border-red-500/40 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add at {currentTime.toFixed(1)}s
              </button>
            </div>
          </>
        )}

        {activeCategory === 'particles' && (
          <>
            <div className="p-3 bg-slate-900/80 border border-amber-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-300">Golden Embers Sparks</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-950 text-amber-400 rounded border border-amber-800/60">
                  250 Particles
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                Dynamic floating embers and warm sparks rising in 3D perspective.
              </p>
              <button
                onClick={() =>
                  handleAddParticles({
                    id: 'particles_sparks',
                    name: 'Golden Embers',
                    color: '#ffaa22',
                    particleCount: 250
                  })
                }
                className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium rounded border border-amber-500/40 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add at {currentTime.toFixed(1)}s
              </button>
            </div>

            <div className="p-3 bg-slate-900/80 border border-emerald-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-300">Digital Matrix Rain</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-950 text-emerald-400 rounded border border-emerald-800/60">
                  400 Particles
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                Vertical streams of glowing code rain for cyberpunk scenes.
              </p>
              <button
                onClick={() =>
                  handleAddParticles({
                    id: 'particles_matrix',
                    name: 'Matrix Rain',
                    color: '#22c55e',
                    particleCount: 400
                  })
                }
                className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-medium rounded border border-emerald-500/40 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add at {currentTime.toFixed(1)}s
              </button>
            </div>
          </>
        )}

        {activeCategory === 'shaders' && (
          <>
            <div className="p-3 bg-slate-900/80 border border-cyan-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-300">RGB Split / Chromatic Aberration</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-cyan-950 text-cyan-400 rounded border border-cyan-800/60">
                  GLSL Shader
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                Optical color dispersion separating red, green, and blue channels dynamically.
              </p>
              <button
                onClick={() =>
                  handleAddShader({
                    id: 'rgb_split',
                    name: 'RGB Split',
                    uniforms: { amount: 0.012 }
                  })
                }
                className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-medium rounded border border-cyan-500/40 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add at {currentTime.toFixed(1)}s
              </button>
            </div>

            <div className="p-3 bg-slate-900/80 border border-rose-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-300">Retro VHS Camcorder Glitch</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-rose-950 text-rose-400 rounded border border-rose-800/60">
                  GLSL Shader
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                Horizontal tracking scanlines, tape flutter, and analog noise artifacts.
              </p>
              <button
                onClick={() =>
                  handleAddShader({
                    id: 'vhs_glitch',
                    name: 'VHS Glitch',
                    uniforms: { noiseIntensity: 0.2 }
                  })
                }
                className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-medium rounded border border-rose-500/40 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add at {currentTime.toFixed(1)}s
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
