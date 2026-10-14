import { useState, useCallback, useRef } from 'react';
import { ProjectData, Track, Clip, ClipType } from '../types/timeline';

const INITIAL_PROJECT: ProjectData = {
  id: 'proj_default',
  name: 'Cyber Reel 2026',
  duration: 15.0,
  aspectRatio: '16:9',
  fps: 30,
  tracks: [
    {
      id: 'track_graphics',
      name: '3D Motion Graphics',
      type: 'graphics',
      visible: true,
      muted: false,
      locked: false,
      clips: [
        {
          id: 'clip_title_1',
          name: 'Cyberpunk 3D Title',
          type: 'motion_graphics',
          category: '3d_title',
          presetId: 'cyber_title_3d',
          text: 'NEON HORIZON',
          color: '#00ffcc',
          glowColor: '#ff007f',
          start: 1.0,
          duration: 4.5,
          inPoint: 0,
          transform: { x: 0, y: 0.5, z: 0, scale: 1.0, rotation: 0 }
        }
      ]
    },
    {
      id: 'track_fx',
      name: 'Particles & Shaders',
      type: 'fx',
      visible: true,
      muted: false,
      locked: false,
      clips: [
        {
          id: 'clip_fx_1',
          name: 'Golden Embers Sparks',
          type: 'particle_fx',
          presetId: 'particles_sparks',
          start: 0.0,
          duration: 7.0,
          inPoint: 0
        },
        {
          id: 'clip_fx_2',
          name: 'RGB Split Glitch',
          type: 'shader_fx',
          shaderId: 'rgb_split',
          uniforms: { amount: 0.01 },
          start: 5.0,
          duration: 3.5,
          inPoint: 0
        }
      ]
    },
    {
      id: 'track_video_1',
      name: 'Main Video',
      type: 'video',
      visible: true,
      muted: false,
      locked: false,
      clips: [
        {
          id: 'clip_video_main',
          name: 'Sample Cyber Reel',
          type: 'video',
          src: '/media/sample_cyber_reel.mp4',
          start: 0.0,
          duration: 15.0,
          inPoint: 0,
          volume: 1.0
        }
      ]
    },
    {
      id: 'track_audio_1',
      name: 'Audio & SFX',
      type: 'audio',
      visible: true,
      muted: false,
      locked: false,
      clips: [
        {
          id: 'clip_sfx_1',
          name: 'SFX: Cyber Whoosh',
          type: 'audio',
          src: '', // synthesized / loaded
          start: 0.8,
          duration: 3.0,
          inPoint: 0,
          volume: 0.85
        }
      ]
    }
  ]
};

