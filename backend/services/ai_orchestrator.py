import json
import httpx
from typing import Dict, Any, Optional
from backend.config import settings

class AIOrchestrator:
    @classmethod
    async def call_llm(cls, prompt: str, system_prompt: str = "") -> str:
        """
        Routes the prompt to either Cloud (Gemini, OpenAI, Anthropic) or Local (Ollama, LM Studio).
        Falls back gracefully if an endpoint is offline.
        """
        provider = settings.active_llm_provider
        
        # 1. Google Gemini (Cloud)
        if provider == "cloud-gemini" and settings.gemini_api_key:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={settings.gemini_api_key}"
                payload = {
                    "contents": [{
                        "parts": [{"text": f"{system_prompt}\n\nUser: {prompt}"}]
                    }]
                }
                async with httpx.AsyncClient(timeout=25.0) as client:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        return data["candidates"][0]["content"]["parts"][0]["text"]
            except Exception as e:
                print(f"[AIOrchestrator] Gemini error: {e}")

        # 2. OpenAI (Cloud)
        if provider == "cloud-openai" and settings.openai_api_key:
            try:
                async with httpx.AsyncClient(timeout=25.0) as client:
                    resp = await client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers={"Authorization": f"Bearer {settings.openai_api_key}"},
                        json={
                            "model": "gpt-4o-mini",
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": prompt}
                            ]
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        return data["choices"][0]["message"]["content"]
            except Exception as e:
                print(f"[AIOrchestrator] OpenAI error: {e}")

        # 3. Local Ollama
        if provider == "local-ollama":
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post(
                        f"{settings.ollama_url}/api/generate",
                        json={
                            "model": "llama3",
                            "prompt": f"{system_prompt}\n\n{prompt}",
                            "stream": False
                        }
                    )
                    if resp.status_code == 200:
                        return resp.json().get("response", "")
            except Exception as e:
                print(f"[AIOrchestrator] Ollama at {settings.ollama_url} not responding: {e}")

        # 4. Local LM Studio
        if provider == "local-lmstudio":
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post(
                        f"{settings.lmstudio_url}/chat/completions",
                        json={
                            "model": "default",
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": prompt}
                            ]
                        }
                    )
                    if resp.status_code == 200:
                        return resp.json()["choices"][0]["message"]["content"]
            except Exception as e:
                print(f"[AIOrchestrator] LM Studio at {settings.lmstudio_url} not responding: {e}")

        # 5. Intelligent Fallback Engine (Runs local semantic heuristic parsing)
        return cls._local_semantic_fallback(prompt)

    @classmethod
    def _local_semantic_fallback(cls, prompt: str) -> str:
        """
        Local deterministic parser when external cloud or local LLM server is not actively booted.
        Returns valid JSON timeline mutation instruction.
        """
        p = prompt.lower()
        actions = []
        
        # Audio / SFX detection
        if any(w in p for w in ["sound", "audio", "sfx", "whoosh", "bass", "drop", "music", "ambient", "riser", "hit"]):
            sound_type = "cyber-whoosh"
            if "bass" in p or "drop" in p:
                sound_type = "bass-drop"
            elif "ambient" in p or "bgm" in p or "music" in p:
                sound_type = "ambient-pad"
            elif "riser" in p or "buildup" in p:
                sound_type = "riser"
            elif "glitch" in p or "hit" in p:
                sound_type = "glitch-hit"
                
            actions.append({
                "type": "generate_sound",
                "soundType": sound_type,
                "prompt": prompt,
                "trackType": "audio",
                "start": 0.0,
                "duration": 3.0,
                "volume": 0.85
            })

        # 3D Title / Motion Graphic detection
        if any(w in p for w in ["title", "text", "3d", "caption", "lower third", "ticker"]):
            # Extract text if quotes exist, else generate appropriate title
            extracted_text = "NEON HORIZON"
            if '"' in prompt:
                extracted_text = prompt.split('"')[1]
            elif "'" in prompt:
                extracted_text = prompt.split("'")[1]
            elif "title" in p:
                extracted_text = "CYBER MOTION"

            preset_id = "cyber_title_3d"
            if "lower third" in p or "name" in p:
                preset_id = "streamer_lower_third"
            elif "news" in p or "ticker" in p:
                preset_id = "breaking_news_bar"
            elif "hologram" in p or "holo" in p:
                preset_id = "hologram_text"
            elif "gold" in p or "cinematic" in p:
                preset_id = "cinematic_bold"

            actions.append({
                "type": "add_motion_graphic",
                "presetId": preset_id,
                "text": extracted_text,
                "start": 1.0,
                "duration": 4.0
            })

        # Particle FX detection
        if any(w in p for w in ["particle", "particles", "sparks", "matrix", "stardust", "stars"]):
            preset_id = "particles_sparks"
            if "matrix" in p:
                preset_id = "particles_matrix"
            elif "stardust" in p or "space" in p:
                preset_id = "particles_stardust"
                
            actions.append({
                "type": "add_particle_fx",
                "presetId": preset_id,
                "start": 0.0,
                "duration": 8.0
            })

        # Shader / Visual Filter FX
        if any(w in p for w in ["glitch", "vhs", "chromatic", "bloom", "glow", "noir", "vaporwave", "filter", "shader"]):
            shader_id = "rgb_split"
            if "vhs" in p or "glitch" in p:
                shader_id = "vhs_glitch"
            elif "bloom" in p or "glow" in p:
                shader_id = "cyber_bloom"
            elif "noir" in p or "black and white" in p or "b&w" in p:
                shader_id = "film_noir"
            elif "vaporwave" in p or "pastel" in p:
                shader_id = "vaporwave_lut"

            actions.append({
                "type": "apply_shader_fx",
                "shaderId": shader_id,
                "start": 0.0,
                "duration": 6.0
            })

        # Split / Cut detection
        if "split" in p or "cut" in p:
            actions.append({
                "type": "split_clip",
                "atTime": 4.0
            })

        # Default action if prompt was generic
        if not actions:
            actions.append({
                "type": "add_motion_graphic",
                "presetId": "cyber_title_3d",
                "text": "CREATIVE PROMPT",
                "start": 1.0,
                "duration": 4.0
            })
            actions.append({
                "type": "generate_sound",
                "soundType": "cyber-whoosh",
                "start": 1.0,
                "duration": 3.0
            })

        return json.dumps({
            "summary": f"Executed AI prompt: '{prompt}'",
            "actions": actions
        })
