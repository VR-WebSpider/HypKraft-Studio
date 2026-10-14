#!/usr/bin/env python3
"""
HypKraft Studio Command-Line & Agent Interface
Allows editing, audio synthesis, visual generation, and video export directly via CLI or API token.
"""

import sys
import os
import argparse
import json
import httpx

DEFAULT_API_BASE = "http://127.0.0.1:8000"
DEFAULT_TOKEN = os.getenv("HYPKRAFT_API_TOKEN", "hypkraft-local-token")

def get_client(api_base: str, token: str):
    headers = {
        "Authorization": f"Bearer {token}",
        "X-HypKraft-Token": token,
        "Content-Type": "application/json"
    }
    return httpx.Client(base_url=api_base, headers=headers, timeout=60.0)

def cmd_prompt(args):
    """Executes a prompt to mutate the timeline, add 3D titles, audio, cuts, or shaders."""
    with get_client(args.api, args.token) as client:
        res = client.post("/api/mcp/execute", json={
            "tool": "hypkraft_execute_prompt",
            "arguments": {"prompt": args.prompt}
        })
        if res.status_code == 200:
            data = res.json()
            print("=== [HypKraft AI Prompt Executed] ===")
            print(f"Summary: {data.get('result', {}).get('summary', 'OK')}")
            actions = data.get('result', {}).get('actions', [])
            print(f"Actions ({len(actions)}):")
            for a in actions:
                print(f"  * {a.get('type')}: {a}")
        else:
            print(f"[Error {res.status_code}] {res.text}")

def cmd_sound(args):
    """Generates audio/SFX via procedural synth or ElevenLabs."""
    with get_client(args.api, args.token) as client:
        res = client.post("/api/mcp/execute", json={
            "tool": "hypkraft_generate_sound",
            "arguments": {
                "prompt": args.prompt,
                "duration": args.duration,
                "category": args.category
            }
        })
        if res.status_code == 200:
            data = res.json()
            print("=== [HypKraft Sound Generated] ===")
            print(json.dumps(data.get("result", {}), indent=2))
        else:
            print(f"[Error {res.status_code}] {res.text}")

def cmd_visual(args):
    """Generates visual clips or 3D assets."""
    with get_client(args.api, args.token) as client:
        res = client.post("/api/mcp/execute", json={
            "tool": "hypkraft_generate_visual",
            "arguments": {
                "prompt": args.prompt,
                "type": args.type,
                "duration": args.duration
            }
        })
        if res.status_code == 200:
            print("=== [HypKraft Visual Generated] ===")
            print(json.dumps(res.json().get("result", {}), indent=2))
        else:
            print(f"[Error {res.status_code}] {res.text}")

def cmd_render(args):
    """Triggers hardware-accelerated video rendering."""
    with get_client(args.api, args.token) as client:
        res = client.post("/api/mcp/execute", json={
            "tool": "hypkraft_render_export",
            "arguments": {
                "resolution": args.resolution,
                "fps": args.fps
            }
        })
        if res.status_code == 200:
            print("=== [HypKraft Render Complete] ===")
            print(json.dumps(res.json().get("result", {}), indent=2))
        else:
            print(f"[Error {res.status_code}] {res.text}")

def cmd_models(args):
    """Lists AI model providers and connection states."""
    with get_client(args.api, args.token) as client:
        res = client.post("/api/mcp/execute", json={
            "tool": "hypkraft_list_models",
            "arguments": {}
        })
        if res.status_code == 200:
            print("=== [HypKraft AI Providers Status] ===")
            print(json.dumps(res.json().get("result", {}), indent=2))
        else:
            print(f"[Error {res.status_code}] {res.text}")

def cmd_state(args):
    """Retrieves current project and timeline state."""
    with get_client(args.api, args.token) as client:
        res = client.post("/api/mcp/execute", json={
            "tool": "hypkraft_get_project_state",
            "arguments": {}
        })
        if res.status_code == 200:
            print("=== [HypKraft Project State] ===")
            print(json.dumps(res.json().get("result", {}), indent=2))
        else:
            print(f"[Error {res.status_code}] {res.text}")

def cmd_kaggle_status(args):
    """Checks Kaggle API credentials, free GPU quota, and live worker connection."""
    with get_client(args.api, args.token) as client:
        res = client.post("/api/mcp/execute", json={
            "tool": "hypkraft_kaggle_status",
            "arguments": {}
        })
        if res.status_code == 200:
            print("=== [HypKraft Kaggle GPU Worker Status] ===")
            print(json.dumps(res.json().get("result", {}), indent=2))
        else:
            print(f"[Error {res.status_code}] {res.text}")

