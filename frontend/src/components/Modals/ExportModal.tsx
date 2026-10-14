import React, { useState } from 'react';
import { Download, Film, CheckCircle2, Loader2, Sparkles, Play } from 'lucide-react';
import { api } from '../../services/api';
import { ProjectData } from '../../types/timeline';

interface ExportModalProps {
  isOpen: boolean;
  project: ProjectData;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, project, onClose }) => {
  const [resolution, setResolution] = useState('1080p');
  const [fps, setFps] = useState('30');
  const [bitrate, setBitrate] = useState('high');

  const [rendering, setRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [exportResult, setExportResult] = useState<{
    filename: string;
    url: string;
    downloadUrl: string;
    duration: number;
    resolution: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleStartRender = async () => {
    try {
      setRendering(true);
      setRenderProgress(15);
      setExportResult(null);

      // Progress animation
      const interval = setInterval(() => {
        setRenderProgress((prev) => (prev < 85 ? prev + 12 : prev));
      }, 400);

      const res = await api.renderExport(project);

      clearInterval(interval);
      setRenderProgress(100);
      setExportResult(res);
    } catch (err: any) {
      alert(`Render failed: ${err.message}`);
    } finally {
      setRendering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#0e1320] border border-[#222d42] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-14 border-b border-[#222d42] px-6 flex items-center justify-between bg-[#111728]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Film className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-wide">
                Export & Render Video
              </div>
              <div className="text-[11px] text-slate-400">
                Hardware-accelerated FFmpeg export pipeline
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {!exportResult ? (
            <>
              {/* Output Specs Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Resolution */}
                <div>
                  <label className="text-[11px] font-medium text-slate-400 mb-1 block">
                    Resolution
                  </label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    disabled={rendering}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="1080p">1080p Full HD (1920x1080)</option>
                    <option value="4k">4K Ultra HD (3840x2160)</option>
                    <option value="720p">720p HD (1280x720)</option>
                  </select>
                </div>

                {/* Framerate */}
                <div>
                  <label className="text-[11px] font-medium text-slate-400 mb-1 block">
                    Framerate
                  </label>
                  <select
                    value={fps}
                    onChange={(e) => setFps(e.target.value)}
                    disabled={rendering}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="30">30 FPS (Standard)</option>
                    <option value="60">60 FPS (Ultra Smooth)</option>
                    <option value="24">24 FPS (Cinematic Film)</option>
                  </select>
                </div>
              </div>

              {/* Format & Aspect Ratio info banner */}
              <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800/80 space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="text-slate-500">Format:</span>
                  <span className="font-mono text-cyan-400 font-semibold">MP4 (H.264 / AAC)</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="text-slate-500">Aspect Ratio:</span>
                  <span className="font-mono text-slate-200 font-semibold">{project.aspectRatio}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="text-slate-500">Timeline Duration:</span>
                  <span className="font-mono text-slate-200 font-semibold">{project.duration.toFixed(1)}s</span>
                </div>
              </div>

              {/* Progress bar if rendering */}
              {rendering && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs text-cyan-300">
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Compositing video, audio & motion graphics...
                    </span>
                    <span className="font-mono font-bold">{renderProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${renderProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Render Complete View */
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Render Completed Successfully!
                </h3>
                <p className="text-xs text-slate-400">
                  Your video has been rendered at {exportResult.resolution} with synced audio and motion graphics.
                </p>
              </div>

              {/* Video Preview */}
              <div className="relative rounded-lg overflow-hidden bg-black border border-slate-800 aspect-video max-h-48 mx-auto">
                <video
                  src={exportResult.url}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="pt-2">
                <a
                  href={exportResult.downloadUrl}
                  download={exportResult.filename}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-cyan-500/25 transition"
                >
                  <Download className="w-4 h-4" />
                  Download Rendered MP4
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!exportResult && (
          <div className="h-16 border-t border-[#222d42] px-6 bg-[#111728] flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={rendering}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleStartRender}
              disabled={rendering}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs rounded-lg shadow-lg shadow-cyan-500/20 transition active:scale-95 disabled:opacity-50"
            >
              {rendering ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Rendering...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Start Export
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
