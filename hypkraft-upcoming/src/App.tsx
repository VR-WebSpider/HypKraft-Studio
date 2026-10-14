import { useState } from 'react';
import { IridescentBackground } from './components/IridescentBackground';
import { Navbar } from './components/Navbar';
import { DownloadSection } from './components/DownloadSection';
import { EulaModal } from './components/EulaModal';
import { UserGuide } from './components/UserGuide';
import { WaitlistForm } from './components/WaitlistForm';
import { StudioInterface } from './components/StudioInterface';
import { FeatureMatrix } from './components/FeatureMatrix';
import { TechSpecs } from './components/TechSpecs';
import { Footer } from './components/Footer';
import { 
  Sparkles, 
  ChevronDown, 
  HelpCircle, 
  Check, 
  Zap, 
  Gift, 
  Play, 
  Cpu,
  Download,
  BookOpen
} from 'lucide-react';
import { sounds } from './utils/audio';

export function App() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isEulaOpen, setIsEulaOpen] = useState(false);

  const faqs = [
    {
      q: 'Do I need Python, Node.js, or any prerequisites to run HypKraft Studio?',
      a: 'No! HypKraft Studio is 100% self-contained and zero-prerequisite. It comes with embedded V8 runtime, WebGL 2.0 GPU hardware acceleration, and internal audio synth. Any user on Windows 10 or 11 can install and run it immediately without developer tools.',
    },
    {
      q: 'What makes HypKraft different from other AI video generators?',
      a: 'Most AI video generators produce static, disconnected clips without editable timelines. HypKraft is a comprehensive Non-Linear Editor (NLE) combining conversational prompt-to-edit orchestration, multi-track editing, procedural audio synthesis, and real-time Three.js 3D motion graphics in one seamless canvas.',
    },
    {
      q: 'What is the End User License Agreement (EULA) policy?',
      a: 'You own 100% of all creative content, animations, audio, and videos rendered in HypKraft Studio. WebSpider Studios claims zero royalties or rights over your work. Acceptance of our standard safety EULA is required during installation to guarantee a secure, malware-free experience.',
    },
    {
      q: 'Can external autonomous agents control HypKraft?',
      a: 'Yes! HypKraft features a native Model Context Protocol (MCP) server on port 8000. Agents running in Claude Desktop, Antigravity, or Cursor can inspect clips, manipulate track layouts, generate procedural SFX, and render complete final exports headlessly.',
    },
    {
      q: 'Which AI models are supported in the Studio?',
      a: 'HypKraft bridges Cloud Models (OpenAI GPT-4o, Stable Diffusion XL, Runway Gen-3, ElevenLabs) and Local Models (Llama 3.2, SDXL, AnimateDiff, Riffusion) so you can toggle between cloud scale and offline privacy with one click.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fc] text-slate-900 relative selection:bg-indigo-500 selection:text-white font-sans">
      {/* Luminous Pastel Iridescent Ambient Background */}
      <IridescentBackground />

      {/* Global Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 pt-20 pb-16">
        {/* HERO SECTION */}
        <section className="max-w-6xl mx-auto px-4 text-center pt-8 md:pt-12 pb-6">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/90 border border-emerald-200/80 text-emerald-700 mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>WEBSPIDER STUDIOS // HYPKRAFT STUDIO v1.0.0 IS LIVE</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-slate-900 mb-4">
            Edit. Create. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500">Imagine.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-2xl font-bold text-slate-700 max-w-3xl mx-auto tracking-tight leading-snug mb-3">
            The All-In-One AI Video, 3D Motion Graphics & Procedural Audio Studio.
          </p>

          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed mb-6">
            Describe your vision with natural language. HypKraft generates and edits multi-track timelines with 4K video, extruded 3D titles, procedural audio, and real-time WebGL shaders. Standalone and ready on Windows with zero setup.
          </p>

          {/* Quick CTA Anchor Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 my-4">
            <button
              onClick={() => {
                sounds.playBassDrop();
                setIsEulaOpen(true);
              }}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD FOR WINDOWS (64-BIT)</span>
            </button>

            <a
              href="#user-guide"
              onClick={() => sounds.playWhoosh()}
              className="bg-white/90 hover:bg-white text-slate-700 font-bold text-xs px-6 py-3.5 rounded-2xl border border-slate-200/80 transition-all flex items-center gap-2 shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>USER GUIDE & DOCS</span>
            </a>

            <a
              href="#studio-preview"
              onClick={() => sounds.playWhoosh()}
              className="bg-white/90 hover:bg-white text-slate-700 font-semibold text-xs px-6 py-3.5 rounded-2xl border border-slate-200/80 transition-all flex items-center gap-2 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
              <span>EXPLORE STUDIO INTERFACE</span>
            </a>
          </div>

          {/* Micro telemetry stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold text-slate-500 pt-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>ZERO PREREQUISITES (NO PYTHON / NODE NEEDED)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>4K 60FPS NVENC EXPORTS</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>MODEL CONTEXT PROTOCOL (MCP)</span>
            </span>
          </div>
        </section>

        {/* OFFICIAL DOWNLOAD SECTION (Replaces countdown timer) */}
        <DownloadSection onOpenEula={() => setIsEulaOpen(true)} />

        {/* HERO STUDIO INTERFACE SHOWCASE */}
        <section id="studio-preview" className="my-12">
          <div className="text-center mb-6 px-4">
            <span className="text-[11px] font-mono font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60 inline-block mb-2">
              STUDIO INTERFACE // SNEAK PEEK
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              The Next-Gen Canvas for Cinema Creators
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mt-1">
              Explore the full interactive workspace with prompt-to-video generation, multi-track timeline, media drawer, and unified model selector.
            </p>
          </div>

          <StudioInterface />
        </section>

        {/* OFFICIAL USER GUIDE */}
        <UserGuide />

        {/* 6 CORE PILLARS FEATURE MATRIX */}
        <FeatureMatrix />

        {/* TECHNICAL SPECIFICATIONS & ARCHITECTURE */}
        <TechSpecs />

        {/* FOUNDING MEMBER VIP PERKS */}
        <section className="max-w-5xl mx-auto my-20 px-4">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/90 shadow-[0_20px_50px_-10px_rgba(99,102,241,0.1)] text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-pink-50 border border-pink-200/60 text-pink-600 mb-4">
              <Gift className="w-3.5 h-3.5" />
              <span>FOUNDER COMMUNITY BENEFITS</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Unlock the HypKraft <span className="text-indigo-600">Founders Tier</span>
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mb-10">
              Community registrants lock in exclusive benefits, priority Discord access, and future cloud render allocations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                {
                  tier: 'TIER 1',
                  title: '500 4K Render Credits',
                  desc: 'Complimentary high-speed cloud GPU render quota for cloud rendering pipeline.',
                  icon: <Zap className="w-5 h-5 text-indigo-600" />,
                },
                {
                  tier: 'TIER 2',
                  title: 'Exclusive Shader Pack',
                  desc: '12 custom GLSL motion graphics shaders & holographic HUD titles.',
                  icon: <Sparkles className="w-5 h-5 text-purple-600" />,
                },
                {
                  tier: 'TIER 3',
                  title: 'Priority MCP Agent Key',
                  desc: 'Direct WebSocket and REST API credentials for autonomous agent pipelines.',
                  icon: <Cpu className="w-5 h-5 text-pink-600" />,
                },
              ].map((perk, i) => (
                <div
                  key={i}
                  className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:border-indigo-300 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {perk.tier}
                      </span>
                      {perk.icon}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                      {perk.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {perk.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Included Free with Release</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMMUNITY REGISTRATION FORM */}
        <WaitlistForm />

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="max-w-4xl mx-auto my-20 px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 mb-3 shadow-xs">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Questions & Answers
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden transition-colors hover:border-indigo-300 shadow-xs"
              >
                <button
                  onClick={() => {
                    sounds.playBlip();
                    setOpenFaq(openFaq === idx ? null : idx);
                  }}
                  className="w-full p-4 sm:p-5 text-left font-semibold text-sm sm:text-base flex items-center justify-between gap-4 text-slate-900"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-indigo-600 transition-transform duration-200 flex-shrink-0 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* EULA & Download Modal */}
      <EulaModal isOpen={isEulaOpen} onClose={() => setIsEulaOpen(false)} />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default App;