export function useEditorStore() {
  const [project, setProject] = useState<ProjectData>(INITIAL_PROJECT);
  const [currentTime, setCurrentTime] = useState<number>(0.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>('clip_title_1');
  const [zoom, setZoom] = useState<number>(80); // pixels per second

  // History stack for Undo / Redo
  const historyRef = useRef<ProjectData[]>([INITIAL_PROJECT]);
  const historyIndexRef = useRef<number>(0);

  const pushHistory = useCallback((newProject: ProjectData) => {
    const curIdx = historyIndexRef.current;
    const newHist = historyRef.current.slice(0, curIdx + 1);
    newHist.push(newProject);
    if (newHist.length > 30) newHist.shift(); // limit history depth
    historyRef.current = newHist;
    historyIndexRef.current = newHist.length - 1;
    setProject(newProject);
  }, []);

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      setProject(historyRef.current[historyIndexRef.current]);
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      setProject(historyRef.current[historyIndexRef.current]);
    }
  }, []);

  const seek = useCallback((time: number) => {
    const clamped = Math.max(0, Math.min(time, project.duration));
    setCurrentTime(clamped);
  }, [project.duration]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const selectClip = useCallback((clipId: string | null) => {
    setSelectedClipId(clipId);
  }, []);

  const updateClip = useCallback((clipId: string, updates: Partial<Clip>) => {
    setProject(prev => {
      let changed = false;
      const newTracks = prev.tracks.map(t => {
        const cIdx = t.clips.findIndex(c => c.id === clipId);
        if (cIdx === -1) return t;
        changed = true;
        const newClips = [...t.clips];
        newClips[cIdx] = { ...newClips[cIdx], ...updates };
        return { ...t, clips: newClips };
      });
      if (!changed) return prev;
      const nextProj = { ...prev, tracks: newTracks };
      pushHistory(nextProj);
      return nextProj;
    });
  }, [pushHistory]);

  const addClip = useCallback((trackId: string, clip: Clip) => {
    setProject(prev => {
      let targetTrack = prev.tracks.find(t => t.id === trackId);
      let updatedTracks = [...prev.tracks];

      if (!targetTrack) {
        // Fallback to track matching clip type
        const matchingTrack = prev.tracks.find(t => {
          if (clip.type === 'audio') return t.type === 'audio';
          if (clip.type === 'motion_graphics' || clip.type === 'text') return t.type === 'graphics';
          if (clip.type === 'particle_fx' || clip.type === 'shader_fx') return t.type === 'fx';
          return t.type === 'video';
        });

        if (matchingTrack) {
          updatedTracks = updatedTracks.map(t =>
            t.id === matchingTrack.id ? { ...t, clips: [...t.clips, clip] } : t
          );
        } else {
          // create track
          const newTrack: Track = {
            id: `track_${Date.now()}`,
            name: `${clip.type.toUpperCase()} Track`,
            type: clip.type === 'audio' ? 'audio' : clip.type === 'video' ? 'video' : 'graphics',
            visible: true,
            muted: false,
            locked: false,
            clips: [clip]
          };
          updatedTracks.push(newTrack);
        }
      } else {
        updatedTracks = updatedTracks.map(t =>
          t.id === trackId ? { ...t, clips: [...t.clips, clip] } : t
        );
      }

      // Adjust duration if clip extends past
      const clipEnd = clip.start + clip.duration;
      const newDuration = Math.max(prev.duration, clipEnd + 2);
      const nextProj = { ...prev, duration: newDuration, tracks: updatedTracks };
      pushHistory(nextProj);
      return nextProj;
    });
  }, [pushHistory]);

  const removeClip = useCallback((clipId: string) => {
    setProject(prev => {
      const nextTracks = prev.tracks.map(t => ({
        ...t,
        clips: t.clips.filter(c => c.id !== clipId)
      }));
      const nextProj = { ...prev, tracks: nextTracks };
      pushHistory(nextProj);
      return nextProj;
    });
    if (selectedClipId === clipId) setSelectedClipId(null);
  }, [selectedClipId, pushHistory]);

  const splitClipAtTime = useCallback((clipId: string, splitTime: number) => {
    setProject(prev => {
      let changed = false;
      const nextTracks = prev.tracks.map(t => {
        const c = t.clips.find(clip => clip.id === clipId);
        if (!c) return t;
        if (splitTime <= c.start || splitTime >= c.start + c.duration) return t;

        changed = true;
        const originalDuration = c.duration;
        const firstDur = splitTime - c.start;
        const secondDur = originalDuration - firstDur;

        const clip1: Clip = {
          ...c,
          duration: firstDur
        };
        const clip2: Clip = {
          ...c,
          id: `clip_${Date.now()}`,
          start: splitTime,
          duration: secondDur,
          inPoint: c.inPoint + firstDur
        };

        return {
          ...t,
          clips: t.clips.map(item => (item.id === clipId ? clip1 : item)).concat(clip2)
        };
      });

      if (!changed) return prev;
      const nextProj = { ...prev, tracks: nextTracks };
      pushHistory(nextProj);
      return nextProj;
    });
  }, [pushHistory]);

  const setAspectRatio = useCallback((ratio: '16:9' | '9:16' | '1:1') => {
    setProject(prev => {
      const nextProj = { ...prev, aspectRatio: ratio };
      pushHistory(nextProj);
      return nextProj;
    });
  }, [pushHistory]);

  const setProjectData = useCallback((data: ProjectData) => {
    pushHistory(data);
  }, [pushHistory]);

  // Find currently selected clip object
  const selectedClip = project.tracks
    .flatMap(t => t.clips)
    .find(c => c.id === selectedClipId) || null;

  return {
    project,
    currentTime,
    isPlaying,
    selectedClipId,
    selectedClip,
    zoom,
    setZoom,
    seek,
    togglePlay,
    setIsPlaying,
    selectClip,
    updateClip,
    addClip,
    removeClip,
    splitClipAtTime,
    setAspectRatio,
    setProjectData,
    undo,
    redo
  };
}