def cmd_kaggle_token(args):
    """Saves Kaggle API credentials."""
    with get_client(args.api, args.token) as client:
        res = client.post("/api/mcp/execute", json={
            "tool": "hypkraft_kaggle_set_token",
            "arguments": {
                "username": args.username,
                "key": args.key
            }
        })
        if res.status_code == 200:
            print("=== [Kaggle Credentials Saved] ===")
            print(json.dumps(res.json().get("result", {}), indent=2))
        else:
            print(f"[Error {res.status_code}] {res.text}")

def cmd_kaggle_tunnel(args):
    """Connects a live Cloudflare tunnel from a running Kaggle GPU notebook."""
    with get_client(args.api, args.token) as client:
        res = client.post("/api/mcp/execute", json={
            "tool": "hypkraft_kaggle_connect_tunnel",
            "arguments": {"tunnel_url": args.url}
        })
        if res.status_code == 200:
            print("=== [Kaggle Live GPU Tunnel Connected] ===")
            print(json.dumps(res.json().get("result", {}), indent=2))
        else:
            print(f"[Error {res.status_code}] {res.text}")

def main():
    parser = argparse.ArgumentParser(description="HypKraft AI Video & Motion Graphics Editor CLI")
    parser.add_argument("--api", default=DEFAULT_API_BASE, help="HypKraft backend URL")
    parser.add_argument("--token", default=DEFAULT_TOKEN, help="HypKraft API access token")

    subparsers = parser.add_subparsers(dest="command", required=True)

    # Prompt
    p_prompt = subparsers.add_parser("prompt", help="Execute natural language video edit")
    p_prompt.add_argument("prompt", help="Edit instruction (e.g. 'Add neon title saying TECH at 2s')")
    p_prompt.set_defaults(func=cmd_prompt)

    # Sound
    p_sound = subparsers.add_parser("sound", help="Synthesize sound effect or ambient track")
    p_sound.add_argument("prompt", help="Sound description (e.g. 'cyber bass drop')")
    p_sound.add_argument("--duration", type=float, default=3.0, help="Duration in seconds")
    p_sound.add_argument("--category", default="sfx", choices=["sfx", "bgm", "riser", "drop"], help="Sound category")
    p_sound.set_defaults(func=cmd_sound)

    # Visual
    p_visual = subparsers.add_parser("visual", help="Generate video clip or 3D visual")
    p_visual.add_argument("prompt", help="Visual description")
    p_visual.add_argument("--type", default="video", choices=["video", "image", "3d"], help="Visual type")
    p_visual.add_argument("--duration", type=float, default=4.0, help="Duration in seconds")
    p_visual.set_defaults(func=cmd_visual)

    # Render
    p_render = subparsers.add_parser("render", help="Render video export via FFmpeg")
    p_render.add_argument("--resolution", default="1080p", choices=["1080p", "4k", "720p"], help="Output resolution")
    p_render.add_argument("--fps", type=int, default=30, choices=[24, 30, 60], help="Output FPS")
    p_render.set_defaults(func=cmd_render)

    # Models
    p_models = subparsers.add_parser("models", help="List AI providers status")
    p_models.set_defaults(func=cmd_models)

    # State
    p_state = subparsers.add_parser("state", help="Get current timeline state")
    p_state.set_defaults(func=cmd_state)

    # Kaggle Status
    p_kstatus = subparsers.add_parser("kaggle-status", help="Check Kaggle credentials & free GPU quota")
    p_kstatus.set_defaults(func=cmd_kaggle_status)

    # Kaggle Token
    p_ktoken = subparsers.add_parser("kaggle-token", help="Set Kaggle API token")
    p_ktoken.add_argument("username", help="Kaggle username")
    p_ktoken.add_argument("key", help="Kaggle API key from kaggle.json")
    p_ktoken.set_defaults(func=cmd_kaggle_token)

    # Kaggle Tunnel
    p_ktunnel = subparsers.add_parser("kaggle-tunnel", help="Connect live Cloudflare tunnel from Kaggle notebook")
    p_ktunnel.add_argument("url", help="Tunnel URL (e.g. https://xxx.trycloudflare.com)")
    p_ktunnel.set_defaults(func=cmd_kaggle_tunnel)

    args = parser.parse_args()
    args.func(args)

if __name__ == "__main__":
    main()
