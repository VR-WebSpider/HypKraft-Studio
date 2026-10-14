import numpy as np
import soundfile as sf
import uuid
import httpx
from pathlib import Path
from backend.config import MEDIA_DIR, settings

class SoundEngine:
    @staticmethod
    def generate_procedural_sound(sound_type: str, duration: float = 3.0, sample_rate: int = 44100) -> str:
        """
        Generates rich procedural audio/SFX/music textures locally without any cloud dependencies.
        Types: 'cyber-whoosh', 'bass-drop', 'ambient-pad', 'glitch-hit', 'riser', 'lofi-beat', 'laser'
        """
        t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
        audio = np.zeros_like(t)
        
        sound_type = sound_type.lower()
        if "whoosh" in sound_type or "transition" in sound_type:
            # Sweeping filtered noise + pitch sweep
            noise = np.random.uniform(-1, 1, len(t))
            envelope = np.sin(np.pi * t / duration) ** 2
            freq = np.linspace(100, 2400, len(t))
            sine_sweep = np.sin(2 * np.pi * freq * t)
            audio = (noise * 0.6 + sine_sweep * 0.4) * envelope
        elif "bass" in sound_type or "drop" in sound_type or "impact" in sound_type:
            # Pitch diving 808-style sine wave + saturation
            freq = 150 * np.exp(-4 * t) + 40
            sine = np.sin(2 * np.pi * freq * t)
            envelope = np.exp(-2.5 * t)
            audio = np.tanh(sine * 2.5) * envelope
        elif "ambient" in sound_type or "pad" in sound_type or "bgm" in sound_type:
            # Multi-oscillator chord (Root, Min 3rd, 5th, Octave) with subtle chorus/LFO
            chords = [220.0, 261.63, 329.63, 440.0]  # Am chord
            for f in chords:
                lfo = 1.0 + 0.03 * np.sin(2 * np.pi * 0.5 * t)
                audio += 0.25 * np.sin(2 * np.pi * f * lfo * t)
            # Smooth fade in and out
            fade_len = int(sample_rate * 0.4)
            audio[:fade_len] *= np.linspace(0, 1, fade_len)
            audio[-fade_len:] *= np.linspace(1, 0, fade_len)
        elif "riser" in sound_type or "buildup" in sound_type:
            # Exponential rising pitch + noisy grit
            freq = 60 * np.exp(2.8 * (t / duration))
            sine = np.sin(2 * np.pi * freq * t)
            noise = np.random.uniform(-0.5, 0.5, len(t)) * (t / duration)
            audio = (sine * 0.7 + noise * 0.3) * (t / duration)
        elif "glitch" in sound_type or "hit" in sound_type:
            # Sharp transient burst followed by stuttered pulses
            pulse = np.sin(2 * np.pi * 600 * t) * np.exp(-15 * t)
            stutter = np.sin(2 * np.pi * 30 * t) > 0
            audio = pulse + 0.2 * stutter * np.random.uniform(-1, 1, len(t)) * np.exp(-4 * t)
        else:
            # Default cinematic tone
            audio = np.sin(2 * np.pi * 440 * t) * np.exp(-1.5 * t)
            
        # Normalize to -1.0 to 1.0
        max_val = np.max(np.abs(audio))
        if max_val > 0:
            audio = audio / max_val * 0.85
            
        # Save audio file
        filename = f"audio_{uuid.uuid4().hex[:8]}.wav"
        output_path = MEDIA_DIR / filename
        sf.write(str(output_path), audio.astype(np.float32), sample_rate)
        return filename

    @classmethod
    async def generate_sound_ai(cls, prompt: str, sound_category: str = "sfx", duration: float = 3.0) -> dict:
        """
        Dispatches generation to:
        1. ElevenLabs (if cloud & key present)
        2. Local AudioCraft / Bark API (if running)
        3. Built-in high-quality procedural audio synthesis engine (instant, zero-latency fallback)
        """
        provider = settings.active_sound_provider
        
        # 1. ElevenLabs Cloud SFX / Voiceover
        if provider == "cloud-elevenlabs" and settings.elevenlabs_api_key:
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post(
                        "https://api.elevenlabs.io/v1/sound-generation",
                        headers={
                            "xi-api-key": settings.elevenlabs_api_key,
                            "Content-Type": "application/json"
                        },
                        json={
                            "text": prompt,
                            "duration_seconds": min(duration, 10.0),
                            "prompt_influence": 0.3
                        }
                    )
                    if resp.status_code == 200:
                        filename = f"sfx_eleven_{uuid.uuid4().hex[:8]}.mp3"
                        filepath = MEDIA_DIR / filename
                        filepath.write_bytes(resp.content)
                        return {
                            "filename": filename,
                            "url": f"/media/{filename}",
                            "provider": "cloud-elevenlabs",
                            "prompt": prompt,
                            "duration": duration
                        }
            except Exception as e:
                print(f"[SoundEngine] ElevenLabs failed: {e}, falling back to local engine")
                
        # 2. Local AudioCraft / Bark service
        if provider in ["local-audiocraft", "local-bark"]:
            try:
                async with httpx.AsyncClient(timeout=45.0) as client:
                    resp = await client.post(
                        f"{settings.audiocraft_url}/generate",
                        json={"prompt": prompt, "duration": duration, "category": sound_category}
                    )
                    if resp.status_code == 200:
                        filename = f"sfx_local_{uuid.uuid4().hex[:8]}.wav"
                        filepath = MEDIA_DIR / filename
                        filepath.write_bytes(resp.content)
                        return {
                            "filename": filename,
                            "url": f"/media/{filename}",
                            "provider": provider,
                            "prompt": prompt,
                            "duration": duration
                        }
            except Exception as e:
                print(f"[SoundEngine] Local AudioCraft/Bark service not reachable at {settings.audiocraft_url}: {e}")

        # 3. Built-in Procedural Audio Synth
        filename = cls.generate_procedural_sound(prompt, duration=duration)
        return {
            "filename": filename,
            "url": f"/media/{filename}",
            "provider": "built-in-synth",
            "prompt": prompt,
            "duration": duration
        }
