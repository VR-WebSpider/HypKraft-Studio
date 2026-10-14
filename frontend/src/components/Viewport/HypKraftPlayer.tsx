import React, { useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Repeat,
  ChevronDown
} from 'lucide-react';
import { ProjectData, Clip } from '../../types/timeline';
import { ThreeStudioEngine } from '../../services/threeEngine';

interface HypKraftPlayerProps {
  project: ProjectData;
  currentTime: number;
  isPlaying: boolean;
  selectedClip: Clip | null;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onAspectRatioChange: (ratio: '16:9' | '9:16' | '1:1') => void;
}

export const HypKraftPlayer: React.FC<HypKraftPlayerProps> = ({
  project,
  currentTime,
  isPlaying,
  selectedClip,
  onTogglePlay,
  onSeek,
  onAspectRatioChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const engineRef = useRef<ThreeStudioEngine | null>(null);

  // Initialize Three.js Engine
  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new ThreeStudioEngine(canvasRef.current);
    engineRef.current = engine;

    const handleResize = () => {
      if (!containerRef.current || !engineRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      engineRef.current.resize(rect.width, rect.height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Connect video texture
  useEffect(() => {
    if (engineRef.current && videoRef.current) {
      engineRef.current.setVideoSource(videoRef.current);
    }
  }, []);

  // Play / pause sync
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isPlaying]);

  // Playhead drift sync
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (Math.abs(v.currentTime - currentTime) > 0.25) {
      v.currentTime = currentTime;
    }
  }, [currentTime]);

  // Synchronized Audio Track Playback
  const audioRef = useRef<HTMLAudioElement>(null);
  const activeAudioClip = project.tracks
    .filter((t) => t.type === 'audio' && t.visible && !t.muted)
    .flatMap((t) => t.clips)
    .find((c) => currentTime >= c.start && currentTime <= c.start + c.duration && c.src);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (activeAudioClip && activeAudioClip.src) {
      if (a.src !== activeAudioClip.src && !a.src.endsWith(activeAudioClip.src)) {
        a.src = activeAudioClip.src;
      }
      const clipOffset = currentTime - activeAudioClip.start + (activeAudioClip.inPoint || 0);
      if (Math.abs(a.currentTime - clipOffset) > 0.25) {
        a.currentTime = Math.max(0, clipOffset);
      }
      a.volume = activeAudioClip.volume ?? 0.9;
      if (isPlaying) {
        a.play().catch(() => {});
      } else {
        a.pause();
      }
    } else {
      a.pause();
    }
  }, [isPlaying, currentTime, activeAudioClip]);

  // Update active clips in Three.js
  useEffect(() => {
    if (!engineRef.current) return;
    const allClips = project.tracks.filter((t) => t.visible).flatMap((t) => t.clips);
    engineRef.current.updateActiveClips(allClips, currentTime);
  }, [project.tracks, currentTime]);

  // Format timecode HH:MM:SS
  const formatTimecode = (sec: number) => {
    const s = Math.max(0, sec);
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `00:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, Math.max(0, (currentTime / (project.duration || 1)) * 100));

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    onSeek(percent * project.duration);
  };

  return (
    <div className="bg-white/95 rounded-2xl p-3 border border-slate-200/90 shadow-xs flex flex-col h-full backdrop-blur-md overflow-hidden">
      {/* Decoded Video Stream Element */}
      <video
        ref={videoRef}
        src="/media/sample_cyber_reel.mp4"
        crossOrigin="anonymous"
        playsInline
        muted
        loop
        className="hidden"
        onTimeUpdate={() => {
          if (isPlaying && videoRef.current) {
            onSeek(videoRef.current.currentTime);
          }
        }}
      />

      {/* Decoded Audio Stream Element */}
      <audio ref={audioRef} className="hidden" />

      {/* Main Video Viewport Canvas with rounded frame */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full bg-slate-950 rounded-xl overflow-hidden shadow-inner flex items-center justify-center"
      >
        <canvas ref={canvasRef} className="w-full h-full object-contain block" />

        {/* 3D Motion Graphics Overlay Badge if selected */}
        {selectedClip &&
          (selectedClip.type === 'motion_graphics' || selectedClip.type === 'text') && (
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-cyan-400/40 text-[11px] font-mono text-cyan-300">
              ⚡ {selectedClip.text || '3D Title'}
            </div>
          )}
      </div>

      {/* Scrubber progress line matching reference */}
      <div
        onClick={handleScrubberClick}
        className="mt-3 relative h-2.5 bg-slate-100 rounded-full cursor-pointer flex items-center group overflow-visible"
      >
        <div
          className="h-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
        {/* Scrubber bead head */}
        <div
          className="absolute -top-1 w-4 h-4 rounded-full bg-white border-2 border-violet-600 shadow-md transform -translate-x-1/2 pointer-events-none group-hover:scale-110 transition-transform"
          style={{ left: `${progressPercent}%` }}
        />
      </div>

      {/* Transport Controls Bar matching reference */}
      <div className="mt-2.5 flex items-center justify-between px-1">
        {/* Digital Timecode Readout: 00:00:24 / 00:01:30 */}
        <div className="font-mono text-xs text-slate-600 font-semibold">
          <span className="text-slate-900">{formatTimecode(currentTime)}</span>
          <span className="text-slate-400 mx-1.5">/</span>
          <span className="text-slate-500">{formatTimecode(project.duration)}</span>
        </div>

        {/* Center Transport Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSeek(0)}
            className="p-1 text-slate-500 hover:text-slate-800 transition"
            title="Go to Start"
          >
            <SkipBack className="w-4 h-4 fill-slate-500" />
          </button>

          <button
            onClick={() => onSeek(currentTime - 1 / 30)}
            className="p-1 text-slate-500 hover:text-slate-800 transition"
            title="Frame Backward"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Big Circular Play Button matching reference */}
          <button
            onClick={onTogglePlay}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/30 transition transform active:scale-95"
            title="Play / Pause"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </button>

          <button
            onClick={() => onSeek(currentTime + 1 / 30)}
            className="p-1 text-slate-500 hover:text-slate-800 transition"
            title="Frame Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {}}
            className="p-1 text-slate-400 hover:text-slate-700 transition"
            title="Loop"
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Aspect Ratio Selector & Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Aspect dropdown */}
          <div className="relative">
            <select
              value={project.aspectRatio}
              onChange={(e) => onAspectRatioChange(e.target.value as any)}
              className="appearance-none bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg pl-2.5 pr-6 py-1 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none"
            >
              <option value="16:9">16:9</option>
              <option value="9:16">9:16</option>
              <option value="1:1">1:1</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-2 pointer-events-none" />
          </div>

          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                containerRef.current?.requestFullscreen();
              } else {
                document.exitFullscreen();
              }
            }}
            className="p-1 text-slate-400 hover:text-slate-700 transition"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
