import React from 'react';
import { 
  Bot, 
  Box, 
  Volume2, 
  Film, 
  Zap, 
  Cpu, 
  Sparkles
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface FeatureCard {
  icon: React.ReactNode;
  tag: string;
  title: string;
  description: string;
  specs: string[];
  gradient: string;
}

export const FeatureMatrix: React.FC = () => {
  const features: FeatureCard[] = [
    {
      icon: <Bot className="w-6 h-6 text-indigo-600" />,
      tag: 'AI ORCHESTRATION',
      title: 'Prompt-to-Edit Co-Pilot',
      description: 'Transform complex editing operations into conversational prompts. The AI reads your EDL (Edit Decision List), identifies timestamps, and executes cuts, titles, and VFX instantly.',
      specs: ['Natural language EDL mutations', 'Automatic silence & filler removal', 'Multi-agent reasoning (GPT-4o & Claude)'],
      gradient: 'from-indigo-50 to-white',
    },
    {
      icon: <Box className="w-6 h-6 text-purple-600" />,
      tag: '3D KINETIC ENGINE',
      title: 'Three.js & WebGL Motion Studio',
      description: 'Directly render hardware-accelerated 3D typography, holographic HUD overlays, and GPU particle systems floating in true 3D coordinate space over your footage.',
      specs: ['Extruded glowing 3D typography', 'GPU particle physics (embers, stardust)', 'Real-time GLSL post-processing shaders'],
      gradient: 'from-purple-50 to-white',
    },
    {
      icon: <Volume2 className="w-6 h-6 text-emerald-600" />,
      tag: 'SOUND & SFX SYNTH',
      title: 'Procedural & Neural Audio Engine',
      description: 'Zero-latency procedural sound generation. Synthesize cinematic sub-bass drops, riser sweeps, and whooshes offline using NumPy, or generate ultra-realistic neural speech via ElevenLabs.',
      specs: ['Offline mathematical synth generator', 'Deep sub-bass & cinematic risers', 'ElevenLabs & AudioCraft integrations'],
      gradient: 'from-emerald-50 to-white',
    },
    {
      icon: <Film className="w-6 h-6 text-amber-600" />,
      tag: 'PROFESSIONAL TIMELINE',
      title: 'Full Non-Linear Editor (NLE)',
      description: 'A timeline built for precision creators. Multi-track compositing for video, audio, 3D titles, and shaders with millisecond scissor splits and keyframe interpolation.',
      specs: ['16:9, 9:16 Shorts/Reels & 1:1 Socials', 'Millisecond trimming & scissor split', 'Position, scale, rotation & volume keyframes'],
      gradient: 'from-amber-50 to-white',
    },
    {
      icon: <Zap className="w-6 h-6 text-pink-600" />,
      tag: 'HARDWARE ACCELERATION',
      title: 'FFmpeg NVENC 4K/60FPS Pipeline',
      description: 'Export blockbuster-quality video at blistering speeds. Dedicated hardware GPU encoding concatenates video streams, applies alpha blending, and renders 4K Ultra HD MP4 and ProRes.',
      specs: ['NVIDIA NVENC / AMD AMF hardware render', 'Lossless 4K Ultra HD 60FPS export', 'Multi-channel audio mixing & envelopes'],
      gradient: 'from-pink-50 to-white',
    },
    {
      icon: <Cpu className="w-6 h-6 text-cyan-600" />,
      tag: 'AUTONOMOUS PROTOCOL',
      title: 'Model Context Protocol (MCP) Server',
      description: 'HypKraft ships with a built-in MCP server. External autonomous agents, Antigravity, and Claude Desktop can edit videos, generate assets, and trigger exports completely headlessly.',
      specs: ['Standardized MCP JSON-RPC endpoints', 'Autonomous agent timeline control', 'Python CLI & remote API orchestration'],
      gradient: 'from-cyan-50 to-white',
    },
  ];

  return (
    <div id="features" className="w-full max-w-6xl mx-auto my-20 px-4">
      {/* Title */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200/60 text-indigo-700 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>DEEP TECH ARCHITECTURE</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Six Revolutionary Pillars of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">HypKraft</span>
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
          Built from the ground up for film editors, VFX artists, and AI-first creator workflows.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, idx) => (
          <div
            key={idx}
            onMouseEnter={() => sounds.playBlip()}
            className={`bg-white p-6 rounded-3xl border border-slate-200/90 hover:border-indigo-400/60 shadow-[0_10px_30px_-5px_rgba(99,102,241,0.06)] hover:shadow-[0_20px_40px_-5px_rgba(99,102,241,0.12)] transition-all duration-300 relative overflow-hidden group hover:-translate-y-1 bg-gradient-to-b ${feat.gradient} flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-white border border-slate-100 shadow-xs group-hover:scale-105 transition-transform">
                  {feat.icon}
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase bg-white px-2.5 py-1 rounded-full border border-slate-200">
                  {feat.tag}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {feat.description}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="text-[11px] font-medium text-slate-500 space-y-1.5">
                {feat.specs.map((spec, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
