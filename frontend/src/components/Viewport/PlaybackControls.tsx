import React, { useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Smartphone,
  Square,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface PlaybackControlsProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  aspectRatio: '16:9' | '9:16' | '1:1';
  zoom: number;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onAspectRatioChange: (ratio: '16:9' | '9:16' | '1:1') => void;
  onZoomChange: (zoom: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  currentTime,
  duration,
  isPlaying,
  aspectRatio,
  zoom,
  onTogglePlay,
  onSeek,
  onAspectRatioChange,
  onZoomChange
}) => {
  // Format seconds to HH:MM:SS.FF
  const formatTimecode = (sec: number) => {
    const s = Math.max(0, sec);
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    const frames = Math.floor((s % 1) * 30);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(frames).padStart(2, '0')}`;
  };

  // Keyboard shortcut: Spacebar to toggle play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        onTogglePlay();
      } else if (e.code === 'ArrowLeft') {
        onSeek(currentTime - (e.shiftKey ? 1.0 : 1 / 30));
      } else if (e.code === 'ArrowRight') {
        onSeek(currentTime + (e.shiftKey ? 1.0 : 1 / 30));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePlay, onSeek, currentTime]);

  return (
    <div className="h-12 bg-[#0c101a] border-t border-b border-[#1c2436] px-4 flex items-center justify-between select-none">
      {/* Aspect Ratio Selector */}
      <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800">
        <button
          onClick={() => onAspectRatioChange('16:9')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${
            aspectRatio === '16:9'
              ? 'bg-cyan-500/20 text-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="16:9 Cinematic Landscape"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="text-[11px]">16:9</span>
        </button>

        <button
          onClick={() => onAspectRatioChange('9:16')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${
            aspectRatio === '9:16'
              ? 'bg-cyan-500/20 text-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="9:16 Vertical (Reels / TikTok / Shorts)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="text-[11px]">9:16</span>
        </button>

        <button
          onClick={() => onAspectRatioChange('1:1')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${
            aspectRatio === '1:1'
              ? 'bg-cyan-500/20 text-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="1:1 Square Post"
        >
          <Square className="w-3.5 h-3.5" />
          <span className="text-[11px]">1:1</span>
        </button>
      </div>

      {/* Main Transport Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onSeek(0)}
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-md transition"
          title="Go to Start (Home)"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={() => onSeek(currentTime - 1 / 30)}
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-md transition"
          title="Step Back 1 Frame (Left Arrow)"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={onTogglePlay}
          className="w-8 h-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/25 transition active:scale-95"
          title="Play / Pause (Space)"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-slate-950" />
          ) : (
            <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
          )}
        </button>

        <button
          onClick={() => onSeek(currentTime + 1 / 30)}
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-md transition"
          title="Step Forward 1 Frame (Right Arrow)"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Digital Timecode Readout */}
        <div className="ml-3 px-3 py-1 bg-slate-950/80 rounded-md border border-slate-800 font-mono text-xs text-slate-200 tracking-wider">
          <span className="text-cyan-400 font-semibold">{formatTimecode(currentTime)}</span>
          <span className="text-slate-600 mx-1">/</span>
          <span className="text-slate-400">{formatTimecode(duration)}</span>
        </div>
      </div>

      {/* Timeline Zoom Slider */}
      <div className="flex items-center gap-2">
        <ZoomOut className="w-3.5 h-3.5 text-slate-500" />
        <input
          type="range"
          min="30"
          max="200"
          value={zoom}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          title="Timeline Zoom"
        />
        <ZoomIn className="w-3.5 h-3.5 text-slate-500" />
      </div>
    </div>
  );
};
