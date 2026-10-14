import os
import json
from pathlib import Path

MCP_DIR = Path(r"C:\Users\vivek\.gemini\antigravity\mcp\hypkraft")
MCP_CONFIG_PATH = Path(r"C:\Users\vivek\.gemini\antigravity\mcp_config.json")
MCP_DIR.mkdir(parents=True, exist_ok=True)

TOOLS = {
    "hypkraft_get_project_state.json": {
        "name": "hypkraft_get_project_state",
        "description": "Retrieves the current timeline state, tracks, clips, duration, aspect ratio, and active playhead in HypKraft AI Video Editor.",
        "parameters": {
            "type": "object",
            "properties": {}
        }
    },
    "hypkraft_execute_prompt.json": {
        "name": "hypkraft_execute_prompt",
        "description": "Executes a natural language editing or motion graphics prompt on the HypKraft timeline (e.g. 'Add a 3D neon title saying CYBER CITY at 2s', 'Add bass drop sound effect', 'Split video at 5s', 'Apply retro VHS glitch fx').",
        "parameters": {
            "type": "object",
            "properties": {
                "prompt": {
                    "type": "string",
                    "description": "Natural language editing instruction or motion graphics command"
                }
            },
            "required": ["prompt"]
        }
    },
    "hypkraft_add_clip.json": {
        "name": "hypkraft_add_clip",
        "description": "Adds a clip (video, audio, 3d_title, lower_third, particle_fx, or shader_fx) directly to the HypKraft timeline.",
        "parameters": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string",
                    "enum": ["video", "audio", "motion_graphics", "particle_fx", "shader_fx"],
                    "description": "Type of clip to insert"
                },
                "name": {"type": "string", "description": "Display name of the clip"},
                "start": {"type": "number", "description": "Timeline start position in seconds"},
                "duration": {"type": "number", "description": "Clip duration in seconds"},
                "text": {"type": "string", "description": "Text for 3D title or lower third"},
                "presetId": {"type": "string", "description": "Preset ID (e.g. cyber_title_3d, streamer_lower_third, particles_sparks, rgb_split)"},
                "color": {"type": "string", "description": "Primary color hex code"},
                "glowColor": {"type": "string", "description": "Glow color hex code"}
            },
            "required": ["type", "name", "start", "duration"]
        }
    },
    "hypkraft_generate_sound.json": {
        "name": "hypkraft_generate_sound",
        "description": "Generates custom audio, sound effects, or background chords using zero-latency procedural DSP synth or cloud ElevenLabs.",
        "parameters": {
            "type": "object",
            "properties": {
                "prompt": {"type": "string", "description": "Sound description, e.g. 'heavy bass drop', 'cyber whoosh', 'ambient synth pad'"},
                "duration": {"type": "number", "description": "Sound duration in seconds (default 3.0)"},
                "category": {
                    "type": "string",
                    "enum": ["sfx", "bgm", "riser", "drop"],
                    "description": "Sound category: 'sfx', 'bgm', 'riser', 'drop'"
                }
            },
            "required": ["prompt"]
        }
    },
    "hypkraft_generate_visual.json": {
        "name": "hypkraft_generate_visual",
        "description": "Generates a video clip, visual effect background, or 3D asset using local ComfyUI/Kaggle or procedural motion generator.",
        "parameters": {
            "type": "object",
            "properties": {
                "prompt": {"type": "string", "description": "Visual prompt description"},
                "type": {"type": "string", "enum": ["video", "image", "3d"], "description": "Visual asset type (default: video)"},
                "duration": {"type": "number", "description": "Duration in seconds (default: 4.0)"}
            },
            "required": ["prompt"]
        }
    },
    "hypkraft_render_export.json": {
        "name": "hypkraft_render_export",
        "description": "Triggers hardware-accelerated FFmpeg export of the current HypKraft timeline to an MP4 video.",
        "parameters": {
            "type": "object",
            "properties": {
                "resolution": {
                    "type": "string",
                    "enum": ["1080p", "4k", "720p"],
                    "description": "Export resolution"
                },
                "fps": {
                    "type": "integer",
                    "enum": [24, 30, 60],
                    "description": "Framerate"
                }
            }
        }
    },
    "hypkraft_list_models.json": {
        "name": "hypkraft_list_models",
        "description": "Lists available cloud and local AI models (Gemini, OpenAI, ElevenLabs, Ollama, ComfyUI, AudioCraft) and their connection status.",
        "parameters": {
            "type": "object",
            "properties": {}
        }
    },
    "hypkraft_kaggle_status.json": {
        "name": "hypkraft_kaggle_status",
        "description": "Checks Kaggle API authentication status, remaining weekly free GPU hours (30 hrs free Nvidia T4/P100), and live Cloudflare tunnel connection.",
        "parameters": {
            "type": "object",
            "properties": {}
        }
    },
    "hypkraft_kaggle_set_token.json": {
        "name": "hypkraft_kaggle_set_token",
        "description": "Saves Kaggle API credentials (username and API key from kaggle.com -> Account -> API -> Create New Token) to enable remote GPU execution right from here.",
        "parameters": {
            "type": "object",
            "properties": {
                "username": {"type": "string", "description": "Kaggle username"},
                "key": {"type": "string", "description": "Kaggle API key (e.g. from kaggle.json)"}
            },
            "required": ["username", "key"]
        }
    },
    "hypkraft_kaggle_connect_tunnel.json": {
        "name": "hypkraft_kaggle_connect_tunnel",
        "description": "Connects HypKraft directly to a live Kaggle GPU session via Cloudflare Tunnel URL (e.g. 'https://abc-xyz.trycloudflare.com') to run Hunyuan3D or AudioCraft in real time.",
        "parameters": {
            "type": "object",
            "properties": {
                "tunnel_url": {"type": "string", "description": "Cloudflare Tunnel URL from running Kaggle notebook (e.g. 'https://xxx.trycloudflare.com')"}
            },
            "required": ["tunnel_url"]
        }
    }
}

