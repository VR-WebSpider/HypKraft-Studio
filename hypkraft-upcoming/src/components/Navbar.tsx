import React, { useState } from 'react';
import { Volume2, VolumeX, Menu, X, ArrowUpRight } from 'lucide-react';
import { HypKraftLogo } from './HypKraftLogo';
import { sounds } from '../utils/audio';

export const Navbar: React.FC = () => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playBlip();
  };

  const navLinks = [
    { label: 'Download Studio', href: '#download' },
    { label: 'User Guide', href: '#user-guide' },
    { label: 'Studio Showcase', href: '#studio-preview' },
    { label: 'Pillars & Engines', href: '#features' },
    { label: 'Architecture & MCP', href: '#tech-specs' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2 group">
          <HypKraftLogo size={34} />
        </a>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => sounds.playBlip()}
              className="hover:text-indigo-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Sound toggle */}
          <button
            onClick={toggleAudio}
            title={audioEnabled ? 'Mute Studio SFX' : 'Enable Studio SFX'}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-600 text-xs flex items-center gap-1.5 font-medium transition-all"
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>SFX: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">SFX: MUTED</span>
              </>
            )}
          </button>

          {/* CTA */}
          <a
            href="#download"
            onClick={() => sounds.playBassDrop()}
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-500/20 hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <span>DOWNLOAD STUDIO</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleAudio}
            className="p-2 rounded-lg bg-white border border-slate-200 text-indigo-600 text-xs"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 text-sm font-semibold">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => {
                sounds.playBlip();
                setMobileMenuOpen(false);
              }}
              className="block text-slate-600 hover:text-indigo-600"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#waitlist"
            onClick={() => {
              sounds.playBlip();
              setMobileMenuOpen(false);
            }}
            className="block text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-2 rounded-xl text-xs mt-2 shadow-sm"
          >
            JOIN VIP EARLY ACCESS
          </a>
        </div>
      )}
    </header>
  );
};
