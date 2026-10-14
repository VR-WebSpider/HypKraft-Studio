import React from 'react';
import {
  Wand2,
  Sparkles,
  Layers,
  FolderOpen,
  Cpu,
  Download,
  RotateCcw,
  RotateCw,
  Save,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  activePanel: 'ai' | 'motion' | 'media' | 'inspector' | null;
  setActivePanel: (panel: 'ai' | 'motion' | 'media' | 'inspector' | null) => void;
  onOpenModelSettings: () => void;
  onOpenExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  projectName,
  onProjectNameChange,
  activePanel,
  setActivePanel,
  onOpenModelSettings,
  onOpenExport,
  onUndo,
  onRedo,
  onSave
}) => {
  return (
    <header className="h-14 bg-[#0e131f] border-b border-[#1f293d] flex items-center justify-between px-4 select-none shrink-0 z-20">
      {/* Brand & Project Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 via-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-wide bg-gradient-to-r from-cyan-400 via-sky-200 to-purple-400 bg-clip-text text-transparent">
              CYBEREDIT AI
            </div>
            <div className="text-[10px] text-slate-400 font-mono -mt-0.5">
              Motion & Video Studio
            </div>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-800" />

        {/* Project Name Editable */}
        <input
          type="text"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          className="bg-transparent hover:bg-slate-800/60 focus:bg-slate-800 px-2.5 py-1 rounded text-xs font-medium text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors w-44"
          title="Click to rename project"
        />

        {/* Undo / Redo */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-md border border-slate-800">
          <button
            onClick={onUndo}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition"
            title="Redo (Ctrl+Y)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={onSave}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 transition"
          title="Save Project"
        >
          <Save className="w-3 h-3 text-cyan-400" />
          Save
        </button>
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-lg border border-slate-800/80">
        <button
          onClick={() => setActivePanel(activePanel === 'ai' ? null : 'ai')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition ${
            activePanel === 'ai'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5 text-cyan-300" />
          AI Co-Pilot
        </button>

        <button
          onClick={() => setActivePanel(activePanel === 'motion' ? null : 'motion')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition ${
            activePanel === 'motion'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-pink-300" />
          3D Motion Graphics
        </button>

        <button
          onClick={() => setActivePanel(activePanel === 'media' ? null : 'media')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition ${
            activePanel === 'media'
              ? 'bg-slate-800 text-white'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5 text-amber-300" />
          Media & Sound
        </button>
      </div>

      {/* Right Side: AI Models Hub & Export */}
      <div className="flex items-center gap-3">
        {/* Model Provider Hub Status */}
        <button
          onClick={onOpenModelSettings}
          className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 rounded-md border border-slate-700/60 text-xs text-slate-300 transition group"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Cpu className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition" />
          <span className="font-mono text-[11px]">AI Hub</span>
        </button>

        {/* Export Render Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs rounded-md shadow-md shadow-cyan-500/20 transition transform active:scale-95"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          Export Video
        </button>
      </div>
    </header>
  );
};
