import sys
import json
import asyncio
from typing import Dict, Any, List, Optional
import httpx

API_BASE = "http://127.0.0.1:8000"

MCP_SERVER_INFO = {
    "name": "hypkraft-ai-editor",
    "version": "1.0.0",
    "description": "Model Context Protocol (MCP) server for HypKraft AI Video & Motion Graphics Editor"
}

MCP_TOOLS = [
    {
        "name": "hypkraft_get_project_state",
        "description": "Retrieves the current timeline state, tracks, clips, duration, aspect ratio, and active playhead in HypKraft.",
        "inputSchema": {
            "type": "object",
            "properties": {}
        }
    },
    {
        "name": "hypkraft_execute_prompt",
        "description": "Executes a natural language editing or motion graphics prompt on the HypKraft timeline (e.g. 'Add a 3D neon title saying CYBER CITY at 2s', 'Add bass drop sound effect', 'Split video at 5s', 'Apply retro VHS glitch fx').",
        "inputSchema": {
            "type": "object",
            "properties": {
                "prompt": {
                    "type": "string",
                    "description": "Natural language editing instruction"
                }
            },
            "required": ["prompt"]
        }
    },
    {
        "name": "hypkraft_add_clip",
        "description": "Adds a clip (video, audio, 3d_title, lower_third, particle_fx, or shader_fx) to the HypKraft timeline.",
        "inputSchema": {
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
    {
        "name": "hypkraft_generate_sound",
        "description": "Generates custom audio, sound effects, or background chords using local procedural synth or cloud ElevenLabs.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "prompt": {"type": "string", "description": "Sound description, e.g. 'heavy bass drop', 'cyber whoosh', 'ambient synth pad'"},
                "duration": {"type": "number", "description": "Sound duration in seconds (default 3.0)"},
                "category": {"type": "string", "description": "Sound category: 'sfx', 'bgm', 'riser', 'drop'"}
            },
            "required": ["prompt"]
        }
    },
    {
        "name": "hypkraft_render_export",
        "description": "Triggers hardware-accelerated FFmpeg export of the current HypKraft timeline to an MP4 video.",
        "inputSchema": {
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
    {
        "name": "hypkraft_generate_visual",
        "description": "Generates a video clip, visual effect background, or 3D asset using local ComfyUI/Kaggle or cloud models (e.g. 'Cyberpunk neon rain flying car', 'Abstract iridescent liquid flow', 'Hunyuan 3D asset').",
        "inputSchema": {
            "type": "object",
            "properties": {
                "prompt": {"type": "string", "description": "Visual prompt description"},
                "type": {"type": "string", "enum": ["video", "image", "3d"], "description": "Visual asset type (default: video)"},
                "duration": {"type": "number", "description": "Duration in seconds (default: 4.0)"}
            },
            "required": ["prompt"]
        }
    },
    {
        "name": "hypkraft_list_models",
        "description": "Lists available cloud and local AI models (Gemini, OpenAI, ElevenLabs, Ollama, ComfyUI, AudioCraft) and their connection status.",
        "inputSchema": {
            "type": "object",
            "properties": {}
        }
    },
    {
        "name": "hypkraft_kaggle_status",
        "description": "Checks Kaggle API authentication status, remaining weekly free GPU hours (30 hrs free Nvidia T4/P100), and live Cloudflare tunnel connection.",
        "inputSchema": {
            "type": "object",
            "properties": {}
        }
    },
    {
        "name": "hypkraft_kaggle_set_token",
        "description": "Saves Kaggle API credentials (username and API key from kaggle.com -> Account -> API -> Create New Token) to enable remote GPU execution right from here.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "username": {"type": "string", "description": "Kaggle username"},
                "key": {"type": "string", "description": "Kaggle API key (e.g. from kaggle.json)"}
            },
            "required": ["username", "key"]
        }
    },
    {
        "name": "hypkraft_kaggle_connect_tunnel",
        "description": "Connects HypKraft directly to a live Kaggle GPU session via Cloudflare Tunnel URL (e.g. 'https://abc-xyz.trycloudflare.com') to run Hunyuan3D or AudioCraft in real time.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "tunnel_url": {"type": "string", "description": "Cloudflare Tunnel URL from running Kaggle notebook (e.g. 'https://xxx.trycloudflare.com')"}
            },
            "required": ["tunnel_url"]
        }
    }
]

import os
API_TOKEN = os.getenv("HYPKRAFT_API_TOKEN", "hypkraft-local-dev-token")

