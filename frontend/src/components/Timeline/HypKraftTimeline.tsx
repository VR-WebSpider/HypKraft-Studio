import React, { useRef, useState } from 'react';
import {
  RotateCcw,
  RotateCw,
  Scissors,
  Trash2,
  Video,
  Layers,
  Image as ImageIcon,
  Music,
  Star,
  Eye,
  EyeOff
} from 'lucide-react';
import { ProjectData, Track, Clip } from '../../types/timeline';

interface HypKraftTimelineProps {
  project: ProjectData;
  currentTime: number;
  zoom: number;
  selectedClipId: string | null;
  onSeek: (time: number) => void;
  onSelectClip: (clipId: string | null) => void;
  onUpdateClip: (clipId: string, updates: Partial<Clip>) => void;
  onSplitClip: (clipId: string, splitTime: number) => void;
  onRemoveClip: (clipId: string) => void;
  onUndo: () => void;
  onRedo: () => void;
}

export const HypKraftTimeline: React.FC<HypKraftTimelineProps> = ({
  project,
  currentTime,
  zoom,
  selectedClipId,
  onSeek,
  onSelectClip,
  onUpdateClip,
  onSplitClip,
  onRemoveClip,
  onUndo,
  onRedo
}) => {
  const rulerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dragging state for clips
  const [draggingClipId, setDraggingClipId] = useState<string | null>(null);
  const dragStartXRef = useRef<number>(0);
  const clipStartRef = useRef<number>(0);
  const clipDurRef = useRef<number>(0);
  const dragTypeRef = useRef<'move' | 'trim-start' | 'trim-end'>('move');

  // Ruler scrub
  const handleRulerMouseDown = (e: React.MouseEvent) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = Math.max(0, Math.min(clickX / zoom, project.duration));
    onSeek(newTime);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.clientX - rect.left;
      const t = Math.max(0, Math.min(currentX / zoom, project.duration));
      onSeek(t);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Clip drag & trim
  const handleClipMouseDown = (
    e: React.MouseEvent,
    clip: Clip,
    type: 'move' | 'trim-start' | 'trim-end'
  ) => {
    e.stopPropagation();
    onSelectClip(clip.id);
    setDraggingClipId(clip.id);
    dragTypeRef.current = type;
    dragStartXRef.current = e.clientX;
    clipStartRef.current = clip.start;
    clipDurRef.current = clip.duration;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - dragStartXRef.current;
      const deltaTime = deltaX / zoom;

      if (dragTypeRef.current === 'move') {
        const newStart = Math.max(0, clipStartRef.current + deltaTime);
        onUpdateClip(clip.id, { start: Math.round(newStart * 100) / 100 });
      } else if (dragTypeRef.current === 'trim-start') {
        const newStart = Math.max(0, clipStartRef.current + deltaTime);
        const newDur = Math.max(0.3, clipDurRef.current - deltaTime);
        if (newDur > 0.3) {
          onUpdateClip(clip.id, {
            start: Math.round(newStart * 100) / 100,
            duration: Math.round(newDur * 100) / 100
          });
        }
      } else if (dragTypeRef.current === 'trim-end') {
        const newDur = Math.max(0.3, clipDurRef.current + deltaTime);
        onUpdateClip(clip.id, { duration: Math.round(newDur * 100) / 100 });
      }
    };

    const handleMouseUp = () => {
      setDraggingClipId(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const getTrackIcon = (type: Track['type']) => {
    switch (type) {
      case 'graphics':
        return <Layers className="w-4 h-4 text-violet-600" />;
      case 'fx':
        return <Star className="w-4 h-4 text-amber-500" />;
      case 'audio':
        return <Music className="w-4 h-4 text-emerald-600" />;
      case 'video':
      default:
        return <Video className="w-4 h-4 text-blue-600" />;
    }
  };

  // Timeline width & ticks
  const timelineWidth = Math.max(1200, (project.duration + 5) * zoom);
  const timeTicks = Array.from({ length: Math.ceil(project.duration + 6) }, (_, i) => i * 5).filter(
    (t) => t <= project.duration + 5
  );

  return (
    <div className="bg-white/95 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col h-64 overflow-hidden backdrop-blur-md">
      {/* Top Toolbar matching reference: Undo, Redo, Cut, Delete */}
      <div className="h-10 px-4 flex items-center justify-between border-b border-slate-200/80 bg-slate-50/50">
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition"
            title="Redo (Ctrl+Y)"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          <button
            onClick={() => {
              if (selectedClipId) onSplitClip(selectedClipId, currentTime);
            }}
            disabled={!selectedClipId}
            className="p-1.5 text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition disabled:opacity-30"
            title="Split Clip at Playhead (Ctrl+K)"
          >
            <Scissors className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (selectedClipId) onRemoveClip(selectedClipId);
            }}
            disabled={!selectedClipId}
            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-30"
            title="Delete Selected Clip (Del)"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-500">
          Playhead: <span className="font-bold text-violet-700">{currentTime.toFixed(2)}s</span>
        </div>
      </div>

      {/* Main Track lanes & ruler area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Track Headers Column matching reference */}
        <div className="w-48 shrink-0 border-r border-slate-200/80 bg-slate-50/40 flex flex-col">
          {/* Header spacer aligned with ruler */}
          <div className="h-7 border-b border-slate-200/80 bg-slate-100/50 flex items-center px-3 text-[10px] font-mono font-bold text-slate-400 uppercase">
            Tracks
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            {project.tracks.map((track) => (
              <div
                key={track.id}
                className="h-10 border-b border-slate-200/60 px-3 flex items-center justify-between hover:bg-slate-100/60 transition"
              >
                <div className="flex items-center gap-2 truncate">
                  {getTrackIcon(track.type)}
                  <span className="text-xs font-semibold text-slate-700 truncate">
                    {track.name}
                  </span>
                </div>

                <button
                  onClick={() => {}}
                  className="p-1 text-slate-400 hover:text-slate-600 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Scrollable Timeline Lanes */}
        <div
          ref={containerRef}
          className="flex-1 overflow-x-auto overflow-y-hidden relative flex flex-col timeline-light-grid"
          onClick={() => onSelectClip(null)}
        >
          {/* Timecode Ruler matching 00:00, 00:05, 00:10 format */}
          <div
            ref={rulerRef}
            onMouseDown={handleRulerMouseDown}
            style={{ width: `${timelineWidth}px` }}
            className="h-7 bg-slate-100/60 border-b border-slate-200/80 relative cursor-pointer select-none"
          >
            {timeTicks.map((t) => {
              const mins = Math.floor(t / 60);
              const secs = t % 60;
              const label = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

              return (
                <div
                  key={t}
                  style={{ left: `${t * zoom}px` }}
                  className="absolute top-0 bottom-0 border-l border-slate-300 pl-1.5 flex items-center"
                >
                  <span className="text-[10px] font-mono text-slate-400 font-medium">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Track Lanes */}
          <div style={{ width: `${timelineWidth}px` }} className="flex-1 relative">
            {project.tracks.map((track) => (
              <div
                key={track.id}
                className="h-10 border-b border-slate-200/50 relative flex items-center"
              >
                {track.clips.map((clip) => {
                  const clipLeft = clip.start * zoom;
                  const clipWidth = clip.duration * zoom;
                  const isSelected = selectedClipId === clip.id;

                  // Render style matching reference visual pill colors
                  let clipBg = 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
                  if (clip.type === 'motion_graphics') {
                    clipBg = 'bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white shadow-sm';
                  } else if (clip.type === 'audio') {
                    clipBg = clip.name.includes('Voice')
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white';
                  } else if (clip.type === 'particle_fx' || clip.type === 'shader_fx') {
                    if (clip.name.includes('Lens')) {
                      clipBg = 'bg-gradient-to-r from-teal-400 to-cyan-500 text-white';
                    } else if (clip.name.includes('Glow')) {
                      clipBg = 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900';
                    } else {
                      clipBg = 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white';
                    }
                  }

                  return (
                    <div
                      key={clip.id}
                      style={{
                        left: `${clipLeft}px`,
                        width: `${clipWidth}px`
                      }}
                      onMouseDown={(e) => handleClipMouseDown(e, clip, 'move')}
                      className={`absolute h-8 rounded-lg px-2.5 flex items-center justify-between cursor-grab active:cursor-grabbing overflow-hidden shadow-xs transition-shadow group ${clipBg} ${
                        isSelected ? 'ring-2 ring-violet-600 shadow-md z-10' : ''
                      }`}
                    >
                      {/* Left Trim Handle */}
                      <div
                        onMouseDown={(e) => handleClipMouseDown(e, clip, 'trim-start')}
                        className="absolute left-0 top-0 bottom-0 w-2 hover:bg-white/40 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
                      />

                      {/* Content */}
                      <div className="flex items-center gap-1.5 truncate">
                        {clip.type === 'motion_graphics' && (
                          <img
                            src="/assets/hypkraft_icon.png"
                            alt="H"
                            className="w-3.5 h-3.5 object-contain mr-0.5"
                          />
                        )}
                        <span className="text-[11px] font-bold tracking-tight truncate">
                          {clip.text ? clip.text : clip.name}
                        </span>
                      </div>

                      {/* Right Trim Handle */}
                      <div
                        onMouseDown={(e) => handleClipMouseDown(e, clip, 'trim-end')}
                        className="absolute right-0 top-0 bottom-0 w-2 hover:bg-white/40 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Cyan Vertical Playhead Line with Rounded Bead Head matching reference */}
            <div
              style={{ left: `${currentTime * zoom}px` }}
              className="absolute top-0 bottom-0 pointer-events-none z-30"
            >
              <div className="relative -left-[6px] -top-7 w-3 h-7 flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-cyan-400 border border-white shadow-md" />
                <div className="w-0.5 flex-1 bg-cyan-400 shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
