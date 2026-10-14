import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  RotateCw, 
  Scissors, 
  Trash2, 
  Plus, 
  Eye, 
  Upload, 
  Bell, 
  ChevronDown, 
  Maximize2, 
  Film, 
  Image as ImageIcon, 
  Music, 
  Layers, 
  Star, 
  Video, 
  Settings, 
  Home, 
  Cloud, 
  HardDrive, 
  ChevronRight
} from 'lucide-react';
import { HypKraftLogo } from './HypKraftLogo';
import { sounds } from '../utils/audio';

export const StudioInterface: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeMediaTab, setActiveMediaTab] = useState<'All' | 'Videos' | 'Images' | 'Audio'>('All');
  const [activePromptCategory, setActivePromptCategory] = useState('Video');
  const [activeModelTab, setActiveModelTab] = useState<'Cloud' | 'Local'>('Cloud');
  const [promptText, setPromptText] = useState('A futuristic city at sunset with flying cars, neon lights, and cinematic lighting');
  const [activeSidebarNav, setActiveSidebarNav] = useState('Home');
  const [activeRightTab, setActiveRightTab] = useState<'AI Generator' | 'Manual Edit' | 'Project'>('AI Generator');

  // Interactive toggle states for models
  const [modelToggles, setModelToggles] = useState<Record<string, boolean>>({
    gpt4o: true,
    sdxl: true,
    runway: true,
    elevenlabs: true,
    pika: true,
    llama: true,
    localSdxl: true,
    animatediff: true,
    riffusion: true,
  });

  const toggleModel = (key: string) => {
    sounds.playBlip();
    setModelToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Media cards data matching the screenshot
  const mediaItems = [
    {
      id: 1,
      title: 'Futuristic Sunset City',
      duration: '00:15',
      bg: 'from-amber-500 via-rose-600 to-indigo-900',
      tag: 'Videos',
    },
    {
      id: 2,
      title: 'Mountain River',
      duration: '00:12',
      bg: 'from-emerald-500 via-teal-600 to-blue-800',
      tag: 'Videos',
    },
    {
      id: 3,
      title: 'Cyberpunk Neon Alley',
      duration: '00:08',
      bg: 'from-cyan-500 via-purple-600 to-pink-600',
      tag: 'Videos',
    },
    {
      id: 4,
      title: 'Mystic Forest',
      duration: '00:10',
      bg: 'from-teal-600 via-emerald-700 to-slate-900',
      tag: 'Videos',
    },
    {
      id: 5,
      title: 'Woman at Sunset',
      duration: '00:07',
      bg: 'from-orange-400 via-pink-600 to-purple-900',
      tag: 'Images',
    },
    {
      id: 6,
      title: 'Alien Crystal Orb',
      duration: '00:12',
      bg: 'from-blue-400 via-indigo-600 to-purple-900',
      tag: 'Images',
    },
    {
      id: 7,
      title: 'Solar Flare Explosion',
      duration: '00:10',
      bg: 'from-amber-400 via-red-600 to-stone-900',
      tag: 'Videos',
    },
    {
      id: 8,
      title: 'Cosmic Energy Sphere',
      duration: '00:06',
      bg: 'from-purple-500 via-fuchsia-600 to-indigo-950',
      tag: 'Audio',
    },
  ];

  const handleGenerateClick = () => {
    sounds.playBassDrop();
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto my-8 px-2 sm:px-4">
      {/* Outer Studio Container matching the rounded glass aesthetic */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_20px_50px_-10px_rgba(99,102,241,0.08)] overflow-hidden transition-all">
        {/* TOP NAVIGATION BAR */}
        <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md">
          {/* Left: Brand & Project Selector */}
          <div className="flex items-center gap-6">
            <HypKraftLogo size={32} />

            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={() => sounds.playBlip()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>Untitled Project</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button 
                onClick={() => sounds.playSuccess()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>💾 Save</span>
              </button>
            </div>
          </div>

          {/* Right: Notifications, Avatar, Export */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => sounds.playBlip()}
              className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-pink-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
            </button>

            {/* Profile Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-[1.5px] cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                alt="Creator Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            {/* Export Button */}
            <button 
              onClick={() => sounds.playSuccess()}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* MAIN STUDIO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[820px]">
          {/* LEFT SIDEBAR (Col 1-2) */}
          <aside className="lg:col-span-2 border-r border-slate-100 p-4 flex flex-col justify-between bg-slate-50/40">
            {/* Nav Menu */}
            <div className="space-y-1">
              {[
                { name: 'Home', icon: <Home className="w-4 h-4" /> },
                { name: 'AI Editor', icon: <Sparkles className="w-4 h-4" /> },
                { name: 'Media Library', icon: <Film className="w-4 h-4" /> },
                { name: 'Templates', icon: <Layers className="w-4 h-4" /> },
                { name: 'Effects & FX', icon: <Star className="w-4 h-4" /> },
                { name: 'Audio Studio', icon: <Music className="w-4 h-4" /> },
                { name: 'Settings', icon: <Settings className="w-4 h-4" /> },
              ].map((item) => {
                const isActive = activeSidebarNav === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      sounds.playBlip();
                      setActiveSidebarNav(item.name);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-transparent text-indigo-700 border-l-4 border-indigo-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Crystalline Ribbon Card matching the screenshot */}
            <div className="mt-8 rounded-2xl p-4 relative overflow-hidden bg-gradient-to-br from-cyan-50 via-indigo-50 to-purple-50 border border-indigo-100 shadow-sm">
              {/* Abstract decorative crystal shards */}
              <div className="w-20 h-20 rounded-full bg-cyan-400/20 blur-xl absolute -top-4 -right-4" />
              <div className="w-20 h-20 rounded-full bg-purple-400/20 blur-xl absolute -bottom-4 -left-4" />

              <div className="relative z-10">
                <div className="text-xs font-bold text-slate-800 leading-snug mb-3">
                  Edit. Create. Imagine.<br />With AI.
                </div>
                
                <div className="flex items-center gap-2 pt-2 border-t border-indigo-100/60">
                  <HypKraftLogo size={22} />
                </div>
              </div>
            </div>
          </aside>

          {/* CENTER CANVAS & TIMELINE (Col 3-9: 7 columns) */}
          <main className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between border-r border-slate-100 bg-white">
            {/* Top Prompt Section: "Create with AI" banner */}
            <div className="rounded-2xl p-4 sm:p-5 iridescent-banner mb-5 relative overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 text-indigo-700 text-sm font-bold mb-1">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Create with AI</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Describe your vision or use an example. Our AI will generate stunning videos, images, audio, motion graphics and more.
              </p>

              {/* Prompt Input & Generate button */}
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <div className="flex-1 bg-white rounded-xl border border-slate-200 px-3.5 py-2.5 shadow-inner">
                  <input
                    type="text"
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="Describe what you want to create..."
                    className="w-full bg-transparent text-xs text-slate-800 font-medium focus:outline-none placeholder-slate-400"
                  />
                </div>
                <button
                  onClick={handleGenerateClick}
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate</span>
                </button>
              </div>

              {/* Sub-selector Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  {[
                    { name: 'Video', icon: <Video className="w-3 h-3" /> },
                    { name: 'Image', icon: <ImageIcon className="w-3 h-3" /> },
                    { name: 'Audio', icon: <Music className="w-3 h-3" /> },
                    { name: 'Motion Graphics', icon: <Layers className="w-3 h-3" /> },
                    { name: 'FX', icon: <Star className="w-3 h-3" /> },
                  ].map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        sounds.playBlip();
                        setActivePromptCategory(cat.name);
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                        activePromptCategory === cat.name
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white/80 border border-slate-200 text-slate-600 hover:bg-white'
                      }`}
                    >
                      {cat.icon}
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>

                {/* Cloud vs Local Models Toggle */}
                <div className="flex items-center bg-white/90 p-0.5 rounded-lg border border-slate-200 text-[10px] font-semibold">
                  <button
                    onClick={() => {
                      sounds.playBlip();
                      setActiveModelTab('Cloud');
                    }}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all ${
                      activeModelTab === 'Cloud' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    <Cloud className="w-3 h-3" />
                    <span>Cloud Models</span>
                  </button>
                  <button
                    onClick={() => {
                      sounds.playBlip();
                      setActiveModelTab('Local');
                    }}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all ${
                      activeModelTab === 'Local' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    <HardDrive className="w-3 h-3" />
                    <span>Local Models</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Section: Media Drawer + Main Monitor */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
              {/* Media Browser Drawer (4 cols) */}
              <div className="md:col-span-4 border border-slate-200 rounded-2xl p-3 bg-slate-50/50 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Film className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Media</span>
                  </div>
                  <button 
                    onClick={() => sounds.playBlip()}
                    className="p-1 rounded bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Media subtabs */}
                <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 mb-2 border-b border-slate-200 pb-1.5">
                  {(['All', 'Videos', 'Images', 'Audio'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        sounds.playBlip();
                        setActiveMediaTab(tab);
                      }}
                      className={`px-2 py-0.5 rounded ${
                        activeMediaTab === tab ? 'text-indigo-600 font-bold bg-indigo-50' : 'hover:text-slate-800'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Media Grid (2 columns of cards with duration pills) */}
                <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {mediaItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => sounds.playBlip()}
                      className="group cursor-pointer rounded-xl overflow-hidden border border-slate-200 shadow-xs relative aspect-video"
                    >
                      {/* Gradient preview art simulating the screenshot thumbnails */}
                      <div className={`w-full h-full bg-gradient-to-br ${item.bg} group-hover:scale-105 transition-transform duration-300 flex items-center justify-center p-1 text-center`}>
                        <div className="text-[9px] text-white/90 font-medium line-clamp-2 px-1">
                          {item.title}
                        </div>
                      </div>
                      {/* Timecode badge */}
                      <span className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-xs text-[9px] font-mono text-white px-1 py-0.5 rounded">
                        {item.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main 16:9 Video Monitor (8 cols) */}
              <div className="md:col-span-8 flex flex-col">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-video bg-slate-950 group">
                  {/* Sunset Sci-Fi City Visual matching screenshot precisely */}
                  <div className="w-full h-full relative overflow-hidden bg-slate-950">
                    <img
                      src="/hypkraft-studio-preview.jpg"
                      alt="HypKraft Video Preview"
                      className="w-[235%] h-[300%] max-w-none absolute -left-[78%] -top-[74%] object-cover pointer-events-none"
                    />
                    {/* Animated cinematic light sweep overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent pointer-events-none opacity-60 animate-pulse" />
                  </div>

                  {/* Top HUD badge */}
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 border border-white/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    <span>AI LIVE CANVAS // 4K 60FPS</span>
                  </div>

                  {/* Aspect Ratio Badge & Fullscreen */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded border border-white/10">
                      16:9 ▾
                    </span>
                    <button className="bg-black/60 backdrop-blur-md text-white p-1 rounded border border-white/10 hover:bg-black/80">
                      <Maximize2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Center Play Overlay on hover */}
                  <div 
                    onClick={() => {
                      sounds.playBlip();
                      setIsPlaying(!isPlaying);
                    }}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/10 hover:bg-black/20 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/90 shadow-xl flex items-center justify-center text-indigo-600 hover:scale-110 transition-transform">
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </div>
                  </div>

                  {/* Bottom Monitor Bar */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 flex items-center justify-between text-white text-xs">
                    <div className="font-mono text-[11px] text-slate-200">
                      00:00:24 / 00:01:30
                    </div>

                    <div className="flex items-center gap-3">
                      <button onClick={() => sounds.playBlip()} className="hover:text-cyan-400 transition-colors">
                        <SkipBack className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => {
                          sounds.playBlip();
                          setIsPlaying(!isPlaying);
                        }} 
                        className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-sm"
                      >
                        {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                      </button>
                      <button onClick={() => sounds.playBlip()} className="hover:text-cyan-400 transition-colors">
                        <SkipForward className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/40">
                        NVENC CUDA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: Multi-Track Timeline */}
            <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50/60 flex flex-col">
              {/* Timeline Header Controls */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                <div className="flex items-center gap-2 text-slate-500">
                  <button onClick={() => sounds.playBlip()} className="p-1 hover:text-slate-800 transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => sounds.playBlip()} className="p-1 hover:text-slate-800 transition-colors">
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-3.5 bg-slate-200 mx-1" />
                  <button onClick={() => sounds.playBlip()} className="p-1 hover:text-indigo-600 transition-colors">
                    <Scissors className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => sounds.playBlip()} className="p-1 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Timeline Ruler */}
                <div className="flex items-center gap-6 text-[10px] font-mono text-slate-400">
                  <span>00:00</span>
                  <span>00:05</span>
                  <span>00:10</span>
                  <span>00:15</span>
                  <span className="text-cyan-600 font-bold">00:20</span>
                  <span>00:25</span>
                  <span>00:30</span>
                  <span>00:35</span>
                  <span>00:40</span>
                </div>
              </div>

              {/* Tracks Container */}
              <div className="space-y-1.5 relative overflow-hidden">
                {/* Vertical Playhead Cursor */}
                <div className="absolute top-0 bottom-0 left-[55%] w-0.5 bg-cyan-400 z-20 pointer-events-none shadow-[0_0_8px_#22d3ee]">
                  <div className="w-2.5 h-2.5 -left-1 -top-0.5 absolute bg-cyan-400 rotate-45" />
                </div>

                {/* Track 1: Video */}
                <div className="flex items-center gap-2">
                  <div className="w-28 flex items-center justify-between text-[11px] font-semibold text-slate-700 bg-white px-2 py-1.5 rounded-lg border border-slate-200">
                    <span className="flex items-center gap-1.5">
                      <Video className="w-3 h-3 text-indigo-500" />
                      <span>Video</span>
                    </span>
                    <Eye className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="flex-1 bg-white h-7 rounded-lg border border-slate-200 overflow-hidden flex items-center px-1 gap-1">
                    <div className="w-1/3 h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded flex items-center px-2 text-[10px] text-white font-medium truncate">
                      Scene_01_Sunset.mp4
                    </div>
                    <div className="w-1/3 h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded flex items-center px-2 text-[10px] text-white font-medium truncate">
                      Scene_02_FlyingCars.mp4
                    </div>
                    <div className="w-1/3 h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded flex items-center px-2 text-[10px] text-white font-medium truncate">
                      Scene_03_CyberCity.mp4
                    </div>
                  </div>
                </div>

                {/* Track 2: Motion Graphics */}
                <div className="flex items-center gap-2">
                  <div className="w-28 flex items-center justify-between text-[11px] font-semibold text-slate-700 bg-white px-2 py-1.5 rounded-lg border border-slate-200">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-cyan-500" />
                      <span>Motion Graphics</span>
                    </span>
                    <Eye className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="flex-1 bg-white h-7 rounded-lg border border-slate-200 overflow-hidden flex items-center px-1">
                    <div className="w-2/5 ml-[15%] h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded flex items-center justify-between px-2 text-[10px] text-white font-bold shadow-xs">
                      <span>Neon Text Animation</span>
                      <span className="bg-white/20 px-1 rounded text-[9px]">H</span>
                    </div>
                  </div>
                </div>

                {/* Track 3: Image */}
                <div className="flex items-center gap-2">
                  <div className="w-28 flex items-center justify-between text-[11px] font-semibold text-slate-700 bg-white px-2 py-1.5 rounded-lg border border-slate-200">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-3 h-3 text-emerald-500" />
                      <span>Image</span>
                    </span>
                    <Eye className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="flex-1 bg-white h-7 rounded-lg border border-slate-200 overflow-hidden flex items-center px-1 gap-1">
                    <div className="w-1/4 h-full bg-emerald-500/20 border border-emerald-400/40 rounded flex items-center px-2 text-[9px] text-emerald-800 font-medium">
                      Mountain_BG.png
                    </div>
                    <div className="w-1/4 ml-[10%] h-full bg-cyan-500/20 border border-cyan-400/40 rounded flex items-center px-2 text-[9px] text-cyan-800 font-medium">
                      Holographic_HUD.png
                    </div>
                  </div>
                </div>

                {/* Track 4: Audio */}
                <div className="flex items-center gap-2">
                  <div className="w-28 flex items-center justify-between text-[11px] font-semibold text-slate-700 bg-white px-2 py-1.5 rounded-lg border border-slate-200">
                    <span className="flex items-center gap-1.5">
                      <Music className="w-3 h-3 text-emerald-500" />
                      <span>Audio</span>
                    </span>
                    <Eye className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="flex-1 bg-white h-7 rounded-lg border border-slate-200 overflow-hidden flex items-center px-1 gap-1">
                    <div className="w-3/5 h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded flex items-center px-2 text-[10px] text-white font-semibold">
                      <span>♫ Background Music</span>
                    </div>
                    <div className="w-1/4 ml-2 h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded flex items-center px-2 text-[10px] text-white font-semibold">
                      <span>🎙 Voice Over</span>
                    </div>
                  </div>
                </div>

                {/* Track 5: FX */}
                <div className="flex items-center gap-2">
                  <div className="w-28 flex items-center justify-between text-[11px] font-semibold text-slate-700 bg-white px-2 py-1.5 rounded-lg border border-slate-200">
                    <span className="flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-amber-500" />
                      <span>FX</span>
                    </span>
                    <Eye className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="flex-1 bg-white h-7 rounded-lg border border-slate-200 overflow-hidden flex items-center px-1 gap-1.5">
                    <div className="w-1/4 h-full bg-gradient-to-r from-cyan-400 to-teal-500 rounded flex items-center px-2 text-[9px] text-white font-bold">
                      Lens Flare
                    </div>
                    <div className="w-1/4 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center px-2 text-[9px] text-white font-bold">
                      Particle FX
                    </div>
                    <div className="w-1/4 h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded flex items-center px-2 text-[9px] text-white font-bold">
                      Glow FX
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* RIGHT SIDEBAR (Col 10-12: 3 columns) */}
          <aside className="lg:col-span-3 p-4 sm:p-5 flex flex-col justify-between bg-slate-50/40">
            <div>
              {/* Sidebar Tabs */}
              <div className="flex items-center gap-1 border-b border-slate-200 pb-2 mb-4 text-xs font-semibold">
                <button
                  onClick={() => {
                    sounds.playBlip();
                    setActiveRightTab('AI Generator');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                    activeRightTab === 'AI Generator'
                      ? 'text-indigo-600 bg-indigo-50 border border-indigo-200/60'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Generator</span>
                </button>
                <button
                  onClick={() => {
                    sounds.playBlip();
                    setActiveRightTab('Manual Edit');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    activeRightTab === 'Manual Edit'
                      ? 'text-indigo-600 bg-indigo-50 border border-indigo-200/60'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span>Manual Edit</span>
                </button>
                <button
                  onClick={() => {
                    sounds.playBlip();
                    setActiveRightTab('Project');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    activeRightTab === 'Project'
                      ? 'text-indigo-600 bg-indigo-50 border border-indigo-200/60'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span>Project</span>
                </button>
              </div>

              {/* Generation Tool Cards with Distinct Vibrant Gradient Tiles */}
              <div className="space-y-2 mb-6">
                {[
                  {
                    title: 'Video Generation',
                    desc: 'Generate full videos from text prompts, images or your ideas.',
                    gradient: 'from-indigo-500 to-purple-600',
                    icon: <Video className="w-4 h-4 text-white" />,
                  },
                  {
                    title: 'Image Generation',
                    desc: 'Create stunning images in any style.',
                    gradient: 'from-emerald-400 to-teal-500',
                    icon: <ImageIcon className="w-4 h-4 text-white" />,
                  },
                  {
                    title: 'Audio Generation',
                    desc: 'Generate music, voiceovers, sound effects and more.',
                    gradient: 'from-purple-500 to-pink-500',
                    icon: <Music className="w-4 h-4 text-white" />,
                  },
                  {
                    title: 'Motion Graphics Generation',
                    desc: 'Create dynamic motion graphics and animations.',
                    gradient: 'from-teal-400 to-cyan-500',
                    icon: <Layers className="w-4 h-4 text-white" />,
                  },
                  {
                    title: 'FX Generation',
                    desc: 'Add amazing visual effects to your videos.',
                    gradient: 'from-purple-600 to-indigo-600',
                    icon: <Star className="w-4 h-4 text-white" />,
                  },
                ].map((tool, idx) => (
                  <div
                    key={idx}
                    onClick={() => sounds.playBlip()}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        {tool.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {tool.title}
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">
                          {tool.desc}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600" />
                  </div>
                ))}
              </div>

              {/* Model Selector Section */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Model Selector</span>
                  </div>
                </div>

                {/* Cloud Models vs Local Models pill button */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-200/60 rounded-xl mb-3 text-[11px] font-semibold">
                  <button
                    onClick={() => {
                      sounds.playBlip();
                      setActiveModelTab('Cloud');
                    }}
                    className={`py-1 rounded-lg text-center transition-all ${
                      activeModelTab === 'Cloud' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Cloud Models
                  </button>
                  <button
                    onClick={() => {
                      sounds.playBlip();
                      setActiveModelTab('Local');
                    }}
                    className={`py-1 rounded-lg text-center transition-all ${
                      activeModelTab === 'Local' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Local Models
                  </button>
                </div>

                {/* Models List with Toggle Switches matching screenshot */}
                {activeModelTab === 'Cloud' ? (
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Available Models
                    </div>

                    {[
                      { key: 'gpt4o', name: 'OpenAI GPT-4o', type: 'Text / Video', badge: 'Cloud' },
                      { key: 'sdxl', name: 'Stable Diffusion XL', type: 'Image', badge: 'Cloud' },
                      { key: 'runway', name: 'Runway Gen-3', type: 'Video', badge: 'Cloud' },
                      { key: 'elevenlabs', name: 'ElevenLabs', type: 'Audio', badge: 'Cloud' },
                      { key: 'pika', name: 'Pika', type: 'Video', badge: 'Cloud' },
                    ].map((m) => (
                      <div key={m.key} className="flex items-center justify-between text-xs py-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          <span className="font-medium text-slate-800 text-[11px]">{m.name}</span>
                          <span className="text-[10px] text-slate-400">({m.type})</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-600 border border-cyan-200">
                            {m.badge}
                          </span>
                          {/* Toggle switch */}
                          <button
                            onClick={() => toggleModel(m.key)}
                            className={`w-7 h-4 rounded-full transition-colors relative ${
                              modelToggles[m.key] ? 'bg-indigo-600' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                                modelToggles[m.key] ? 'left-3.5' : 'left-0.5'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Local Models (Installed)
                    </div>

                    {[
                      { key: 'llama', name: 'Llama 3.2', type: 'Text / Image', badge: 'Local' },
                      { key: 'localSdxl', name: 'SDXL', type: 'Image', badge: 'Local' },
                      { key: 'animatediff', name: 'AnimateDiff', type: 'Video', badge: 'Local' },
                      { key: 'riffusion', name: 'Riffusion', type: 'Music', badge: 'Local' },
                    ].map((m) => (
                      <div key={m.key} className="flex items-center justify-between text-xs py-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          <span className="font-medium text-slate-800 text-[11px]">{m.name}</span>
                          <span className="text-[10px] text-slate-400">({m.type})</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 border border-purple-200">
                            {m.badge}
                          </span>
                          <button
                            onClick={() => toggleModel(m.key)}
                            className={`w-7 h-4 rounded-full transition-colors relative ${
                              modelToggles[m.key] ? 'bg-indigo-600' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                                modelToggles[m.key] ? 'left-3.5' : 'left-0.5'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
