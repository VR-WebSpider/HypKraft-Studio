import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  Upload,
  Music,
  Film,
  Plus,
  Volume2,
  Sparkles,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api';
import { Clip } from '../../types/timeline';

interface MediaLibraryPanelProps {
  currentTime: number;
  onAddClip: (trackId: string, clip: Clip) => void;
  onClose: () => void;
}

export const MediaLibraryPanel: React.FC<MediaLibraryPanelProps> = ({
  currentTime,
  onAddClip,
  onClose
}) => {
  const [tab, setTab] = useState<'library' | 'ai_sound'>('library');
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // AI Sound Synth form state
  const [soundPrompt, setSoundPrompt] = useState('cyberpunk whoosh transition');
  const [soundCategory, setSoundCategory] = useState('sfx');
  const [soundDuration, setSoundDuration] = useState(3.0);
  const [generatingSound, setGeneratingSound] = useState(false);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const list = await api.getMediaList();
      setMediaList(list);
    } catch (err) {
      console.error('Failed to load media list', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await api.uploadMedia(file);
      await loadMedia();

      // Add to timeline
      if (res.type === 'video') {
        const clip: Clip = {
          id: `clip_v_${Date.now()}`,
          name: res.name,
          type: 'video',
          src: res.url,
          start: currentTime,
          duration: Math.min(res.metadata?.duration || 10, 15),
          inPoint: 0,
          volume: 1.0
        };
        onAddClip('track_video_1', clip);
      } else if (res.type === 'audio') {
        const clip: Clip = {
          id: `clip_a_${Date.now()}`,
          name: res.name,
          type: 'audio',
          src: res.url,
          start: currentTime,
          duration: Math.min(res.metadata?.duration || 5, 10),
          inPoint: 0,
          volume: 0.9
        };
        onAddClip('track_audio_1', clip);
      }
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateSound = async () => {
    if (!soundPrompt.trim() || generatingSound) return;
    try {
      setGeneratingSound(true);
      const result = await api.generateSound(soundPrompt, soundCategory, soundDuration);
      
      // Auto-insert audio clip to audio track
      const clip: Clip = {
        id: `clip_sfx_${Date.now()}`,
        name: `AI: ${soundPrompt.slice(0, 18)}`,
        type: 'audio',
        src: result.url,
        start: currentTime,
        duration: soundDuration,
        inPoint: 0,
        volume: 0.85
      };
      onAddClip('track_audio_1', clip);
      await loadMedia();
    } catch (err: any) {
      alert(`Audio synthesis failed: ${err.message}`);
    } finally {
      setGeneratingSound(false);
    }
  };

  const handleInsertMedia = (media: any) => {
    if (media.type === 'audio') {
      const clip: Clip = {
        id: `clip_a_${Date.now()}`,
        name: media.name,
        type: 'audio',
        src: media.url,
        start: currentTime,
        duration: 4.0,
        inPoint: 0,
        volume: 0.9
      };
      onAddClip('track_audio_1', clip);
    } else {
      const clip: Clip = {
        id: `clip_v_${Date.now()}`,
        name: media.name,
        type: 'video',
        src: media.url,
        start: currentTime,
        duration: 6.0,
        inPoint: 0,
        volume: 1.0
      };
      onAddClip('track_video_1', clip);
    }
  };

  return (
    <div className="w-96 bg-[#0c101a] border-l border-[#1c2436] flex flex-col h-full shadow-2xl select-none z-10">
      {/* Panel Header */}
      <div className="h-12 border-b border-[#1c2436] px-4 flex items-center justify-between bg-[#0e1320]">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Media & Sound Synth
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
        <button
          onClick={() => setTab('library')}
          className={`flex-1 py-1.5 rounded text-[11px] font-medium transition ${
            tab === 'library'
              ? 'bg-amber-600/30 text-amber-300 font-semibold border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Asset Library
        </button>
        <button
          onClick={() => setTab('ai_sound')}
          className={`flex-1 py-1.5 rounded text-[11px] font-medium transition ${
            tab === 'ai_sound'
              ? 'bg-cyan-600/30 text-cyan-300 font-semibold border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          AI Sound Synth
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tab === 'library' ? (
          <>
            {/* Upload Button Box */}
            <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition group">
              <Upload className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 mb-2 transition" />
              <span className="text-xs font-medium text-slate-300 group-hover:text-white">
                {uploading ? 'Importing media file...' : 'Upload Video or Audio'}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 font-mono">
                MP4, MOV, MP3, WAV, WebM
              </span>
              <input
                type="file"
                accept="video/*,audio/*,image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {/* Media Items List */}
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold">
                Available Media Files
              </div>
              {loading ? (
                <div className="flex items-center gap-2 text-xs text-slate-400 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  Loading assets...
                </div>
              ) : mediaList.length === 0 ? (
                <div className="text-xs text-slate-500 py-4 text-center">
                  No uploaded assets yet.
                </div>
              ) : (
                mediaList.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-lg flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {m.type === 'audio' ? (
                        <Music className="w-4 h-4 text-sky-400 shrink-0" />
                      ) : (
                        <Film className="w-4 h-4 text-indigo-400 shrink-0" />
                      )}
                      <div className="truncate">
                        <div className="text-xs font-medium text-slate-200 truncate">
                          {m.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase">
                          {m.type}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleInsertMedia(m)}
                      className="px-2 py-1 bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 text-xs rounded border border-slate-700 hover:border-cyan-500/40 transition shrink-0"
                      title="Insert to Timeline at Playhead"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          /* AI Sound Synth Tab */
          <div className="space-y-4">
            <div className="p-3 bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-300">
                  AI Sound & SFX Generator
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Synthesize custom cinematic risers, sub-bass drops, ambient textures, or whooshes locally or via cloud.
              </p>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                Sound Description / Prompt
              </label>
              <input
                type="text"
                value={soundPrompt}
                onChange={(e) => setSoundPrompt(e.target.value)}
                placeholder="e.g. heavy bass drop with cyber reverb..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none"
              />
            </div>

            {/* Quick sound prompt pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                'cyber-whoosh transition',
                'sub bass impact drop',
                'ambient synth pad',
                'exponential riser',
                'glitch stutter hit'
              ].map((s, i) => (
                <button
                  key={i}
                  onClick={() => setSoundPrompt(s)}
                  className="text-[10px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 px-2 py-0.5 rounded border border-slate-800"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Duration Slider */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>Duration</span>
                <span className="font-mono text-cyan-400">{soundDuration.toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.5"
                value={soundDuration}
                onChange={(e) => setSoundDuration(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <button
              onClick={handleGenerateSound}
              disabled={generatingSound || !soundPrompt.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs rounded-lg shadow-md shadow-cyan-500/20 transition disabled:opacity-40"
            >
              {generatingSound ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Synthesizing Audio...
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  Synthesize & Insert to Timeline
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
