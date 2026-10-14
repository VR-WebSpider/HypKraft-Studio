import React from 'react';
import { Sliders, Move, Palette, Volume2, Sparkles, Trash2 } from 'lucide-react';
import { Clip } from '../../types/timeline';

interface InspectorPanelProps {
  clip: Clip | null;
  onUpdateClip: (clipId: string, updates: Partial<Clip>) => void;
  onDeleteClip: (clipId: string) => void;
  onClose: () => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  clip,
  onUpdateClip,
  onDeleteClip,
  onClose
}) => {
  if (!clip) {
    return (
      <div className="w-80 bg-[#0c101a] border-l border-[#1c2436] flex flex-col h-full shadow-2xl p-6 items-center justify-center text-center select-none z-10">
        <Sliders className="w-8 h-8 text-slate-600 mb-3" />
        <div className="text-xs font-semibold text-slate-400 mb-1">No Clip Selected</div>
        <p className="text-[11px] text-slate-500 max-w-[200px]">
          Click on any video, audio, 3D title, or FX clip on the timeline to inspect and edit properties.
        </p>
      </div>
    );
  }

  const transform = clip.transform || { x: 0, y: 0, z: 0, scale: 1.0, rotation: 0 };

  const handleTransformChange = (key: keyof typeof transform, val: number) => {
    onUpdateClip(clip.id, {
      transform: {
        ...transform,
        [key]: val
      }
    });
  };

  return (
    <div className="w-80 bg-[#0c101a] border-l border-[#1c2436] flex flex-col h-full shadow-2xl select-none z-10">
      {/* Panel Header */}
      <div className="h-12 border-b border-[#1c2436] px-4 flex items-center justify-between bg-[#0e1320]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Clip Inspector
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 text-xs px-2 py-0.5 rounded hover:bg-slate-800 transition"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Clip Name & Meta */}
        <div>
          <label className="text-[11px] font-medium text-slate-400 mb-1 block">
            Clip Name
          </label>
          <input
            type="text"
            value={clip.name}
            onChange={(e) => onUpdateClip(clip.id, { name: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          />
        </div>

        {/* Timing parameters */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
          <div>
            <div className="text-[10px] text-slate-500 font-mono">Start Time</div>
            <div className="text-xs font-semibold text-slate-200 font-mono">
              {clip.start.toFixed(2)}s
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-mono">Duration</div>
            <div className="text-xs font-semibold text-cyan-400 font-mono">
              {clip.duration.toFixed(2)}s
            </div>
          </div>
        </div>

        {/* 3D Motion Graphics & Typography Controls */}
        {(clip.type === 'motion_graphics' || clip.type === 'text') && (
          <div className="space-y-4 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
              <Palette className="w-3.5 h-3.5" />
              <span>3D Typography & Style</span>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 mb-1 block">Title Text</label>
              <input
                type="text"
                value={clip.text || ''}
                onChange={(e) => onUpdateClip(clip.id, { text: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 mb-1 block">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={clip.color || '#00ffcc'}
                    onChange={(e) => onUpdateClip(clip.id, { color: e.target.value })}
                    className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-slate-400">
                    {clip.color || '#00ffcc'}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 mb-1 block">Glow Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={clip.glowColor || '#ff007f'}
                    onChange={(e) => onUpdateClip(clip.id, { glowColor: e.target.value })}
                    className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-slate-400">
                    {clip.glowColor || '#ff007f'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3D Transform Controls */}
        {(clip.type === 'motion_graphics' || clip.type === 'video' || clip.type === 'text') && (
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300">
              <Move className="w-3.5 h-3.5" />
              <span>3D Transform & Placement</span>
            </div>

            {/* Position X */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Position X</span>
                <span className="font-mono text-slate-200">{transform.x.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-6.0"
                max="6.0"
                step="0.1"
                value={transform.x}
                onChange={(e) => handleTransformChange('x', Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Position Y */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Position Y</span>
                <span className="font-mono text-slate-200">{transform.y.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-4.0"
                max="4.0"
                step="0.1"
                value={transform.y}
                onChange={(e) => handleTransformChange('y', Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Scale */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Scale Multiplier</span>
                <span className="font-mono text-slate-200">{transform.scale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.05"
                value={transform.scale}
                onChange={(e) => handleTransformChange('scale', Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Rotation */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Rotation (Roll)</span>
                <span className="font-mono text-slate-200">{transform.rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={transform.rotation}
                onChange={(e) => handleTransformChange('rotation', Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>
        )}

        {/* Audio Volume Controls */}
        {(clip.type === 'audio' || clip.type === 'video') && (
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-300">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Audio Level</span>
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Volume</span>
                <span className="font-mono text-slate-200">
                  {Math.round((clip.volume ?? 1.0) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.05"
                value={clip.volume ?? 1.0}
                onChange={(e) => onUpdateClip(clip.id, { volume: Number(e.target.value) })}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-sky-500"
              />
            </div>
          </div>
        )}

        {/* Delete Action */}
        <div className="pt-4 border-t border-slate-800/80">
          <button
            onClick={() => onDeleteClip(clip.id)}
            className="w-full flex items-center justify-center gap-2 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 rounded-lg text-xs font-medium transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Clip from Timeline
          </button>
        </div>
      </div>
    </div>
  );
};
