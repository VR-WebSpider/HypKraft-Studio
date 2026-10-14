import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, XCircle, Cloud, HardDrive, RefreshCw, Key, Link2 } from 'lucide-react';
import { api } from '../../services/api';
import { ProviderStatus } from '../../types/timeline';

interface ModelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelSettingsModal: React.FC<ModelSettingsModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<ProviderStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [activeLLM, setActiveLLM] = useState('cloud-gemini');
  const [activeSound, setActiveSound] = useState('built-in-synth');
  const [activeVisual, setActiveVisual] = useState('local-comfyui');

  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [elevenlabsKey, setElevenlabsKey] = useState('');

  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [comfyuiUrl, setComfyuiUrl] = useState('http://localhost:8188');
  const [audiocraftUrl, setAudiocraftUrl] = useState('http://localhost:8001');

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const data = await api.getProvidersStatus();
      setStatus(data);
      setActiveLLM(data.active_llm);
      setActiveSound(data.active_sound);
      setActiveVisual(data.active_visual);
      if (data.providers.local_ollama?.url) setOllamaUrl(data.providers.local_ollama.url);
      if (data.providers.local_comfyui?.url) setComfyuiUrl(data.providers.local_comfyui.url);
      if (data.providers.local_audiocraft?.url) setAudiocraftUrl(data.providers.local_audiocraft.url);
    } catch (err) {
      console.error('Failed to load provider status', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.updateProvidersConfig({
        active_llm_provider: activeLLM,
        active_sound_provider: activeSound,
        active_visual_provider: activeVisual,
        gemini_api_key: geminiKey || undefined,
        openai_api_key: openaiKey || undefined,
        elevenlabs_api_key: elevenlabsKey || undefined,
        ollama_url: ollamaUrl,
        comfyui_url: comfyuiUrl,
        audiocraft_url: audiocraftUrl
      });
      await loadStatus();
      onClose();
    } catch (err: any) {
      alert(`Failed to save settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#0e1320] border border-[#222d42] rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="h-14 border-b border-[#222d42] px-6 flex items-center justify-between bg-[#111728]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-wide">
                AI Model & Provider Hub
              </div>
              <div className="text-[11px] text-slate-400">
                Orchestrate Cloud LLMs and locally installed AI models
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

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Active Model Selectors */}
          <div className="space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="text-xs uppercase font-mono text-cyan-400 font-semibold tracking-wider">
              Active Model Architecture
            </div>

            {/* LLM Reasoning Provider */}
            <div className="grid grid-cols-3 gap-2 items-center">
              <span className="text-xs text-slate-300 font-medium">Prompt-to-Edit LLM:</span>
              <select
                value={activeLLM}
                onChange={(e) => setActiveLLM(e.target.value)}
                className="col-span-2 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="cloud-gemini">Google Gemini 2.0 (Cloud)</option>
                <option value="cloud-openai">OpenAI GPT-4o (Cloud)</option>
                <option value="local-ollama">Ollama Llama-3 / Mistral (Local)</option>
                <option value="local-lmstudio">LM Studio (Local v1 API)</option>
              </select>
            </div>

            {/* Sound & Music Provider */}
            <div className="grid grid-cols-3 gap-2 items-center">
              <span className="text-xs text-slate-300 font-medium">Audio & Sound FX:</span>
              <select
                value={activeSound}
                onChange={(e) => setActiveSound(e.target.value)}
                className="col-span-2 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="built-in-synth">Built-in Procedural Audio Synth (Zero-latency Local)</option>
                <option value="cloud-elevenlabs">ElevenLabs Sound Gen (Cloud)</option>
                <option value="local-audiocraft">AudioCraft MusicGen / AudioGen (Local)</option>
                <option value="local-bark">Bark / XTTS (Local)</option>
              </select>
            </div>

            {/* Video & Visual Gen Provider */}
            <div className="grid grid-cols-3 gap-2 items-center">
              <span className="text-xs text-slate-300 font-medium">Video/Image Gen:</span>
              <select
                value={activeVisual}
                onChange={(e) => setActiveVisual(e.target.value)}
                className="col-span-2 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="local-comfyui">ComfyUI / Diffusers (Local GPU)</option>
                <option value="cloud-replicate">Replicate Flux / Wan2.1 (Cloud)</option>
                <option value="cloud-openai">OpenAI Sora / DALL-E (Cloud)</option>
              </select>
            </div>
          </div>

          {/* Local Service Endpoints */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>Local Model Endpoints</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-300">Ollama Local URL</span>
                  {status?.providers.local_ollama.online ? (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                      <CheckCircle2 className="w-3 h-3" /> Online
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                      <XCircle className="w-3 h-3" /> Standby
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={ollamaUrl}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-300">ComfyUI Local URL</span>
                  {status?.providers.local_comfyui.online ? (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                      <CheckCircle2 className="w-3 h-3" /> Online
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                      <XCircle className="w-3 h-3" /> Standby
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={comfyuiUrl}
                  onChange={(e) => setComfyuiUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Cloud API Keys */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Cloud className="w-4 h-4 text-cyan-400" />
              <span>Cloud API Keys (Optional)</span>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                  <span>Google Gemini API Key</span>
                  {status?.providers.cloud_gemini.configured && (
                    <span className="text-emerald-400 font-mono text-[10px]">Configured</span>
                  )}
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                  <span>OpenAI API Key</span>
                  {status?.providers.cloud_openai.configured && (
                    <span className="text-emerald-400 font-mono text-[10px]">Configured</span>
                  )}
                </label>
                <input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                  <span>ElevenLabs API Key</span>
                  {status?.providers.cloud_elevenlabs.configured && (
                    <span className="text-emerald-400 font-mono text-[10px]">Configured</span>
                  )}
                </label>
                <input
                  type="password"
                  value={elevenlabsKey}
                  onChange={(e) => setElevenlabsKey(e.target.value)}
                  placeholder="xi-api-key..."
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="h-16 border-t border-[#222d42] px-6 bg-[#111728] flex items-center justify-between">
          <button
            onClick={loadStatus}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Status
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg shadow-lg shadow-cyan-500/20 transition active:scale-95"
            >
              {saving ? 'Saving...' : 'Apply & Save Config'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
