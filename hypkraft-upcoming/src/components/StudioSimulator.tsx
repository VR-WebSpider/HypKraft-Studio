import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Wand2, 
  Sliders, 
  Layers, 
  Cpu, 
  RefreshCw,
  Terminal
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface PresetPrompt {
  id: string;
  label: string;
  prompt: string;
  titleText: string;
  shader: 'vhs' | 'rgb' | 'bloom' | 'embers' | 'matrix' | 'clean';
  soundType: 'bass' | 'whoosh' | 'glitch';
}

const PRESET_PROMPTS: PresetPrompt[] = [
  {
    id: 'cyber-title',
    label: '⚡ 3D Cyber Title',
    prompt: 'Add extruded 3D Neon Title "HYPKRAFT STUDIOS" with pulsing cyan emission at 02.0s',
    titleText: 'HYPKRAFT STUDIOS',
    shader: 'bloom',
    soundType: 'bass',
  },
  {
    id: 'vhs-glitch',
    label: '📼 Retro VHS Glitch',
    prompt: 'Apply 1980s Retro VHS tracking distortion, chromatic jitter and scanlines',
    titleText: 'SIGNAL LOST // 1984',
    shader: 'vhs',
    soundType: 'glitch',
  },
  {
    id: 'embers-vfx',
    label: '✨ Golden Embers',
    prompt: 'Attach GPU particle physics with 400 floating golden embers and soft depth of field',
    titleText: 'CINEMATIC HORIZON',
    shader: 'embers',
    soundType: 'whoosh',
  },
  {
    id: 'matrix-rain',
    label: '🟢 Matrix Digital Rain',
    prompt: 'Inject streaming green binary code rain and cyber glyph overlays',
    titleText: 'MAINFRAME OVERRIDE',
    shader: 'matrix',
    soundType: 'glitch',
  },
  {
    id: 'chromatic-drop',
    label: '💥 RGB Split Bass Drop',
    prompt: 'Split timeline at 04.2s, trigger intense RGB chromatic aberration and 40Hz sub-bass drop',
    titleText: 'IMPACT DROP',
    shader: 'rgb',
    soundType: 'bass',
  },
];

