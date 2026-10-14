import React, { useState } from 'react';
import {
  Bell,
  Save,
  ChevronDown,
  UploadCloud,
  Cpu,
  Download,
  Share2,
  FolderOpen,
  Sparkles,
  Zap
} from 'lucide-react';

interface HypKraftNavbarProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  onOpenModelSettings: () => void;
  onOpenMCPModal: () => void;
  onOpenExport: () => void;
  onSave: () => void;
  onMenuAction?: (action: string) => void;
}

export const HypKraftNavbar: React.FC<HypKraftNavbarProps> = ({
  projectName,
  onProjectNameChange,
  onOpenModelSettings,
  onOpenMCPModal,
  onOpenExport,
  onSave,
  onMenuAction
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menuItems = [
    {
      label: 'File',
      items: [
        { label: 'New Project', action: 'new-project', shortcut: 'Ctrl+N' },
        { label: 'Save Project', action: 'save-project', shortcut: 'Ctrl+S' },
        { label: 'Export Video...', action: 'export-video', shortcut: 'Ctrl+E' }
      ]
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', action: 'undo', shortcut: 'Ctrl+Z' },
        { label: 'Redo', action: 'redo', shortcut: 'Ctrl+Y' },
        { label: 'Split Clip', action: 'split-clip', shortcut: 'Ctrl+K' },
        { label: 'Delete Clip', action: 'delete-clip', shortcut: 'Del' }
      ]
    },
    {
      label: 'AI Models',
      items: [
        { label: 'Open Model Selector Hub...', action: 'open-models', shortcut: 'Ctrl+M' },
        { label: 'Switch to Cloud Models', action: 'use-cloud-models' },
        { label: 'Switch to Local Models', action: 'use-local-models' }
      ]
    },
    {
      label: 'MCP Server',
      items: [
        { label: 'MCP Status: Active (Port 8000)', action: 'open-mcp' },
        { label: 'Copy Config for Cursor / Claude', action: 'copy-mcp' }
      ]
    },
    {
      label: 'Help',
      items: [
        { label: 'About HypKraft Studio', action: 'about' }
      ]
    }
  ];

  return (
    <header className="h-14 bg-white/95 border-b border-slate-200/90 px-4 flex items-center justify-between select-none shrink-0 z-30 shadow-xs backdrop-blur-md">
      {/* Left: Brand + Project dropdown + Menus */}
      <div className="flex items-center gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/hypkraft_icon.png"
            alt="HypKraft"
            className="w-8 h-8 rounded-xl object-contain drop-shadow-md"
          />
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            HypKraft
          </span>
        </div>

        {/* Project Selector Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 hover:bg-slate-200/70 border border-slate-200 rounded-lg px-2.5 py-1 transition cursor-pointer text-xs font-semibold text-slate-700">
          <span>{projectName}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
        </div>

        {/* Save button */}
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
        >
          <Save className="w-3.5 h-3.5 text-violet-600" />
          Save
        </button>

        <div className="h-4 w-px bg-slate-200" />

        {/* Desktop Menu Bars */}
        <nav className="flex items-center gap-0.5 relative">
          {menuItems.map((m) => (
            <div key={m.label} className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === m.label ? null : m.label)}
                onMouseEnter={() => {
                  if (activeMenu) setActiveMenu(m.label);
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  activeMenu === m.label
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {m.label}
              </button>

              {activeMenu === m.label && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setActiveMenu(null)}
                  />
                  <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    {m.items.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveMenu(null);
                          if (item.action === 'open-models') onOpenModelSettings();
                          else if (item.action === 'open-mcp' || item.action === 'copy-mcp') onOpenMCPModal();
                          else if (item.action === 'export-video') onOpenExport();
                          else if (item.action === 'save-project') onSave();
                          else onMenuAction?.(item.action);
                        }}
                        className="w-full px-3 py-1.5 text-xs text-left text-slate-700 hover:bg-violet-50 hover:text-violet-700 flex items-center justify-between transition"
                      >
                        <span>{item.label}</span>
                        {item.shortcut && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.shortcut}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right: MCP Status + Notifications + Avatar + Export */}
      <div className="flex items-center gap-3">
        {/* Model Context Protocol (MCP) Pill */}
        <button
          onClick={onOpenMCPModal}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-cyan-50 to-indigo-50 hover:from-cyan-100 hover:to-indigo-100 border border-cyan-200/80 rounded-lg text-xs font-semibold text-cyan-800 transition shadow-xs group"
          title="Model Context Protocol (MCP) Server for Cursor, Claude & IDEs"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <Zap className="w-3.5 h-3.5 text-cyan-600 group-hover:rotate-12 transition-transform" />
          <span>MCP Active</span>
        </button>

        {/* AI Hub Button */}
        <button
          onClick={onOpenModelSettings}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          title="AI Model Selector & Endpoints"
        >
          <Cpu className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <button className="relative p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-violet-600 rounded-full"></span>
        </button>

        {/* User Profile Avatar */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 cursor-pointer shadow-xs">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        {/* Export Button matching reference gradient & style */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-md shadow-violet-500/25 transition transform active:scale-95"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Export</span>
          <span className="text-[10px] opacity-80 font-mono">↗</span>
        </button>
      </div>
    </header>
  );
};
