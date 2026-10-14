import React, { useRef, useState } from 'react';
import {
  Scissors,
  Trash2,
  Copy,
  Plus,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  Layers,
  Sparkles,
  Film,
  Music
} from 'lucide-react';
import { ProjectData, Track, Clip } from '../../types/timeline';

interface TimelineProps {
  project: ProjectData;
  currentTime: number;
  zoom: number;
  selectedClipId: string | null;
  onSeek: (time: number) => void;
  onSelectClip: (clipId: string | null) => void;
  onUpdateClip: (clipId: string, updates: Partial<Clip>) => void;
  onSplitClip: (clipId: string, splitTime: number) => void;
  onRemoveClip: (clipId: string) => void;
  onAddClip: (trackId: string, clip: Clip) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  project,
  currentTime,
  zoom,
  selectedClipId,
  onSeek,
  onSelectClip,
  onUpdateClip,
  onSplitClip,
  onRemoveClip,
  onAddClip
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);

  // Dragging state for clips
  const [draggingClipId, setDraggingClipId] = useState<string | null>(null);
  const dragStartXRef = useRef<number>(0);
  const clipStartRef = useRef<number>(0);
  const clipDurRef = useRef<number>(0);
  const dragTypeRef = useRef<'move' | 'trim-start' | 'trim-end'>('move');

  // Handle ruler click & drag to scrub playhead
  const handleRulerMouseDown = (e: React.MouseEvent) => {
    if (!rulerRef.current) return;
    setIsScrubbing(true);
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
      setIsScrubbing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Handle clip dragging / trimming
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

  // Helper icons for track types
  const getTrackIcon = (type: Track['type']) => {
    switch (type) {
      case 'graphics':
        return <Layers className="w-3.5 h-3.5 text-cyan-400" />;
      case 'fx':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'audio':
        return <Music className="w-3.5 h-3.5 text-sky-400" />;
      case 'video':
      default:
        return <Film className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  // Helper styles for clip cards
  const getClipStyle = (clip: Clip, isSelected: boolean) => {
    let base = 'border shadow-md select-none transition-shadow ';
    if (isSelected) {
      base += 'ring-2 ring-cyan-400 shadow-cyan-500/20 z-10 ';
    }
    switch (clip.type) {
      case 'motion_graphics':
      case 'text':
        return base + 'bg-gradient-to-r from-cyan-900/90 via-indigo-900/80 to-purple-900/90 border-cyan-500/40 text-cyan-100';
      case 'particle_fx':
      case 'shader_fx':
        return base + 'bg-gradient-to-r from-amber-900/80 via-orange-900/80 to-red-900/80 border-amber-500/40 text-amber-100';
      case 'audio':
        return base + 'bg-gradient-to-r from-sky-950 via-teal-950 to-blue-950 border-sky-500/40 text-sky-200';
      case 'video':
      default:
        return base + 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/40 text-slate-100';
    }
  };

  const timelineWidth = Math.max(1200, (project.duration + 5) * zoom);
  const timeTicks = Array.from({ length: Math.ceil(project.duration + 4) }, (_, i) => i);

  return (
    <div className="h-64 bg-[#090c14] flex flex-col border-t border-[#1b2234] select-none">
      {/* Timeline Quick Action Toolbar */}
      <div className="h-9 bg-[#0e1320] border-b border-[#1b2234] px-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              if (selectedClipId) {
                onSplitClip(selectedClipId, currentTime);
              }
            }}
            disabled={!selectedClipId}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:pointer-events-none transition border border-slate-700/60"
            title="Split Clip at Playhead (Scissors)"
          >
            <Scissors className="w-3.5 h-3.5 text-cyan-400" />
            Split
          </button>

          <button
            onClick={() => {
              if (selectedClipId) {
                onRemoveClip(selectedClipId);
              }
            }}
            disabled={!selectedClipId}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-slate-800/80 hover:bg-red-950/60 text-slate-200 hover:text-red-300 disabled:opacity-40 disabled:pointer-events-none transition border border-slate-700/60 hover:border-red-500/40"
            title="Delete Selected Clip"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            Delete
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-500">
          Duration: <span className="text-slate-300 font-semibold">{project.duration.toFixed(1)}s</span>
        </div>
      </div>

      {/* Main Multi-Track Scroll Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Track Headers Column */}
        <div className="w-52 shrink-0 bg-[#0c101a] border-r border-[#1b2234] flex flex-col">
          {/* Header spacer aligned with ruler */}
          <div className="h-7 border-b border-[#1b2234] bg-[#0e1320] flex items-center px-3 text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider">
            Tracks
          </div>

          {/* Track Headers List */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {project.tracks.map((track) => (
              <div
                key={track.id}
                className="h-14 border-b border-[#1b2234] px-3 flex items-center justify-between hover:bg-slate-900/40 transition"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {getTrackIcon(track.type)}
                  <span className="text-xs font-medium text-slate-300 truncate">
                    {track.name}
                  </span>
                </div>

                {/* Track controls: mute/eye */}
                <div className="flex items-center gap-1 text-slate-500">
                  <button
                    onClick={() => {}}
                    className="p-1 hover:text-slate-300 transition"
                    title={track.visible ? 'Hide Track' : 'Show Track'}
                  >
                    {track.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
                  </button>
                  <button
                    onClick={() => {}}
                    className="p-1 hover:text-slate-300 transition"
                    title={track.muted ? 'Unmute Track' : 'Mute Track'}
                  >
                    {track.muted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Scrollable Timeline Lanes & Playhead */}
        <div
          ref={containerRef}
          className="flex-1 overflow-x-auto overflow-y-hidden relative flex flex-col timeline-grid"
          onClick={() => onSelectClip(null)}
        >
          {/* Timecode Ruler */}
          <div
            ref={rulerRef}
            onMouseDown={handleRulerMouseDown}
            style={{ width: `${timelineWidth}px` }}
            className="h-7 bg-[#0e1320] border-b border-[#1b2234] relative cursor-pointer select-none"
          >
            {timeTicks.map((t) => (
              <div
                key={t}
                style={{ left: `${t * zoom}px` }}
                className="absolute top-0 bottom-0 border-l border-slate-700/60 pl-1 flex items-center"
              >
                <span className="text-[10px] font-mono text-slate-400 select-none">
                  {t}s
                </span>
              </div>
            ))}
          </div>

          {/* Track Lanes */}
          <div style={{ width: `${timelineWidth}px` }} className="flex-1 relative">
            {project.tracks.map((track) => (
              <div
                key={track.id}
                className="h-14 border-b border-slate-800/40 relative flex items-center"
              >
                {/* Clips in this track */}
                {track.clips.map((clip) => {
                  const clipLeft = clip.start * zoom;
                  const clipWidth = clip.duration * zoom;
                  const isSelected = selectedClipId === clip.id;

                  return (
                    <div
                      key={clip.id}
                      style={{
                        left: `${clipLeft}px`,
                        width: `${clipWidth}px`,
                      }}
                      onMouseDown={(e) => handleClipMouseDown(e, clip, 'move')}
                      className={`absolute h-10 rounded-md px-2 flex items-center justify-between cursor-grab active:cursor-grabbing overflow-hidden group ${getClipStyle(
                        clip,
                        isSelected
                      )}`}
                    >
                      {/* Left Trim Handle */}
                      <div
                        onMouseDown={(e) => handleClipMouseDown(e, clip, 'trim-start')}
                        className="absolute left-0 top-0 bottom-0 w-2 hover:bg-cyan-400/80 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Trim Start"
                      />

                      {/* Clip Content & Label */}
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-[11px] font-semibold tracking-wide truncate">
                          {clip.name}
                        </span>
                        {clip.text && (
                          <span className="text-[10px] text-cyan-300 font-mono opacity-80 truncate">
                            "{clip.text}"
                          </span>
                        )}
                      </div>

                      {/* Right Trim Handle */}
                      <div
                        onMouseDown={(e) => handleClipMouseDown(e, clip, 'trim-end')}
                        className="absolute right-0 top-0 bottom-0 w-2 hover:bg-cyan-400/80 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Trim End"
                      />
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Red Playhead Line & Scrubber */}
            <div
              style={{ left: `${currentTime * zoom}px` }}
              className="absolute top-0 bottom-0 pointer-events-none z-30"
            >
              <div className="relative -left-[7px] -top-7 w-3.5 h-7 flex flex-col items-center">
                {/* Red playhead marker */}
                <div className="w-3.5 h-3.5 bg-red-500 rounded-sm shadow-md shadow-red-500/50" />
                <div className="w-0.5 flex-1 bg-red-500 shadow-md shadow-red-500/50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
