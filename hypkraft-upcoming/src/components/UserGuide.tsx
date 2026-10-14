import React, { useState } from 'react';
import {
  BookOpen,
  Terminal,
  Video,
  Music,
  Layers,
  Cpu,
  CheckCircle2,
  HardDrive,
  Copy,
  Check,
  ShieldAlert
} from 'lucide-react';
import { sounds } from '../utils/audio';

export const UserGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'prompt' | 'motion' | 'audio' | 'mcp' | 'eula'>('quickstart');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    sounds.playBlip();
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const tabs = [
    { id: 'quickstart', label: '1. Quickstart & Setup', icon: HardDrive },
    { id: 'prompt', label: '2. Prompt-to-Timeline AI', icon: Video },
    { id: 'motion', label: '3. 3D Motion & WebGL', icon: Layers },
    { id: 'audio', label: '4. Procedural Audio', icon: Music },
    { id: 'mcp', label: '5. MCP Agent Protocol', icon: Terminal },
    { id: 'eula', label: '6. EULA & Legal', icon: ShieldAlert },
  ];

  return (
    <section id="user-guide" className="max-w-5xl mx-auto my-20 px-4 scroll-mt-20">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 mb-3 shadow-xs">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>OFFICIAL DOCUMENTATION & MANUAL</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          HypKraft Studio User Guide
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mt-2">
          Everything you need to master prompt-to-video editing, 3D kinetic typography, procedural audio synthesis, and autonomous agent control.
        </p>
      </div>

      {/* Guide Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 overflow-x-auto scrollbar-none p-2 gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  sounds.playBlip();
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8">
          {/* TAB 1: QUICKSTART */}
          {activeTab === 'quickstart' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Getting Started with HypKraft Studio
                  </h3>
                  <p className="text-xs text-slate-500">
                    Zero-prerequisite standalone installation for Windows 10 & 11
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  NO NODE.JS OR PYTHON NEEDED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Download the Setup</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Click "Download Installer (.exe)" from the top download section. The bundle contains the complete self-contained executable.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Accept the EULA</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    During setup, check the mandatory license agreement checkbox to verify your terms of service acceptance and proceed.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    3
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Launch Studio</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Launch HypKraft Studio directly from your Desktop or Start Menu. No configuration or command-line commands required!
                  </p>
                </div>
              </div>

              <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl space-y-2 text-xs text-slate-700">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <span>Standalone Architecture Highlights</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                  <li><strong>Embedded V8 & Chromium Runtime:</strong> High-performance UI with zero external runtime installations.</li>
                  <li><strong>WebGL 2.0 Hardware Acceleration:</strong> GPU-rendered shaders, bloom, chromatic aberration, and particle systems.</li>
                  <li><strong>Local Storage Projects:</strong> Autosaves your edits locally with zero telemetry tracking.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: PROMPT-TO-TIMELINE */}
          {activeTab === 'prompt' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Prompt-to-Timeline AI Orchestration
                </h3>
                <p className="text-xs text-slate-500">
                  Transform natural language instructions into multi-track video sequences
                </p>
              </div>

              <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl font-mono text-xs space-y-3">
                <div className="text-slate-400 text-[11px]">EXAMPLE NATURAL LANGUAGE PROMPTS:</div>
                <div className="p-2.5 bg-slate-800 rounded-xl text-emerald-400">
                  "Create a 15-second cyberpunk trailer with flying neon vehicles, extruded 3D text 'NEO TOKYO 2099', and cinematic synth bass drop at second 4."
                </div>
                <div className="p-2.5 bg-slate-800 rounded-xl text-cyan-400">
                  "Add a holographic glitch transition between clip 1 and clip 2, and lower background music volume by 30%."
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Supported Timeline Actions:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div><strong>Multi-Track Compositing:</strong> Independent video, motion graphics, audio SFX, and ambient music tracks.</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div><strong>Precise Trimming & Splitting:</strong> Split clips at playhead using <kbd className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">Ctrl+K</kbd>.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 3D MOTION GRAPHICS */}
          {activeTab === 'motion' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Three.js 3D Motion Graphics & WebGL Shaders
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time procedural GPU shaders directly inside the video viewport
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900">Extruded 3D Typography</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Custom GLSL iridescent ribbons and bevels rendered dynamically based on your text prompt. Adjust depth, bevel curvature, and ambient neon glow.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900">Real-Time Post-Processing</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Unreal Engine-style bloom, scanlines, chromatic aberration, and holographic HUD overlays render in real time at 60 FPS without pre-rendering delays.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROCEDURAL AUDIO */}
          {activeTab === 'audio' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Procedural Audio Synthesizer
                </h3>
                <p className="text-xs text-slate-500">
                  Web Audio API waveform synthesis and spatial sound design
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                HypKraft includes a native procedural sound synthesis engine that generates cinematic whooshes, sub-bass impacts, laser sweeps, and ambient tonal pads directly in code with 48,000 Hz 32-bit float accuracy.
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-800">Pre-Configured Sound Presets:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-600">
                  <span className="p-2 bg-white rounded-lg border border-slate-200">Cinematic Bass Drop</span>
                  <span className="p-2 bg-white rounded-lg border border-slate-200">Hologram HUD Blip</span>
                  <span className="p-2 bg-white rounded-lg border border-slate-200">Cyber Glitch Impact</span>
                  <span className="p-2 bg-white rounded-lg border border-slate-200">Sub-Woofer Riser</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MCP PROTOCOL */}
          {activeTab === 'mcp' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Model Context Protocol (MCP) Server
                  </h3>
                  <p className="text-xs text-slate-500">
                    Control HypKraft headlessly from Claude Desktop, Cursor, or Antigravity
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  PORT 8000 // STDIO
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Add HypKraft Studio to your Claude Desktop or Cursor configuration to empower autonomous coding agents to edit video timelines, inspect clips, and trigger renders:
              </p>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs relative overflow-hidden">
                <button
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(
                        {
                          mcpServers: {
                            hypkraft: {
                              command: 'npx',
                              args: ['-y', 'hypkraft-mcp-server'],
                              env: {
                                HYPKRAFT_STUDIO_URL: 'http://localhost:8000'
                              }
                            }
                          }
                        },
                        null,
                        2
                      ),
                      'mcp'
                    )
                  }
                  className="absolute top-3 right-3 text-xs bg-slate-800 hover:bg-slate-700 text-indigo-400 px-3 py-1 rounded-lg flex items-center gap-1.5 transition"
                >
                  {copiedCode === 'mcp' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'mcp' ? 'Copied' : 'Copy JSON'}</span>
                </button>
                <pre className="overflow-x-auto text-[11px] text-slate-300">
{`{
  "mcpServers": {
    "hypkraft": {
      "command": "npx",
      "args": ["-y", "hypkraft-mcp-server"],
      "env": {
        "HYPKRAFT_STUDIO_URL": "http://localhost:8000"
      }
    }
  }
}`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 6: EULA & LEGAL */}
          {activeTab === 'eula' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  End User License Agreement (EULA) & Privacy Policy
                </h3>
                <p className="text-xs text-slate-500">
                  Official terms governing the use of HypKraft Studio v1.0.0
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900">1. Full Creator Ownership Guarantee</div>
                  <p>
                    All content, artwork, timeline compositions, audio waveforms, and final video exports created by you are 100% your exclusive intellectual property. WebSpider Studios claims no royalty or licensing right over your creations.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900">2. Privacy & Security Standards</div>
                  <p>
                    HypKraft Studio is built with zero surveillance architecture. Your local clips and project files remain stored locally on your hard drive. No secret data harvest or unauthorized media transmission is conducted.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900">3. Non-Exclusive License</div>
                  <p>
                    The executable application is licensed for personal and commercial creative work. Redistribution of modified or exploit-injected binaries is strictly prohibited.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