export const StudioSimulator: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activePrompt, setActivePrompt] = useState(PRESET_PROMPTS[0].prompt);
  const [customPrompt, setCustomPrompt] = useState('');
  const [titleText, setTitleText] = useState(PRESET_PROMPTS[0].titleText);
  const [activeShader, setActiveShader] = useState<'vhs' | 'rgb' | 'bloom' | 'embers' | 'matrix' | 'clean'>('bloom');
  const [currentTime, setCurrentTime] = useState(2.4);
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    'System ready. HypKraft AI Engine connected to WebGL rendering context.',
    'Listening for natural language prompt mutations...',
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.05;
        return next > 10.0 ? 0.0 : next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Canvas visual rendering loop for the video monitor
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    // Embers
    const emberParticles = Array.from({ length: 60 }, () => ({
      x: Math.random() * 640,
      y: Math.random() * 360,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -Math.random() * 2 - 0.5,
      size: Math.random() * 3 + 1,
      alpha: Math.random() * 0.8 + 0.2,
    }));

    // Matrix characters
    const matrixChars = '010101HYPKRAFTXYZ890';
    const matrixDrops = Array.from({ length: 32 }, () => Math.random() * 360);

    const renderMonitor = () => {
      angle += 0.025;
      const w = canvas.width;
      const h = canvas.height;

      // Dark sci-fi stage background
      ctx.fillStyle = '#080a14';
      ctx.fillRect(0, 0, w, h);

      // Deep perspective grid floor
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = 1;
      const horizon = h * 0.65;

      ctx.beginPath();
      for (let x = -w * 0.5; x <= w * 1.5; x += 40) {
        ctx.moveTo(w / 2, horizon);
        ctx.lineTo(x, h);
      }
      for (let y = horizon; y <= h; y += 18) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // Matrix Rain Shader
      if (activeShader === 'matrix') {
        ctx.fillStyle = 'rgba(0, 255, 100, 0.7)';
        ctx.font = '11px monospace';
        for (let i = 0; i < matrixDrops.length; i++) {
          const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          const x = i * 20;
          const y = matrixDrops[i];
          ctx.fillText(char, x, y);
          matrixDrops[i] += 4;
          if (matrixDrops[i] > h) matrixDrops[i] = 0;
        }
      }

      // Golden Embers Particle VFX
      if (activeShader === 'embers') {
        for (const p of emberParticles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < 0) {
            p.y = h;
            p.x = Math.random() * w;
          }
          ctx.fillStyle = '#ffb800';
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#ff8800';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      }

      // Render 3D Wireframe Cube / Hologram in Center
      ctx.save();
      ctx.translate(w / 2, horizon - 50);

      // Rotate Wireframe Box
      const boxSize = 75;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const cosB = Math.cos(angle * 0.7);
      const sinB = Math.sin(angle * 0.7);

      const vertices = [
        [-boxSize, -boxSize, -boxSize],
        [boxSize, -boxSize, -boxSize],
        [boxSize, boxSize, -boxSize],
        [-boxSize, boxSize, -boxSize],
        [-boxSize, -boxSize, boxSize],
        [boxSize, -boxSize, boxSize],
        [boxSize, boxSize, boxSize],
        [-boxSize, boxSize, boxSize],
      ];

      // 3D rotation projection
      const proj = vertices.map(([x, y, z]) => {
        // Y-axis rot
        let x1 = x * cosA - z * sinA;
        let z1 = z * cosA + x * sinA;
        // X-axis rot
        let y2 = y * cosB - z1 * sinB;
        let z2 = z1 * cosB + y * sinB;
        const scale = 250 / (z2 + 350);
        return [x1 * scale, y2 * scale];
      });

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];

      ctx.strokeStyle = activeShader === 'bloom' ? '#00f0ff' : activeShader === 'embers' ? '#ffb800' : '#8b5cf6';
      ctx.shadowBlur = activeShader === 'bloom' ? 20 : 8;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.lineWidth = 2;
      ctx.beginPath();
      edges.forEach(([i, j]) => {
        ctx.moveTo(proj[i][0], proj[i][1]);
        ctx.lineTo(proj[j][0], proj[j][1]);
      });
      ctx.stroke();
      ctx.restore();

      // Kinetic 3D Title Overlay
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 24px system-ui, sans-serif';

      if (activeShader === 'rgb') {
        // Chromatic Aberration RGB split
        ctx.fillStyle = 'rgba(255, 0, 50, 0.8)';
        ctx.fillText(titleText, w / 2 - 4, horizon - 50);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
        ctx.fillText(titleText, w / 2 + 4, horizon - 50);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(titleText, w / 2, horizon - 50);
      } else {
        ctx.shadowBlur = activeShader === 'bloom' ? 25 : 10;
        ctx.shadowColor = activeShader === 'embers' ? '#ffaa00' : '#00f0ff';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(titleText, w / 2, horizon - 50);
      }
      ctx.restore();

      // VHS Glitch & Scanline Overlay
      if (activeShader === 'vhs') {
        // Scanlines
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        for (let y = 0; y < h; y += 4) {
          ctx.fillRect(0, y, w, 2);
        }
        // Tracking noise bar
        const noiseY = (Date.now() / 6) % h;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.fillRect(0, noiseY, w, 12);

        // VHS REC badge
        ctx.font = '12px monospace';
        ctx.fillStyle = '#ff0055';
        ctx.fillText('● REC [SP 00:24]', 40, 25);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('VHS TRACKING: AUTO', w - 140, 25);
      }

      // HUD Overlays
      ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
      ctx.font = '10px monospace';
      ctx.fillText(`HYPKRAFT 4K UHD // 60FPS // SHADER: [${activeShader.toUpperCase()}]`, 20, h - 20);
      ctx.fillText(`TC: 00:00:0${currentTime.toFixed(2)}`, w - 120, h - 20);

      animId = requestAnimationFrame(renderMonitor);
    };

    renderMonitor();
    return () => cancelAnimationFrame(animId);
  }, [activeShader, titleText, currentTime]);

  const executeSimulation = (promptItem: PresetPrompt) => {
    setIsProcessing(true);
    setActivePrompt(promptItem.prompt);
    sounds.playBlip();

    setLogs((prev) => [
      `[AI Co-Pilot] Parsing prompt: "${promptItem.prompt}"...`,
      ...prev.slice(0, 8),
    ]);

    setTimeout(() => {
      // Play sound effect corresponding to edit
      if (promptItem.soundType === 'bass') sounds.playBassDrop();
      else if (promptItem.soundType === 'glitch') sounds.playGlitch();
      else sounds.playWhoosh();

      setTitleText(promptItem.titleText);
      setActiveShader(promptItem.shader);
      setIsProcessing(false);

      setLogs((prev) => [
        `[EDL Master] Keyframe created @ T+02.0s -> Shaders: [${promptItem.shader.toUpperCase()}], Audio: synthesized.`,
        `[Success] HypKraft Timeline successfully updated!`,
        ...prev.slice(0, 8),
      ]);
    }, 450);
  };

  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsProcessing(true);
    sounds.playBlip();
    const prompt = customPrompt;
    setCustomPrompt('');

    setLogs((prev) => [
      `[User Prompt] "${prompt}"`,
      `[LLM Orchestrator] Analyzing video context & synthesizing motion graphics...`,
      ...prev.slice(0, 8),
    ]);

    setTimeout(() => {
      sounds.playBassDrop();
      setTitleText(prompt.slice(0, 22).toUpperCase());
      setActiveShader('bloom');
      setIsProcessing(false);

      setLogs((prev) => [
        `[HypKraft Pipeline] 3D Title rendered: "${prompt.slice(0, 22).toUpperCase()}"`,
        `[EDL Action] Hardware-accelerated GPU export frame ready.`,
        ...prev.slice(0, 8),
      ]);
    }, 600);
  };

  return (
    <div id="interactive-studio" className="w-full max-w-6xl mx-auto my-16 px-4">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>INTERACTIVE SANDBOX // LIVE DEMO</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">
          Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">Prompt-to-Edit Engine</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
          Click any preset prompt or write your own to watch HypKraft parse commands, synthesize procedural audio, mutate the timeline, and trigger real-time WebGL shaders.
        </p>
      </div>

      {/* Main Studio Frame */}
      <div className="glass-panel-glow rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl">
        {/* Studio Top Bar */}
        <div className="bg-black/60 px-4 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 animate-pulse" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="text-xs font-mono text-gray-300 ml-2 font-bold tracking-wider">
              HYPKRAFT STUDIO // VIRTUAL RUNTIME
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded border border-white/10">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>NVENC CUDA // 4K 60FPS</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded border border-white/10">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>4 ACTIVE TRACKS</span>
            </span>
          </div>
        </div>

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Preset Prompts & Console (5 cols) */}
          <div className="lg:col-span-5 p-5 border-b lg:border-b-0 lg:border-r border-white/10 bg-black/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5" />
                  Prompt Co-Pilot Presets
                </span>
                <span className="text-[11px] text-gray-400">Click to execute</span>
              </div>

              {/* Prompt buttons */}
              <div className="space-y-2 mb-4">
                {PRESET_PROMPTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => executeSimulation(p)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all duration-200 ${
                      activePrompt === p.prompt
                        ? 'bg-cyan-500/15 border-cyan-400/60 text-white shadow-lg shadow-cyan-500/10'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="font-semibold text-cyan-300 mb-1 flex items-center justify-between">
                      <span>{p.label}</span>
                      <span className="text-[10px] uppercase font-mono text-gray-400">
                        {p.shader}
                      </span>
                    </div>
                    <p className="text-gray-400 line-clamp-2 leading-relaxed text-[11px]">
                      {p.prompt}
                    </p>
                  </button>
                ))}
              </div>

              {/* Custom Prompt Input */}
              <form onSubmit={handleCustomPromptSubmit} className="mb-4">
                <label className="block text-[11px] font-mono text-gray-400 mb-1.5">
                  Type Custom Natural Language Instruction:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. 'Add cyber glitch and cinematic riser'"
                    className="flex-1 bg-black/70 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans"
                  />
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>Simulate</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Agent Terminal Logs */}
            <div className="bg-black/90 rounded-xl border border-white/10 p-3 font-mono text-[11px]">
              <div className="flex items-center gap-1.5 text-gray-400 mb-2 border-b border-white/10 pb-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] uppercase font-semibold text-gray-300">
                  Agent Execution Telemetry
                </span>
              </div>
              <div className="h-28 overflow-y-auto space-y-1 text-gray-300 scrollbar-thin">
                {logs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`leading-tight ${
                      idx === 0 ? 'text-cyan-300 font-semibold' : 'text-gray-400'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Video Monitor & Timeline (7 cols) */}
          <div className="lg:col-span-7 p-5 flex flex-col justify-between bg-black/20">
            {/* Monitor Container */}
            <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black shadow-inner aspect-video max-h-[360px] flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={640}
                height={360}
                className="w-full h-full object-contain"
              />

              {/* Monitor Quick Controls */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-black/70 hover:bg-cyan-500 hover:text-black border border-white/20 p-2 rounded-lg text-white transition-all backdrop-blur-md"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>

              {/* Active Shader Badge */}
              <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-cyan-500/40 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
                <Sliders className="w-3 h-3 text-cyan-400" />
                <span>SHADER: {activeShader.toUpperCase()}</span>
              </div>
            </div>

            {/* Real-time Shader Switcher */}
            <div className="mt-4">
              <div className="text-[11px] font-mono text-gray-400 mb-2 flex items-center justify-between">
                <span>POST-PROCESSING GLSL SHADERS</span>
                <span className="text-cyan-400">WebGL 2.0 Real-time</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {[
                  { key: 'bloom', label: 'Cyber Bloom' },
                  { key: 'vhs', label: 'VHS Glitch' },
                  { key: 'rgb', label: 'RGB Split' },
                  { key: 'embers', label: 'Embers VFX' },
                  { key: 'matrix', label: 'Matrix Rain' },
                  { key: 'clean', label: 'Raw 4K' },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => {
                      sounds.playBlip();
                      setActiveShader(s.key as typeof activeShader);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-mono border transition-all text-center ${
                      activeShader === s.key
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-sm shadow-cyan-500/30'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Multi-Track Timeline Visualizer */}
            <div className="mt-4 bg-black/60 rounded-xl border border-white/10 p-3 font-mono">
              <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2 border-b border-white/10 pb-1">
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3 text-purple-400" />
                  TIMELINE (EDL MULTI-TRACK)
                </span>
                <span className="text-cyan-300 font-bold">
                  00:00:0{currentTime.toFixed(2)} / 00:00:10.00
                </span>
              </div>

              {/* Tracks */}
              <div className="space-y-1.5 relative">
                {/* Playhead bar */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none shadow-[0_0_8px_red]"
                  style={{ left: `${(currentTime / 10.0) * 100}%` }}
                />

                {/* Track 1: Video */}
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="w-16 text-gray-400 text-right truncate">V1 RAW</span>
                  <div className="flex-1 bg-white/5 h-5 rounded overflow-hidden relative flex items-center px-2 border border-white/5">
                    <div className="w-full h-full bg-blue-500/20 rounded flex items-center px-2 text-blue-300">
                      Master_4K_Cinematic.mp4
                    </div>
                  </div>
                </div>

                {/* Track 2: 3D Typography */}
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="w-16 text-cyan-400 text-right truncate">V2 3D-TYPO</span>
                  <div className="flex-1 bg-white/5 h-5 rounded overflow-hidden relative flex items-center px-2 border border-white/5">
                    <div className="w-3/5 ml-[20%] h-full bg-cyan-500/25 border-x border-cyan-400 rounded flex items-center px-2 text-cyan-200">
                      KineticTitle: "{titleText}"
                    </div>
                  </div>
                </div>

                {/* Track 3: VFX Shader */}
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="w-16 text-purple-400 text-right truncate">V3 SHADER</span>
                  <div className="flex-1 bg-white/5 h-5 rounded overflow-hidden relative flex items-center px-2 border border-white/5">
                    <div className="w-4/5 ml-[10%] h-full bg-purple-500/25 border-x border-purple-400 rounded flex items-center px-2 text-purple-200">
                      GLSL_{activeShader.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Track 4: Audio / SFX */}
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="w-16 text-green-400 text-right truncate">A1 SYNTH</span>
                  <div className="flex-1 bg-white/5 h-5 rounded overflow-hidden relative flex items-center px-2 border border-white/5">
                    <div className="w-1/2 ml-[20%] h-full bg-green-500/25 border-x border-green-400 rounded flex items-center px-2 text-green-200">
                      Procedural_SubBass_40Hz.wav
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
