import React, { useState } from 'react';
import { Plus, Play, Film, Image as ImageIcon, Music, Upload } from 'lucide-react';
import { Clip } from '../../types/timeline';

interface HypKraftMediaGalleryProps {
  currentTime: number;
  onAddClip: (trackId: string, clip: Clip) => void;
  onFileUpload: (file: File) => void;
}

export const HypKraftMediaGallery: React.FC<HypKraftMediaGalleryProps> = ({
  currentTime,
  onAddClip,
  onFileUpload
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'videos' | 'images' | 'audio'>('all');

  // Media presets matching the thumbnails in the reference image
  const stockMedia = [
    {
      id: 'm1',
      title: 'Neon Cyber City Sunset',
      type: 'video',
      duration: '00:15',
      durSec: 15.0,
      thumb: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=300&q=80',
      src: '/media/sample_cyber_reel.mp4'
    },
    {
      id: 'm2',
      title: 'Alpine Emerald Lakes',
      type: 'video',
      duration: '00:12',
      durSec: 12.0,
      thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80',
      src: '/media/sample_cyber_reel.mp4'
    },
    {
      id: 'm3',
      title: 'Cyberpunk Neon Alley',
      type: 'video',
      duration: '00:08',
      durSec: 8.0,
      thumb: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=300&q=80',
      src: '/media/sample_cyber_reel.mp4'
    },
    {
      id: 'm4',
      title: 'Lush Forest Stream',
      type: 'video',
      duration: '00:10',
      durSec: 10.0,
      thumb: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=80',
      src: '/media/sample_cyber_reel.mp4'
    },
    {
      id: 'm5',
      title: 'Solitary Traveler Horizon',
      type: 'video',
      duration: '00:07',
      durSec: 7.0,
      thumb: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=300&q=80',
      src: '/media/sample_cyber_reel.mp4'
    },
    {
      id: 'm6',
      title: 'Cosmic Blue Nebulae',
      type: 'video',
      duration: '00:12',
      durSec: 12.0,
      thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80',
      src: '/media/sample_cyber_reel.mp4'
    },
    {
      id: 'm7',
      title: 'Solar Flare Explosion',
      type: 'video',
      duration: '00:10',
      durSec: 10.0,
      thumb: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=300&q=80',
      src: '/media/sample_cyber_reel.mp4'
    },
    {
      id: 'm8',
      title: 'Orbital Energy Core',
      type: 'video',
      duration: '00:06',
      durSec: 6.0,
      thumb: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80',
      src: '/media/sample_cyber_reel.mp4'
    }
  ];

  const filteredMedia = stockMedia.filter((m) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'videos') return m.type === 'video';
    if (activeFilter === 'images') return m.type === 'image';
    if (activeFilter === 'audio') return m.type === 'audio';
    return true;
  });

  const handleAddMediaToTimeline = (item: (typeof stockMedia)[0]) => {
    const clip: Clip = {
      id: `clip_${Date.now()}`,
      name: item.title,
      type: item.type as any,
      src: item.src,
      start: currentTime,
      duration: item.durSec,
      inPoint: 0,
      volume: 1.0
    };
    onAddClip(item.type === 'audio' ? 'track_audio_1' : 'track_video_1', clip);
  };

  return (
    <div className="bg-white/95 rounded-2xl p-3.5 border border-slate-200/90 shadow-xs flex flex-col h-full backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-800">Media</h3>
        </div>

        {/* Import file [+] button */}
        <label className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-violet-100 text-slate-600 hover:text-violet-700 flex items-center justify-center cursor-pointer transition">
          <Plus className="w-3.5 h-3.5" />
          <input
            type="file"
            accept="video/*,audio/*,image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) onFileUpload(e.target.files[0]);
            }}
            className="hidden"
          />
        </label>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-3 border-b border-slate-100 pb-1.5">
        {(['all', 'videos', 'images', 'audio'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize transition ${
              activeFilter === tab
                ? 'text-violet-700 font-bold border-b-2 border-violet-600'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 2-Column Thumbnail Grid */}
      <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2 pr-1">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            onClick={() => handleAddMediaToTimeline(item)}
            className="group relative rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200/80 cursor-pointer shadow-xs hover:shadow-md hover:border-violet-300 transition-all transform hover:-translate-y-0.5"
          >
            <img
              src={item.thumb}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Duration Badge matching reference */}
            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-xs rounded text-[9px] font-mono text-white font-medium">
              {item.duration}
            </div>

            {/* Hover overlay with add action */}
            <div className="absolute inset-0 bg-violet-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <div className="w-7 h-7 rounded-full bg-white text-violet-700 flex items-center justify-center shadow-lg">
                <Play className="w-3.5 h-3.5 fill-violet-700 ml-0.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
