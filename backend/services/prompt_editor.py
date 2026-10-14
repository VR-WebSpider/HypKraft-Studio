import json
import uuid
from typing import Dict, Any, List
from backend.services.ai_orchestrator import AIOrchestrator
from backend.services.sound_engine import SoundEngine
from backend.services.motion_presets import MOTION_GRAPHICS_PRESETS, SHADER_FX_PRESETS

class PromptEditor:
    @classmethod
    async def process_prompt(cls, prompt: str, timeline_state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parses user prompt in natural language, determines editing actions,
        generates any audio/SFX/motion graphics, and returns the updated timeline state.
        """
        system_prompt = (
            "You are an AI Video & Motion Graphics Editor Assistant. "
            "The user will give editing commands (e.g. 'Add a 3D cyber title saying Cyber City at 2s', "
            "'Generate an ambient soundscape', 'Apply glitch effect', 'Split clip at 4s'). "
            "Output ONLY valid JSON in this exact structure: "
            '{"summary": "string", "actions": [{"type": "generate_sound|add_motion_graphic|add_particle_fx|apply_shader_fx|split_clip", ...}]}'
        )

        raw_response = await AIOrchestrator.call_llm(prompt, system_prompt)
        
        # Clean response string to extract JSON
        json_str = raw_response.strip()
        if "```json" in json_str:
            json_str = json_str.split("```json")[1].split("```")[0].strip()
        elif "```" in json_str:
            json_str = json_str.split("```")[1].split("```")[0].strip()

        try:
            plan = json.loads(json_str)
        except Exception:
            # Fallback to local heuristic parser
            plan = json.loads(AIOrchestrator._local_semantic_fallback(prompt))

        actions = plan.get("actions", [])
        summary = plan.get("summary", f"Processed prompt: {prompt}")

        # Deep copy or mutate timeline tracks
        tracks: List[Dict[str, Any]] = timeline_state.get("tracks", [])
        playhead = float(timeline_state.get("currentTime", 0.0))

        # Helper to find or create track of specific type
        def get_or_create_track(track_type: str, name: str) -> Dict[str, Any]:
            for t in tracks:
                if t.get("type") == track_type:
                    return t
            new_t = {
                "id": f"track_{uuid.uuid4().hex[:6]}",
                "name": name,
                "type": track_type,
                "visible": True,
                "muted": False,
                "locked": False,
                "clips": []
            }
            tracks.append(new_t)
            return new_t

        for act in actions:
            action_type = act.get("type")
            start_time = float(act.get("start", playhead))
            duration = float(act.get("duration", 3.0))

            if action_type == "generate_sound":
                sound_type = act.get("soundType", "cyber-whoosh")
                sound_result = await SoundEngine.generate_sound_ai(
                    prompt=act.get("prompt", sound_type),
                    sound_category=sound_type,
                    duration=duration
                )
                audio_track = get_or_create_track("audio", "AI Audio & SFX")
                clip_id = f"clip_{uuid.uuid4().hex[:8]}"
                audio_track["clips"].append({
                    "id": clip_id,
                    "name": f"SFX: {sound_type.replace('-', ' ').title()}",
                    "type": "audio",
                    "src": sound_result["url"],
                    "start": start_time,
                    "duration": duration,
                    "inPoint": 0.0,
                    "volume": float(act.get("volume", 0.9)),
                    "color": "#38bdf8"
                })

            elif action_type == "add_motion_graphic":
                preset_id = act.get("presetId", "cyber_title_3d")
                preset = next((p for p in MOTION_GRAPHICS_PRESETS if p["id"] == preset_id), MOTION_GRAPHICS_PRESETS[0])
                graphics_track = get_or_create_track("graphics", "3D Graphics & Titles")
                clip_id = f"clip_{uuid.uuid4().hex[:8]}"
                graphics_track["clips"].append({
                    "id": clip_id,
                    "name": f"3D: {act.get('text', preset.get('text', 'Title'))}",
                    "type": "motion_graphics",
                    "presetId": preset_id,
                    "text": act.get("text", preset.get("text", "TITLE")),
                    "color": preset.get("color", "#00ffcc"),
                    "glowColor": preset.get("glowColor", "#ff007f"),
                    "category": preset.get("category", "3d_title"),
                    "start": start_time,
                    "duration": duration,
                    "inPoint": 0.0,
                    "transform": {"x": 0, "y": 0, "z": 0, "scale": 1.0, "rotation": 0}
                })

            elif action_type == "add_particle_fx":
                preset_id = act.get("presetId", "particles_sparks")
                preset = next((p for p in MOTION_GRAPHICS_PRESETS if p["id"] == preset_id), MOTION_GRAPHICS_PRESETS[5])
                fx_track = get_or_create_track("fx", "Particle & Visual FX")
                clip_id = f"clip_{uuid.uuid4().hex[:8]}"
                fx_track["clips"].append({
                    "id": clip_id,
                    "name": f"FX: {preset.get('name', 'Particles')}",
                    "type": "particle_fx",
                    "presetId": preset_id,
                    "particleCount": preset.get("particleCount", 200),
                    "color": preset.get("color", "#ffaa22"),
                    "start": start_time,
                    "duration": duration,
                    "inPoint": 0.0
                })

            elif action_type == "apply_shader_fx":
                shader_id = act.get("shaderId", "rgb_split")
                preset = next((s for s in SHADER_FX_PRESETS if s["id"] == shader_id), SHADER_FX_PRESETS[0])
                fx_track = get_or_create_track("fx", "Particle & Visual FX")
                clip_id = f"clip_{uuid.uuid4().hex[:8]}"
                fx_track["clips"].append({
                    "id": clip_id,
                    "name": f"Shader: {preset.get('name', 'Shader FX')}",
                    "type": "shader_fx",
                    "shaderId": shader_id,
                    "uniforms": preset.get("uniforms", {}),
                    "start": start_time,
                    "duration": duration,
                    "inPoint": 0.0
                })

            elif action_type == "split_clip":
                split_time = float(act.get("atTime", playhead))
                for t in tracks:
                    if t.get("type") in ["video", "audio"]:
                        for i, clip in enumerate(list(t.get("clips", []))):
                            c_start = clip.get("start", 0)
                            c_dur = clip.get("duration", 0)
                            if c_start < split_time < (c_start + c_dur):
                                # Split clip into two
                                original_dur = c_dur
                                clip["duration"] = split_time - c_start
                                
                                new_clip = dict(clip)
                                new_clip["id"] = f"clip_{uuid.uuid4().hex[:8]}"
                                new_clip["start"] = split_time
                                new_clip["duration"] = original_dur - (split_time - c_start)
                                new_clip["inPoint"] = clip.get("inPoint", 0.0) + (split_time - c_start)
                                t["clips"].append(new_clip)

        # Update timeline state
        timeline_state["tracks"] = tracks
        
        # Recalculate max duration if needed
        max_t = timeline_state.get("duration", 12.0)
        for t in tracks:
            for c in t.get("clips", []):
                end_t = c.get("start", 0) + c.get("duration", 0)
                if end_t > max_t:
                    max_t = end_t
        timeline_state["duration"] = max_t

        return {
            "summary": summary,
            "actions": actions,
            "timeline": timeline_state
        }
