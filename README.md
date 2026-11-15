<div align="center">

<img src="hypkraft_icon.png" width="128" height="128" alt="HypKraft Studio Logo" />

# HypKraft Studio

### Personal & Experimental Multi-Tool Creative AI Suite
**AI Video • Image • Audio • 3D Assets • Motion & Animation Engine**

[![Release](https://img.shields.io/badge/Release-v1.0.0_Experimental-emerald.svg?style=for-the-badge)](https://hypkraft.webspiderstudios.com)
[![Platform](https://img.shields.io/badge/Platform-Windows_64--bit-blue.svg?style=for-the-badge&logo=windows)](https://hypkraft.webspiderstudios.com)
[![Architecture](https://img.shields.io/badge/Architecture-React_19_|_Three.js_|_Electron-cyan.svg?style=for-the-badge)](https://hypkraft.webspiderstudios.com)
[![Backend](https://img.shields.io/badge/Backend-FastAPI_|_FFmpeg-green.svg?style=for-the-badge)](https://hypkraft.webspiderstudios.com)
[![Protocol](https://img.shields.io/badge/Protocol-MCP_Port_8000-orange.svg?style=for-the-badge)](https://hypkraft.webspiderstudios.com)
[![License](https://img.shields.io/badge/License-Source--Available_(Non--Commercial)-pink.svg?style=for-the-badge)](LICENSE.md)

**Official Web Portal & Download Hub:** [https://hypkraft.webspiderstudios.com](https://hypkraft.webspiderstudios.com)  
**Maintained by:** WebSpider Studios

---

</div>

## 🌟 Overview

**HypKraft Studio** is a personal and experimental creative workstation that bridges conversational generative AI with professional multi-track Non-Linear Editing (NLE). 

Rather than producing isolated, uneditable video clips, HypKraft connects to your own self-hosted AI models running on cloud GPUs (such as **Kaggle**, **RunPod**, or local GPU instances) to generate and compose complete, layer-by-layer creative timelines:

* 🎬 **AI Video Generation:** Generate dynamic clips and prompt-guided cinematic video sequences directly placed into multi-track video layers.
* 🖼️ **AI Image & Concept Generation:** Create visual concept art, background plates, textures, and style frames on demand.
* 🎵 **AI Audio & Procedural Sound Design:** Synthesize musical stems, Foley sound effects, ambient pads, and Web Audio API waveforms at 48 kHz 32-bit float precision.
* 🧊 **3D Asset Generation & Motion Graphics:** Real-time Three.js & WebGL 2.0 viewport featuring GLSL motion shaders, extruded 3D kinetic typography, and 3D particle nebulas.
* ⚡ **Motion & Animation Engine:** Keyframe curves, camera pans, and procedural transitions for dynamic pacing and visual storytelling.
* ☁️ **Self-Hosted Cloud GPU Integration:** Connects seamlessly to your personal self-hosted cloud GPUs (e.g., Kaggle GPU environments running ComfyUI, Ollama, Whisper, or custom diffusion backends) via secure tunneling, keeping inference private, flexible, and completely under your control.
* 🤖 **Model Context Protocol (MCP):** Embedded MCP server on port 8000 allowing autonomous AI coding assistants (Claude Desktop, Cursor, Antigravity) to inspect clips, manipulate layouts, and trigger video exports headlessly.

---

## 🗺️ How Exactly It Works (System Architecture)

```mermaid
flowchart TD
    subgraph UI ["🖥️ HypKraft Desktop Client (Electron + React 19)"]
        NLE["Multi-Track Timeline NLE (Video / Audio / 3D Tracks)"]
        ThreeCanvas["Three.js / WebGL 2.0 Viewport (Shaders, 3D Typo, Particles)"]
        PromptBar["Prompt-to-Timeline AI Command Bar"]
        WebAudio["Procedural Web Audio API Synthesizer"]
    end

    subgraph LocalCore ["⚡ Local Core Engine (FastAPI :8000)"]
        FastAPI["FastAPI Orchestration Backend (127.0.0.1:8000)"]
        FFmpegEngine["FFmpeg Engine (Hard-Cut, Compositing, 60 FPS Export)"]
        MCPServer["MCP Server (Model Context Protocol :8000)"]
        LocalStorage["Local Storage (Media, Exports, Timeline JSON)"]
    end

    subgraph CloudGPU ["☁️ Self-Hosted Cloud GPUs (Kaggle / RunPod / Private Rig)"]
        VideoGen["Video Generation (AnimateDiff / Wan / CogVideo)"]
        ImageGen["Image & Texture Generation (SDXL / Flux / ComfyUI)"]
        AudioGen["Audio & SFX Generation (AudioCraft / Stable Audio)"]
        SpeechWhisper["Speech & Transcription (Faster-Whisper)"]
        LocalLLM["Prompt Decomposition & Timeline Planning (Ollama / LLMs)"]
    end

    subgraph ExternalAgents ["🤖 Autonomous AI Coding Assistants"]
        Claude["Claude Desktop"]
        Cursor["Cursor IDE"]
        Antigravity["Antigravity / Local Agents"]
    end

    PromptBar -->|Prompt Request| FastAPI
    FastAPI -->|Dispatches Inference| CloudGPU
    CloudGPU -->|Returns Generated Assets| FastAPI
    FastAPI -->|Streams to Project| NLE
    NLE --> ThreeCanvas
    NLE --> WebAudio
    NLE -->|Render Pipeline| FFmpegEngine
    FFmpegEngine -->|Saves Output| LocalStorage

    ExternalAgents <-->|Inspect & Control via MCP| MCPServer
    MCPServer <-->|Direct Timeline State Mutation| FastAPI
```

---

## 🎨 How to Use This Tool (User Creative Workflow)

```mermaid
sequenceDiagram
    autonumber
    actor Creator as 🎬 Creator
    participant Studio as 🖥️ HypKraft Studio UI
    participant Backend as ⚡ FastAPI Backend
    participant GPU as ☁️ Cloud GPU (Kaggle)
    participant Engine as 🎞️ FFmpeg & WebGL

    Creator->>Studio: 1. Input natural language prompt or import raw media
    Note over Creator,Studio: e.g. "Create 10s cyberpunk intro with 3D glowing title and heavy bass drop"
    Studio->>Backend: 2. Parse creative prompt & decompose into timeline layers
    Backend->>GPU: 3. Request Video, Image, Audio & 3D generation via API/Tunnel
    GPU-->>Backend: 4. Stream back generated media assets (MP4, PNG, WAV, GLTF)
    Backend-->>Studio: 5. Auto-populate Multi-Track Timeline with synchronized clips
    Creator->>Studio: 6. Fine-tune in real-time: adjust keyframes, GLSL shaders, 3D typography
    Creator->>Studio: 7. Click "Export Video" (or trigger via MCP agent)
    Studio->>Engine: 8. Render video with FFmpeg hardware acceleration
    Engine-->>Creator: 9. Final 1080p / 4K 60FPS Video ready in exports folder!
```

---

## 🚀 Quick Start (Running HypKraft Studio)

HypKraft Studio is pre-configured with zero prerequisites for end-users:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/VR-WebSpider/HypKraft-Studio.git
   cd HypKraft-Studio
   ```

2. **One-Click Studio Launch:**
   Run the setup batch script:
   ```cmd
   start_studio.bat
   ```
   This automatically initializes:
   * **FastAPI Backend & MCP Server** on `http://127.0.0.1:8000`
   * **Vite / React 19 Frontend** on `http://localhost:5173`
   * **Interactive API Documentation** on `http://127.0.0.1:8000/docs`

3. **Connect to Your Self-Hosted Cloud GPUs:**
   In your `.env` (or via the in-app Settings modal), point your model endpoints to your local or cloud GPU instances:
   ```env
   # Self-Hosted Cloud GPU / Tunnel URLs (e.g. Kaggle / RunPod / Ngrok)
   OLLAMA_URL=http://localhost:11434
   COMFYUI_URL=http://your-kaggle-or-cloud-tunnel:8188
   AUDIOCRAFT_URL=http://your-cloud-gpu:8001
   WHISPER_URL=http://your-cloud-gpu:9000
   ```

---

## 🤖 Model Context Protocol (MCP) Server

HypKraft Studio runs an internal MCP server allowing external AI agents to manipulate the timeline.

### Agent Configuration (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "hypkraft-studio": {
      "command": "python",
      "args": ["services/mcp_server.py"],
      "env": {
        "HYPKRAFT_STUDIO_URL": "http://127.0.0.1:8000"
      }
    }
  }
}
```

### Available MCP Tools:
| Tool Name | Action |
|---|---|
| `hypkraft_get_project_state` | Retrieves project timeline, tracks, playhead, and active clip states. |
| `hypkraft_execute_prompt` | Executes natural language prompt to generate or modify timeline clips. |
| `hypkraft_add_clip` | Inserts a video, image, audio, or 3D graphic clip to a specific track. |
| `hypkraft_split_clip` | Splits a clip at a given timestamp. |
| `hypkraft_render_export` | Initiates video export rendering via FFmpeg engine. |

---

## 🔒 Privacy & Architecture Notes

- **Local-First Storage:** Project timelines, cache, and exported media files remain on your local disk.
- **Loopback Isolated:** The backend server and MCP endpoints bind exclusively to `127.0.0.1` (localhost), ensuring external networks cannot access your editing session without your authorization.
- **Self-Hosted AI Flexibility:** All creative generation pipelines are modular and connect to your own self-hosted cloud or local GPU instances, guaranteeing complete privacy and zero third-party subscription lock-in.

---

## 📄 Legal & Documentation Links

- **Full User Manual:** [USER_GUIDE.md](USER_GUIDE.md)
- **Source-Available License:** [LICENSE.md](LICENSE.md)
- **End User License Agreement:** [EULA.md](EULA.md)
- **Security Policy:** [SECURITY.md](SECURITY.md)
- **Official Portal:** [https://hypkraft.webspiderstudios.com](https://hypkraft.webspiderstudios.com)

---

<div align="center">
  <p>© 2026 WebSpider Studios. Experimental Creative AI Workstation.</p>
</div>
