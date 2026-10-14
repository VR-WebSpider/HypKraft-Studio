<div align="center">

<img src="hypkraft_icon.png" width="128" height="128" alt="HypKraft Studio Logo" />

# HypKraft Studio

### The World's First Prompt-to-Timeline AI Video and 3D Motion Graphics Editor

[![Release](https://img.shields.io/badge/Release-v1.0.0_Stable-emerald.svg?style=for-the-badge)](https://hypkraft.webspiderstudios.com)
[![Platform](https://img.shields.io/badge/Platform-Windows_64--bit-blue.svg?style=for-the-badge&logo=windows)](https://hypkraft.webspiderstudios.com)
[![Prerequisites](https://img.shields.io/badge/Prerequisites-ZERO_(No_Node/Python)-purple.svg?style=for-the-badge)](https://hypkraft.webspiderstudios.com)
[![Architecture](https://img.shields.io/badge/Architecture-React_19_|_Three.js_|_Electron-cyan.svg?style=for-the-badge)](https://hypkraft.webspiderstudios.com)
[![Protocol](https://img.shields.io/badge/Protocol-MCP_Port_8000-orange.svg?style=for-the-badge)](https://hypkraft.webspiderstudios.com)
[![License](https://img.shields.io/badge/License-EULA_(100%25_Creator_Owned)-pink.svg?style=for-the-badge)](EULA.md)

**Official Web Portal & Download Hub:** [https://hypkraft.webspiderstudios.com](https://hypkraft.webspiderstudios.com)  
**Maintained by:** WebSpider Studios

---

</div>

## 🌟 Overview

**HypKraft Studio** bridges conversational generative AI with professional multi-track Non-Linear Editing (NLE). Instead of producing isolated, immutable video clips, HypKraft generates complete, fully editable timeline sequences featuring:
- **Multi-Track Compositing:** Video tracks, extruded 3D kinetic typography, procedural audio stems, and ambient music.
- **Three.js & WebGL 2.0 Engine:** Real-time GLSL motion shaders, extruded text ribbons, particle nebulas, and chromatic aberration.
- **Procedural Audio Synthesizer:** Real-time Web Audio API waveform generation with 48 kHz 32-bit float accuracy.
- **Model Context Protocol (MCP):** Native server allowing autonomous AI coding assistants (Claude Desktop, Cursor, Antigravity) to inspect clips, manipulate layouts, and trigger video exports headlessly.

---

## 🚀 Zero-Prerequisites Architecture (For End Users)

HypKraft Studio is built so that **any user downloading the software can run it instantly on Windows without requiring any prerequisites**:
- ❌ **No Python required** on the host system.
- ❌ **No Node.js or npm required** on the host system.
- ❌ **No complex build environments or command lines required.**

The application is pre-packaged with embedded V8 and Chromium engines, native WebGL 2.0 hardware acceleration, and internal sound synthesis.

---

## 📦 Installation & Mandatory EULA Agreement

1. Download **`HypKraft-Studio-Setup-v1.0.0.exe`** from [https://hypkraft.webspiderstudios.com](https://hypkraft.webspiderstudios.com).
2. Run the installer setup wizard.
3. **End User License Agreement (EULA) Checkbox:**  
   During installation, you will be presented with the EULA agreement screen. You must read and accept the agreement checkbox:  
   `[x] I have read and agree to the HypKraft End User License Agreement (EULA) and Terms of Service.`  
   *(The "Next / Install" button remains disabled until this checkbox is confirmed.)*
4. Click **Install**. The wizard creates the desktop shortcut and registers the standalone application.
5. Launch and begin editing immediately!

---

## 🎨 Core Architectural Pillars

```
┌────────────────────────────────────────────────────────────────────────┐
│                          HYPKRAFT STUDIO CORE                          │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
       ┌─────────────────────────────┼────────────────────────────┐
       ▼                             ▼                            ▼
┌───────────────┐           ┌──────────────────┐         ┌────────────────┐
│   PROMPT-TO   │           │ THREE.JS & WEBGL │         │   PROCEDURAL   │
│   TIMELINE    │           │    3D SHADERS    │         │  AUDIO SYNTH   │
│ Natural Lang  │           │ Iridescent Ribbon│         │ Web Audio API  │
│ Multi-Track   │           │ Kinetic Typo     │         │ Sub-Bass Drop  │
│ Keyframes     │           │ GLSL Post-FX     │         │ Hologram SFX   │
└───────┬───────┘           └────────┬─────────┘         └───────┬────────┘
        │                            │                           │
        └────────────────────────────┼───────────────────────────┘
                                     │
                                     ▼
        ┌────────────────────────────────────────────────────────┐
        │        STANDALONE ELECTRON DESKTOP ENGINE (60 FPS)      │
        │    Local Storage • GPU Acceleration • Zero Tracking   │
        └────────────────────────────┬───────────────────────────┘
                                     │
                                     ▼
        ┌────────────────────────────────────────────────────────┐
        │      MODEL CONTEXT PROTOCOL (MCP) SERVER (PORT 8000)   │
        │    Claude Desktop • Cursor IDE • Autonomous Agents     │
        └────────────────────────────────────────────────────────┘
```

---

## 🤖 Model Context Protocol (MCP) Server

HypKraft Studio runs an internal MCP server allowing external AI agents to manipulate the timeline.

### Agent Configuration (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "hypkraft-studio": {
      "command": "npx",
      "args": ["-y", "hypkraft-mcp-server"],
      "env": {
        "HYPKRAFT_STUDIO_URL": "http://localhost:8000"
      }
    }
  }
}
```

### Available MCP Tools:
| Tool Name | Action |
|---|---|
| `hypkraft_get_project_state` | Retrieves project timeline, tracks, and clip states. |
| `hypkraft_execute_prompt` | Executes natural language prompt to generate or modify timeline clips. |
| `hypkraft_add_clip` | Inserts a video, audio, or 3D graphic clip to a specific track. |
| `hypkraft_split_clip` | Splits a clip at a given timestamp. |
| `hypkraft_render_export` | Initiates video export rendering. |

---

## 🛠️ Developer Mode (Source Setup)

If you are developing or contributing to HypKraft Studio from source:

```bash
# 1. Clone the private repository
git clone https://github.com/VR-WebSpider/HypKraft-Studio.git
cd HypKraft-Studio

# 2. Setup Frontend Desktop Application
cd frontend
npm install
npm run dev

# 3. Launch Desktop Electron Application
npm run electron

# 4. Build Standalone Installer Executable
npm run dist
```

---

## 🔒 Security & Privacy Guarantee

- **Zero Hardcoded Secrets:** No API keys, tokens, or private credentials are stored in this repository or in packaged builds.
- **Local Storage First:** All project timelines and media assets remain on the user's hard drive.
- **Responsible Disclosure:** See [SECURITY.md](SECURITY.md) for vulnerability reporting guidelines.

---

## 📄 Legal & Documentation Links

- **Full User Manual:** [USER_GUIDE.md](USER_GUIDE.md)
- **End User License Agreement:** [EULA.md](EULA.md)
- **Security Policy:** [SECURITY.md](SECURITY.md)
- **Official Portal:** [https://hypkraft.webspiderstudios.com](https://hypkraft.webspiderstudios.com)

---

<div align="center">
  <p>© 2026 WebSpider Studios. All rights reserved.</p>
</div>
