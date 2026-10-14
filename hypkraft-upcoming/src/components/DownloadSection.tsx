import React, { useState } from 'react';
import { 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Cpu, 
  HardDrive
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface DownloadSectionProps {
  onOpenEula: () => void;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({ onOpenEula }) => {
  const [copiedCurl, setCopiedCurl] = useState(false);

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('curl -L -O https://hypkraft.webspiderstudios.com/downloads/HypKraft-Studio-Setup-v1.0.0.exe');
    setCopiedCurl(true);
    sounds.playBlip();
    setTimeout(() => setCopiedCurl(false), 2500);
  };

  return (
    <section id="download" className="w-full max-w-4xl mx-auto my-8 px-4">
      {/* Glow Banner Card */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl border border-indigo-200/90 shadow-[0_20px_60px_-15px_rgba(99,102,241,0.2)] p-6 sm:p-10 overflow-hidden">
        {/* Iridescent Corner Accents */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-cyan-400/20 via-indigo-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-tr from-purple-400/20 via-indigo-400/20 to-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Release Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>OFFICIAL PUBLIC RELEASE v1.0.0 // READY FOR DOWNLOAD</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>SHA-256 SIGNED & VERIFIED</span>
            </div>
          </div>

          {/* Main Download Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: App Showcase & Details */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src="/hypkraft_logo.png"
                  alt="HypKraft Studio"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain drop-shadow-[0_8px_20px_rgba(99,102,241,0.35)] shrink-0"
                />
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    HypKraft Studio <span className="text-indigo-600">v1.0.0</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                    Standalone Desktop AI Video & 3D Motion Graphics Editor
                  </p>
                  <p className="text-[11px] font-mono text-slate-400">
                    64-bit Windows Edition • 285 MB Bundle
                  </p>
                </div>
              </div>

              {/* Zero-Prerequisite Guarantee */}
              <div className="p-3.5 bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-cyan-50/80 rounded-2xl border border-indigo-100 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <span>100% Zero-Prerequisite Architecture</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Runs straight out of the box on your PC. <strong className="text-indigo-700">No Python, No Node.js, and no dev tools</strong> are required. Everything is pre-bundled with embedded V8, WebGL 2.0, and GPU acceleration.
                </p>
              </div>

              {/* Key Features Bullet List */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Prompt-to-Timeline AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Three.js 3D Motion Titles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Procedural Audio Synth</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Model Context Protocol (MCP)</span>
                </div>
              </div>
            </div>

            {/* Right: Download Actions */}
            <div className="lg:col-span-5 flex flex-col gap-3.5 bg-slate-50/90 p-5 rounded-2xl border border-slate-200/90 text-center">
              <div className="text-xs font-bold text-slate-800">
                Download for Windows 10 & 11
              </div>

              {/* Primary Download Button (Triggers EULA Acceptance Modal) */}
              <button
                onClick={() => {
                  sounds.playBassDrop();
                  onOpenEula();
                }}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-500/25 transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Download className="w-5 h-5 animate-bounce" />
                <span>DOWNLOAD INSTALLER (.EXE)</span>
              </button>

              {/* Portable Package Button */}
              <button
                onClick={() => {
                  sounds.playWhoosh();
                  onOpenEula();
                }}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <HardDrive className="w-3.5 h-3.5 text-indigo-600" />
                <span>Download Standalone Portable (.zip)</span>
              </button>

              {/* EULA Requirement Notice */}
              <p className="text-[10px] text-slate-500 leading-normal">
                Includes official Terms & Conditions (EULA) during setup. Acceptance is required prior to installation.
              </p>

              {/* Terminal Quick Command */}
              <div className="pt-2 border-t border-slate-200 text-left">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>OR CURL DOWNLOAD:</span>
                  <button
                    onClick={handleCopyCommand}
                    className="text-indigo-600 hover:text-indigo-800 font-bold transition"
                  >
                    {copiedCurl ? 'COPIED!' : 'COPY'}
                  </button>
                </div>
                <div className="bg-slate-900 text-emerald-400 font-mono text-[10px] p-2 rounded-lg truncate select-all">
                  curl -L -O hypkraft.exe
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
