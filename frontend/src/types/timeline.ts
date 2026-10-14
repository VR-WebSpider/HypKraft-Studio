export type ClipType = 'video' | 'audio' | 'motion_graphics' | 'particle_fx' | 'shader_fx' | 'image' | 'text';

export interface Transform3D {
  x: number;
  y: number;
  z: number;
  scale: number;
  rotation: number;
}

export interface Keyframe {
  id: string;
  time: number; // relative to clip start
  property: 'x' | 'y' | 'scale' | 'opacity' | 'rotation';
  value: number;
}

export interface Clip {
  id: string;
  name: string;
  type: ClipType;
  start: number; // timeline start time in seconds
  duration: number; // duration on timeline in seconds
  inPoint: number; // source media offset
  
  // Video / Audio properties
  src?: string;
  volume?: number;
  speed?: number;

  // 3D Motion Graphics / Text properties
  text?: string;
  color?: string;
  glowColor?: string;
  presetId?: string;
  category?: '3d_title' | 'lower_third' | 'particle_fx' | 'ticker';
  fontStyle?: string;
  extrudeDepth?: number;
  transform?: Transform3D;

  // Particle & Shader properties
  particleCount?: number;
  shaderId?: string;
  uniforms?: Record<string, number>;

  // Keyframes
  keyframes?: Keyframe[];
}

export interface Track {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'graphics' | 'fx';
  visible: boolean;
  muted: boolean;
  locked: boolean;
  clips: Clip[];
}

export interface ProjectData {
  id: string;
  name: string;
  duration: number;
  aspectRatio: '16:9' | '9:16' | '1:1';
  fps: number;
  tracks: Track[];
}

export interface ProviderStatus {
  active_llm: string;
  active_sound: string;
  active_visual: string;
  providers: {
    cloud_gemini: { configured: boolean };
    cloud_openai: { configured: boolean };
    cloud_elevenlabs: { configured: boolean };
    local_ollama: { url: string; online: boolean };
    local_comfyui: { url: string; online: boolean };
    local_audiocraft: { url: string; online: boolean };
    built_in_procedural: { online: boolean; description: string };
  };
}