# 1. Write tool schemas
for filename, schema in TOOLS.items():
    tool_file = MCP_DIR / filename
    tool_file.write_text(json.dumps(schema, indent=2), encoding="utf-8")
    print(f"[OK] Wrote schema: {tool_file}")

# 2. Write instructions.md
instructions = """# HypKraft Studio MCP Server Instructions

HypKraft is an AI-powered Video and Motion Graphics editing studio.
You can control the timeline, synthesize audio/SFX, generate 3D motion graphics, and render final videos.

## Best Practices
1. **Inspecting State**: Use `hypkraft_get_project_state` to see the current duration, tracks, and existing clips before making complex edits.
2. **Natural Language Editing**: Use `hypkraft_execute_prompt` for edits like:
   - "Add a 3D neon title saying CYBER REEL at 2s"
   - "Add heavy bass drop sound effect"
   - "Split video at 5s"
   - "Apply retro VHS glitch fx"
3. **Sound Generation**: Use `hypkraft_generate_sound` to synthesize custom sound effects (whoosh, bass drop, ambient pads, risers).
4. **Rendering**: Call `hypkraft_render_export` with resolution 1080p and fps 30/60 to export the finished MP4 video file.
"""
(MCP_DIR / "instructions.md").write_text(instructions, encoding="utf-8")
print(f"[OK] Wrote instructions.md to {MCP_DIR}")

# 3. Update mcp_config.json
if MCP_CONFIG_PATH.exists():
    try:
        config = json.loads(MCP_CONFIG_PATH.read_text(encoding="utf-8"))
    except Exception:
        config = {"mcpServers": {}}
else:
    config = {"mcpServers": {}}

config.setdefault("mcpServers", {})
config["mcpServers"]["hypkraft"] = {
    "command": r"d:\AI Video Editor\venv\Scripts\python.exe",
    "args": [
        r"d:\AI Video Editor\backend\services\mcp_server.py"
    ],
    "env": {
        "PYTHONIOENCODING": "utf-8",
        "HYPKRAFT_API_TOKEN": os.getenv("HYPKRAFT_API_TOKEN", "hypkraft-local-token")
    }
}

MCP_CONFIG_PATH.write_text(json.dumps(config, indent=2), encoding="utf-8")
print(f"[OK] Registered 'hypkraft' in {MCP_CONFIG_PATH}")
print("[Success] HypKraft MCP Server successfully configured for Antigravity & Agentic clients!")
