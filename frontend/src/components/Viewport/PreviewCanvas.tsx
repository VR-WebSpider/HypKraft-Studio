import React, { useEffect, useRef, useState } from 'react';
import { ThreeStudioEngine } from '../../services/threeEngine';
import { ProjectData, Clip } from '../../types/timeline';

interface PreviewCanvasProps {
  project: ProjectData;
  currentTime: number;
  isPlaying: boolean;
  selectedClip: Clip | null;
  onUpdateClip: (clipId: string, updates: Partial<Clip>) => void;
  onTimeUpdate: (time: number) => void;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  project,
  currentTime,
  isPlaying,
  selectedClip,
  onUpdateClip,
  onTimeUpdate
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const engineRef = useRef<ThreeStudioEngine | null>(null);

  // Video track resolution & source selection
  const [activeVideoSrc, setActiveVideoSrc] = useState<string>('');

  // Find active video clip
  useEffect(() => {
    const videoTrack = project.tracks.find(t => t.type === 'video' && t.visible);
    if (!videoTrack) {
      setActiveVideoSrc('');
      return;
    }
    const currentVideoClip = videoTrack.clips.find(
      c => currentTime >= c.start && currentTime <= c.start + c.duration
    );
    if (currentVideoClip && currentVideoClip.src) {
      if (activeVideoSrc !== currentVideoClip.src) {
        setActiveVideoSrc(currentVideoClip.src);
      }
    }
  }, [currentTime, project.tracks, activeVideoSrc]);

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

  // Connect video element to Three.js texture when video element is ready
  useEffect(() => {
    if (engineRef.current && videoRef.current) {
      engineRef.current.setVideoSource(videoRef.current);
    }
  }, [activeVideoSrc]);

  // Sync Video playback with currentTime & isPlaying
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (isPlaying) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Only set currentTime if drift is noticeable (> 0.25s) to avoid stuttering
    const diff = Math.abs(v.currentTime - currentTime);
    if (diff > 0.25) {
      v.currentTime = currentTime;
    }
  }, [currentTime]);

  // Update Three.js 3D motion graphics & shader passes
  useEffect(() => {
    if (!engineRef.current) return;
    const allClips = project.tracks
      .filter(t => t.visible)
      .flatMap(t => t.clips);

    engineRef.current.updateActiveClips(allClips, currentTime);
  }, [project.tracks, currentTime]);

  // Compute aspect ratio CSS box
  const getAspectClass = () => {
    switch (project.aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] max-h-[82vh] max-w-[46vh]';
      case '1:1':
        return 'aspect-square max-h-[82vh] max-w-[82vh]';
      case '16:9':
      default:
        return 'aspect-video max-h-[82vh] max-w-[95%]';
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1 w-full h-full bg-[#07090e] flex items-center justify-center overflow-hidden p-4 select-none"
    >
      {/* Hidden decoded HTML5 Video player feeding Three.js VideoTexture */}
      {activeVideoSrc && (
        <video
          ref={videoRef}
          src={activeVideoSrc}
          crossOrigin="anonymous"
          playsInline
          muted
          className="hidden"
          onTimeUpdate={() => {
            if (isPlaying && videoRef.current) {
              onTimeUpdate(videoRef.current.currentTime);
            }
          }}
        />
      )}

      {/* Canvas Viewport Frame with Aspect Ratio */}
      <div
        className={`relative ${getAspectClass()} w-full bg-black rounded-lg shadow-2xl shadow-black/80 border border-slate-800/80 overflow-hidden flex items-center justify-center`}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain block"
        />

        {/* Viewport Info Overlay (Aspect Ratio & FPS) */}
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-cyan-400">
            {project.aspectRatio}
          </span>
          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
            30 FPS
          </span>
        </div>

        {/* Direct on-screen interactive position gizmo if a 3D title/graphic is selected */}
        {selectedClip &&
          (selectedClip.type === 'motion_graphics' || selectedClip.type === 'text') && (
            <div className="absolute inset-0 pointer-events-none border-2 border-cyan-500/40 rounded">
              <div className="absolute top-2 right-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded text-[11px] font-mono text-cyan-300 border border-cyan-500/30 flex items-center gap-2">
                <span>🎯 {selectedClip.text || '3D Object'}</span>
                <span className="text-slate-400">
                  Scale: {selectedClip.transform?.scale ?? 1.0}x
                </span>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
