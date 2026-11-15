import React from 'react';
import { Terminal } from 'lucide-react';
import { HypKraftLogo } from './HypKraftLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-12 px-4 sm:px-6 relative z-10 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1 */}
        <div className="md:col-span-2 space-y-3">
          <HypKraftLogo size={28} />
          <p className="text-slate-500 text-xs max-w-sm leading-relaxed">
            An experimental Prompt-to-Timeline AI Video and 3D Motion Graphics Workstation. Built by WebSpider Studios for creative exploration, generative media, and autonomous coding agents.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Edge Network Active // Subdomain Live: hypkraft.webspiderstudios.com</span>
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">
            Ecosystem
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="https://webspiderstudios.com" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors">
                WebSpider Studios Hub
              </a>
            </li>
            <li>
              <a href="https://ai.webspiderstudios.com" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors">
                AI Research Lab
              </a>
            </li>
            <li>
              <a href="https://portal.webspiderstudios.com" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors">
                Developer Portal
              </a>
            </li>
            <li>
              <a href="https://blog.webspiderstudios.com" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors">
                Engineering Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">
            Developer Protocols
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-1.5 text-slate-700 font-medium">
              <Terminal className="w-3.5 h-3.5 text-indigo-600" />
              <span>Model Context Protocol (MCP)</span>
            </li>
            <li>FFmpeg GPU NVENC API</li>
            <li>Three.js WebGL Engine</li>
            <li>Procedural Audio Synthesizer</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
        <div>
          © {new Date().getFullYear()} WebSpider Studios. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <a href="#user-guide" className="hover:text-indigo-600 transition-colors">User Guide</a>
          <span>•</span>
          <a href="#eula" className="hover:text-indigo-600 transition-colors">EULA Terms</a>
          <span>•</span>
          <a href="#download" className="hover:text-indigo-600 transition-colors">Download Studio</a>
        </div>
      </div>
    </footer>
  );
};
