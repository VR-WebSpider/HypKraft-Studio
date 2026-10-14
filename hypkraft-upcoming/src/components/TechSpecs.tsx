import React, { useState } from 'react';
import { Terminal, Code, Server, Network } from 'lucide-react';
import { sounds } from '../utils/audio';

interface SpecTab {
  id: string;
  name: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  codeSnippet: string;
  details: { label: string; val: string }[];
}

export const TechSpecs: React.FC = () => {
  const tabs: SpecTab[] = [
    {
      id: 'mcp',
      name: 'MCP Agent Protocol',
      icon: <Network className="w-4 h-4" />,
      title: 'Model Context Protocol (MCP) Integration',
      description: 'HypKraft exposes standard JSON-RPC tools for agentic coding environments like Antigravity, Claude Desktop, and LangChain to automate video production end-to-end.',
      codeSnippet: `// Calling HypKraft MCP Tool via JSON-RPC
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "hypkraft_execute_prompt",
    "arguments": {
      "prompt": "Add 3D Cyber Title 'QUANTUM LEAP' at 2s with bass drop",
      "aspect_ratio": "16:9"
    }
  }
}`,
      details: [
        { label: 'Supported Tools', val: 'hypkraft_execute_prompt, hypkraft_generate_sound, hypkraft_render_export' },
        { label: 'Transport', val: 'Standard IO (stdio) & SSE / HTTP REST' },
        { label: 'Agent Autonomy', val: 'Full timeline read & write access' },
      ],
    },
    {
      id: 'backend',
      name: 'Python & FFmpeg Core',
      icon: <Server className="w-4 h-4" />,
      title: 'FastAPI & Hardware-Accelerated Rendering',
      description: 'A dedicated Python backend orchestrates FFmpeg hardware NVENC pipelines, audio track delays, procedural waveform synthesis, and EDL serialization.',
      codeSnippet: `# Procedural Audio Generation (NumPy / SoundFile)
def generate_procedural_bass_drop(duration=1.2, sample_rate=48000):
    t = np.linspace(0, duration, int(sample_rate * duration))
    freq = np.geomspace(160, 32, len(t))
    waveform = np.sin(2 * np.pi * np.cumsum(freq) / sample_rate)
    envelope = np.exp(-3 * t / duration)
    return waveform * envelope`,
      details: [
        { label: 'Framework', val: 'FastAPI + Uvicorn Async Engine' },
        { label: 'Hardware Acceleration', val: 'NVIDIA NVENC, CUDA & Intel QSV' },
        { label: 'Audio Engine', val: 'Zero-latency procedural NumPy + ElevenLabs' },
      ],
    },
    {
      id: 'frontend',
      name: 'React 19 & WebGL',
      icon: <Code className="w-4 h-4" />,
      title: 'Real-Time Kinetic Motion Graphics',
      description: 'A lightweight React 19 + TypeScript + Three.js canvas renders extruded 3D titles and GLSL post-processing shaders with 60 FPS fluidity in your browser.',
      codeSnippet: `// Three.js 3D Kinetic Typo Material
const titleMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x6366f1,
  emissive: 0x8b5cf6,
  emissiveIntensity: 1.2,
  roughness: 0.15,
  metalness: 0.8,
  clearcoat: 1.0,
});`,
      details: [
        { label: '3D Graphics', val: 'Three.js WebGL & Custom GLSL Shaders' },
        { label: 'Frontend Stack', val: 'React 19, TypeScript, Vite & Tailwind CSS' },
        { label: 'Sound Output', val: 'Native Web Audio API & Multi-track envelopes' },
      ],
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div id="tech-specs" className="w-full max-w-5xl mx-auto my-20 px-4">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200/60 text-indigo-700 mb-3">
          <Terminal className="w-3.5 h-3.5" />
          <span>TECHNICAL SPECIFICATIONS</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Under the Hood of <span className="text-indigo-600">HypKraft</span>
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm">
          Engineered for maximum throughput, sub-millisecond timeline precision, and native AI agent interoperability.
        </p>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-[0_15px_40px_-10px_rgba(99,102,241,0.1)]">
        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/60 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                sounds.playBlip();
                setActiveTab(t);
              }}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-semibold transition-all whitespace-nowrap border-b-2 ${
                activeTab.id === t.id
                  ? 'border-indigo-600 text-indigo-600 bg-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {t.icon}
              <span>{t.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {activeTab.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeTab.description}
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              {activeTab.details.map((d, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1">
                  <span className="text-slate-500 font-medium">{d.label}:</span>
                  <span className="text-indigo-700 font-semibold">{d.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs overflow-x-auto shadow-xl">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 border-b border-slate-800 pb-2">
                <span>TERMINAL ARCHITECTURE VIEW</span>
                <span className="text-cyan-400">READ-ONLY</span>
              </div>
              <pre className="text-cyan-300 leading-relaxed overflow-x-auto text-[11px]">
                {activeTab.codeSnippet}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
