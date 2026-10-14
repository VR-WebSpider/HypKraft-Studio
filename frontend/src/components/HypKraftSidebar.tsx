import React from 'react';
import {
  Home,
  Wand2,
  FolderOpen,
  LayoutGrid,
  Sparkles,
  Music,
  Settings
} from 'lucide-react';

interface HypKraftSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const HypKraftSidebar: React.FC<HypKraftSidebarProps> = ({
  activeTab,
  onTabChange
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'ai_editor', label: 'AI Editor', icon: Wand2 },
    { id: 'media', label: 'Media Library', icon: FolderOpen },
    { id: 'templates', label: 'Templates', icon: LayoutGrid },
    { id: 'fx', label: 'Effects & FX', icon: Sparkles },
    { id: 'audio', label: 'Audio Studio', icon: Music },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-56 bg-white/90 border-r border-slate-200/90 flex flex-col justify-between p-3 select-none shrink-0 shadow-xs backdrop-blur-md">
      {/* Navigation Rail */}
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? 'text-white' : 'text-slate-500'
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Branding Card matching reference image */}
      <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-violet-50 via-indigo-50/50 to-cyan-50 border border-violet-100 shadow-sm">
        {/* Subtle crystal gradient art background */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br from-violet-400/20 to-cyan-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="text-xs font-bold text-slate-800 leading-snug">
            Edit. Create. Imagine.
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
              With AI.
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
            <img
              src="/assets/hypkraft_icon.png"
              alt="HypKraft"
              className="w-5 h-5 rounded-md object-contain"
            />
            <div className="text-[10px] text-slate-500 font-medium">
              Powered by <span className="font-bold text-slate-700">HypKraft</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
