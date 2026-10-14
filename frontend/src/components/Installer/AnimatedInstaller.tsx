import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  HardDrive,
  Cpu,
  Layers,
  Zap,
  ArrowRight,
  ShieldCheck,
  FolderOpen,
  FileText,
  AlertCircle
} from 'lucide-react';

interface AnimatedInstallerProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchStudio: () => void;
}

export const AnimatedInstaller: React.FC<AnimatedInstallerProps> = ({
  isOpen,
  onClose,
  onLaunchStudio
}) => {
  // Step 1: Welcome & Zero-Prerequisite Verification
  // Step 2: Terms & Conditions / EULA Agreement (Mandatory Checkbox)
  // Step 3: Components & Destination
  // Step 4: Installation Progress
  // Step 5: Completed
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [eulaAccepted, setEulaAccepted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [installPath, setInstallPath] = useState('C:\\Program Files\\HypKraft Studio');

  const components = [
    { id: 'core', label: 'HypKraft Studio Core (Self-Contained Embedded Runtime)', size: '280 MB', checked: true, required: true },
    { id: 'standalone', label: 'Zero-Prerequisite Engine (No Python or Node.js required)', size: 'Built-in', checked: true, required: true },
    { id: 'three', label: 'Three.js 3D Motion Graphics & WebGL Shaders', size: '120 MB', checked: true },
    { id: 'ffmpeg', label: 'Hardware-Accelerated GPU Video Pipeline', size: '140 MB', checked: true },
    { id: 'mcp', label: 'Model Context Protocol (MCP) Server for IDEs', size: '15 MB', checked: true },
    { id: 'shortcut', label: 'Desktop & Start Menu Shortcuts', size: '2 MB', checked: true }
  ];

  // Animated installation progress simulation
  useEffect(() => {
    if (step === 4) {
      setProgress(5);
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => setStep(5), 400);
            return 100;
          }
          return prev + Math.floor(Math.random() * 8) + 4;
        });
      }, 150);
      return () => clearInterval(timer);
    }
  }, [step]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="relative bg-white border border-slate-200/90 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Subtle decorative iridescent background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-gradient-to-br from-violet-400/20 via-cyan-400/20 to-pink-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <img
              src="/assets/hypkraft_icon.png"
              alt="HypKraft"
              className="w-10 h-10 rounded-2xl object-contain drop-shadow-md"
            />
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                HypKraft Studio Setup
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                AI Video & Motion Graphics Editor Installer v1.0.0
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm px-2.5 py-1 rounded-lg hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 pt-3 pb-0 flex items-center justify-between text-[11px] font-semibold text-slate-400 border-b border-slate-50">
          <span className={step === 1 ? 'text-violet-600 font-bold' : ''}>1. Welcome</span>
          <span>›</span>
          <span className={step === 2 ? 'text-violet-600 font-bold' : ''}>2. EULA Agreement</span>
          <span>›</span>
          <span className={step === 3 ? 'text-violet-600 font-bold' : ''}>3. Destination</span>
          <span>›</span>
          <span className={step === 4 || step === 5 ? 'text-violet-600 font-bold' : ''}>4. Install</span>
        </div>

        {/* Step Content */}
        <div className="p-6 relative z-10 flex-1">
          {/* STEP 1: Welcome & Zero-Prerequisites System Check */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-50/80 to-cyan-50/80 border border-violet-100 space-y-2">
                <div className="text-xs font-bold text-slate-800">
                  Welcome to HypKraft Setup Wizard
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  This wizard will install HypKraft Studio on your system. HypKraft is completely self-contained and ready to create cinematic AI videos immediately—no Python, no Node.js, and no external developer prerequisites required.
                </p>
              </div>

              {/* System Checks */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                  System & Hardware Compatibility
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Embedded V8 Engine (Bundled)</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Zero Prerequisites Required</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>WebGL 2.0 GPU Acceleration (Ready)</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Model Context Protocol (Ready)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Terms & Conditions / EULA (Mandatory Checkbox) */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <FileText className="w-4 h-4 text-violet-600" />
                <span>End User License Agreement (EULA) & Terms of Service</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Please review the license terms before installing HypKraft Studio. You must accept the terms of this agreement to continue.
              </p>

              {/* Scrollable Terms Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-40 overflow-y-auto text-[11px] font-mono text-slate-600 space-y-2 leading-relaxed">
                <p className="font-bold text-slate-800">HYPKRAFT STUDIO END USER LICENSE AGREEMENT (EULA)</p>
                <p>Copyright (c) 2026 WebSpider Studios. All rights reserved.</p>
                <p>
                  1. GRANT OF LICENSE: WebSpider Studios grants you a personal, non-exclusive, non-transferable license to install and run HypKraft Studio on compatible Windows operating systems for creative video editing, 3D motion graphics, and audio synthesis.
                </p>
                <p>
                  2. PRIVACY & SECURITY: HypKraft Studio is engineered with security-first architecture. It does not harvest private assets or send your local project media to unauthorized external servers without explicit consent.
                </p>
                <p>
                  3. INTELLECTUAL PROPERTY: All content, videos, animations, and sound effects synthesized by you through HypKraft Studio remain 100% your intellectual property.
                </p>
                <p>
                  4. RESTRICTIONS: You may not reverse-engineer, decompile, or redistribute malicious modifications of this software.
                </p>
                <p>
                  5. DISCLAIMER OF WARRANTY: HypKraft Studio is provided "AS IS" without warranties of any kind. WebSpider Studios is not liable for indirect damages or data loss arising from hardware misconfiguration.
                </p>
              </div>

              {/* Mandatory Checkbox */}
              <label className="p-3 bg-violet-50/60 border border-violet-200 rounded-xl flex items-start gap-3 cursor-pointer transition hover:bg-violet-50">
                <input
                  type="checkbox"
                  checked={eulaAccepted}
                  onChange={(e) => setEulaAccepted(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-violet-600 accent-violet-600 cursor-pointer"
                />
                <span className="text-xs text-slate-800 font-semibold select-none">
                  I have read, understood, and accept the terms of the HypKraft Studio End User License Agreement (EULA) and Terms of Service.
                </span>
              </label>

              {!eulaAccepted && (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>You must accept the EULA agreement checkbox to proceed to the next step.</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Component Selection & Destination */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 mb-1.5 block">
                  Installation Folder
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={installPath}
                    onChange={(e) => setInstallPath(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-violet-500"
                  />
                  <button className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5" />
                    Browse
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                  Select Components to Install
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {components.map((c) => (
                    <label
                      key={c.id}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between cursor-pointer transition"
                    >
                      <div className="flex items-center gap-2.5 text-xs text-slate-800 font-medium">
                        <input
                          type="checkbox"
                          defaultChecked={c.checked}
                          disabled={c.required}
                          className="w-4 h-4 rounded text-violet-600 accent-violet-600"
                        />
                        <span>{c.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{c.size}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Animated Progress */}
          {step === 4 && (
            <div className="py-8 space-y-6 text-center">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-violet-600 to-cyan-400 animate-spin opacity-50 blur-lg" />
                <img
                  src="/assets/hypkraft_icon.png"
                  alt="Installing"
                  className="relative w-20 h-20 rounded-2xl object-contain drop-shadow-xl animate-pulse"
                />
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                  Installing HypKraft Studio...
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {progress < 30
                    ? 'Extracting Three.js 3D motion graphics runtime...'
                    : progress < 65
                    ? 'Registering Model Context Protocol (MCP) server...'
                    : progress < 90
                    ? 'Initializing standalone hardware GPU compositor...'
                    : 'Finalizing desktop shortcuts...'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 max-w-md mx-auto">
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                  <div
                    className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 h-full rounded-full transition-all duration-200 shadow-sm"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-right text-[11px] font-mono font-bold text-violet-700">
                  {progress}%
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Complete */}
          {step === 5 && (
            <div className="py-6 space-y-4 text-center">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-md">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 mb-1">
                  Installation Complete!
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  HypKraft Studio is successfully installed and ready to create, edit, and orchestrate AI videos.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left max-w-sm mx-auto text-xs space-y-1.5 text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Desktop Shortcut Created</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Zero-Prerequisite Standalone Runtime Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>MCP Server Registered on Port 8000</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between relative z-10">
          {step < 5 ? (
            <>
              <button
                onClick={() => setStep((prev) => (prev > 1 ? ((prev - 1) as any) : 1))}
                disabled={step === 1 || step === 4}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-30 transition"
              >
                Back
              </button>

              <button
                onClick={() => {
                  if (step === 2 && !eulaAccepted) return;
                  setStep((prev) => (prev < 4 ? ((prev + 1) as any) : 4));
                }}
                disabled={step === 4 || (step === 2 && !eulaAccepted)}
                className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-md shadow-violet-500/20 transition active:scale-95"
              >
                <span>{step === 3 ? 'Install Now' : 'Next'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                onClose();
                onLaunchStudio();
              }}
              className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-violet-500/25 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch HypKraft Studio</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