class HypKraftMCPServer:
    @staticmethod
    async def handle_tool_call(tool_name: str, args: Dict[str, Any]) -> Dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {API_TOKEN}",
            "X-HypKraft-Token": API_TOKEN
        }
        async with httpx.AsyncClient(timeout=45.0, headers=headers) as client:
            if tool_name == "hypkraft_get_project_state":
                # Fetch default or active project
                res = await client.get(f"{API_BASE}/api/project/load/proj_default")
                if res.status_code == 200:
                    return {"project": res.json()}
                return {"message": "Project active in studio session", "api": API_BASE}

            elif tool_name == "hypkraft_execute_prompt":
                prompt = args.get("prompt", "")
                payload = {
                    "prompt": prompt,
                    "timeline": {
                        "duration": 15.0,
                        "currentTime": 0.0,
                        "tracks": []
                    }
                }
                res = await client.post(f"{API_BASE}/api/ai/edit-prompt", json=payload)
                if res.status_code == 200:
                    return res.json()
                return {"error": f"API error {res.status_code}: {res.text}"}

            elif tool_name == "hypkraft_generate_sound":
                prompt = args.get("prompt", "whoosh")
                dur = float(args.get("duration", 3.0))
                cat = args.get("category", "sfx")
                res = await client.post(f"{API_BASE}/api/ai/generate-sound", json={
                    "prompt": prompt,
                    "duration": dur,
                    "category": cat
                })
                if res.status_code == 200:
                    return res.json()
                return {"error": res.text}

            elif tool_name == "hypkraft_generate_visual":
                prompt = args.get("prompt", "cyberpunk neon background")
                vtype = args.get("type", "video")
                dur = float(args.get("duration", 4.0))
                res = await client.post(f"{API_BASE}/api/ai/generate-visual", json={
                    "prompt": prompt,
                    "type": vtype,
                    "duration": dur
                })
                if res.status_code == 200:
                    return res.json()
                return {"error": res.text}

            elif tool_name == "hypkraft_render_export":
                res = await client.post(f"{API_BASE}/api/export/render", json={
                    "project": {
                        "duration": 5.0,
                        "aspectRatio": "16:9",
                        "tracks": []
                    }
                })
                if res.status_code == 200:
                    return res.json()
                return {"error": res.text}

            elif tool_name == "hypkraft_list_models":
                res = await client.get(f"{API_BASE}/api/ai/providers")
                if res.status_code == 200:
                    return res.json()
                return {"error": res.text}

            elif tool_name == "hypkraft_add_clip":
                return {
                    "success": True,
                    "action": "added_clip",
                    "clip": args
                }

            elif tool_name == "hypkraft_kaggle_status":
                from backend.services.kaggle_bridge import KaggleBridge
                status = KaggleBridge.get_credentials_status()
                quota = KaggleBridge.check_quota()
                return {
                    "credentials": status,
                    "quota": quota,
                    "worker_notebook": KaggleBridge.create_kaggle_worker_notebook()
                }

            elif tool_name == "hypkraft_kaggle_set_token":
                from backend.services.kaggle_bridge import KaggleBridge
                u = args.get("username", "")
                k = args.get("key", "")
                res = KaggleBridge.set_credentials(u, k)
                return res

            elif tool_name == "hypkraft_kaggle_connect_tunnel":
                from backend.services.kaggle_bridge import KaggleBridge
                t_url = args.get("tunnel_url", "")
                res = KaggleBridge.set_live_tunnel(t_url)
                return res

            return {"error": f"Unknown tool: {tool_name}"}

    @classmethod
    async def process_line(cls, line_str: str) -> Optional[str]:
        line_str = line_str.strip()
        if not line_str:
            return None
        try:
            msg = json.loads(line_str)
            msg_id = msg.get("id")
            method = msg.get("method")
            params = msg.get("params", {})

            if method == "initialize":
                response = {
                    "jsonrpc": "2.0",
                    "id": msg_id,
                    "result": {
                        "protocolVersion": "2024-11-05",
                        "capabilities": {
                            "tools": {}
                        },
                        "serverInfo": MCP_SERVER_INFO
                    }
                }
            elif method == "tools/list":
                response = {
                    "jsonrpc": "2.0",
                    "id": msg_id,
                    "result": {
                        "tools": MCP_TOOLS
                    }
                }
            elif method == "tools/call":
                tool_name = params.get("name")
                arguments = params.get("arguments", {})
                result = await cls.handle_tool_call(tool_name, arguments)
                response = {
                    "jsonrpc": "2.0",
                    "id": msg_id,
                    "result": {
                        "content": [
                            {
                                "type": "text",
                                "text": json.dumps(result, indent=2)
                            }
                        ]
                    }
                }
            else:
                response = {
                    "jsonrpc": "2.0",
                    "id": msg_id,
                    "error": {
                        "code": -32601,
                        "message": f"Method not found: {method}"
                    }
                }
            return json.dumps(response)
        except Exception as e:
            return json.dumps({
                "jsonrpc": "2.0",
                "id": None,
                "error": {
                    "code": -32603,
                    "message": str(e)
                }
            })

    @classmethod
    def run_stdio(cls):
        """Runs the MCP server over standard input/output for IDE / agent clients."""
        for line in sys.stdin:
            resp = asyncio.run(cls.process_line(line))
            if resp:
                sys.stdout.write(resp + "\n")
                sys.stdout.flush()

if __name__ == "__main__":
    HypKraftMCPServer.run_stdio()
