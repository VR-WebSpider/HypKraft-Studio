# HypKraft Studio — Comprehensive User Guide & Manual

![HypKraft Studio](hypkraft_icon.png)

Welcome to the official manual for **HypKraft Studio** — an experimental Prompt-to-Timeline AI Video and 3D Motion Graphics Workstation. Built by WebSpider Studios.

---

## Table of Contents
1. [Overview & Zero-Prerequisites Architecture](#1-overview--zero-prerequisites-architecture)
2. [Installation & First Launch](#2-installation--first-launch)
3. [Understanding the Studio Interface](#3-understanding-the-studio-interface)
4. [Prompt-to-Timeline AI Orchestration](#4-prompt-to-timeline-ai-orchestration)
5. [3D Motion Graphics & Three.js WebGL](#5-3d-motion-graphics--threejs-webgl)
6. [Procedural Audio Synthesis](#6-procedural-audio-synthesis)
7. [Multi-Track Non-Linear Editing (NLE)](#7-multi-track-non-linear-editing-nle)
8. [Model Context Protocol (MCP) Integration](#8-model-context-protocol-mcp-integration)
9. [Keyboard Shortcuts Cheat Sheet](#9-keyboard-shortcuts-cheat-sheet)
10. [Exporting & Hardware Acceleration](#10-exporting--hardware-acceleration)
11. [Troubleshooting & FAQ](#11-troubleshooting--faq)

---

## 1. Overview & Zero-Prerequisites Architecture

Unlike traditional AI video generators that output disconnected, flat video snippets, HypKraft Studio is a complete **Non-Linear Editor (NLE)** capable of compositing:
- Multi-track video and image assets.
- Real-time 3D kinetic typography and extruded ribbon geometry using Three.js and WebGL 2.0.
- Procedural audio waveforms synthesized via Web Audio API.
- Hardware-accelerated GPU export pipeline.

### Zero Prerequisites Guarantee
HypKraft Studio requires **NO prerequisites** on your system:
- ❌ **No Python required**
- ❌ **No Node.js or npm required**
- ❌ **No external developer packages required**

The application is pre-bundled with an embedded V8 JavaScript engine, Chromium renderer, and native hardware codecs.

---

## 2. Installation & First Launch

### Step 1: Download Setup
Download `HypKraft-Studio-Setup-v1.0.0.exe` from the official portal at [https://hypkraft.webspiderstudios.com](https://hypkraft.webspiderstudios.com).

### Step 2: Accept the EULA
During installation, the Setup Wizard presents the **End User License Agreement (EULA)**:
- Review the license terms and check the mandatory agreement checkbox:  
  `[x] I have read and agree to the HypKraft End User License Agreement (EULA) and Terms of Service.`
- Without accepting this checkbox, installation cannot proceed.

### Step 3: Choose Destination & Install
Click **"Install"**. The wizard automatically configures:
- Standalone HypKraft executable.
- Desktop and Start Menu launcher shortcuts.
- Local storage database.

### Step 4: Launch HypKraft Studio
Double-click the **HypKraft Studio** desktop shortcut to launch immediately.

---

## 3. Understanding the Studio Interface

The HypKraft interface is divided into modular, resizable panels:

| Panel | Description |
|---|---|
| **Top Navigation Bar** | Project title selector, Save button, Native Menu (File, Edit, AI Models, MCP Server, Help). |
| **Left Sidebar** | Media library drawer, AI prompt creator, sound preset browser, and 3D motion graphic library. |
| **Center Viewport** | Real-time interactive 60 FPS WebGL canvas previewing multi-track video, extruded 3D titles, and post-fx. |
| **Bottom Timeline** | Multi-track timeline (Video 1, Video 2, 3D Graphics, Audio FX, Music) with playhead, zooming, and snapping. |
| **Right Inspector** | Clip transform settings, GLSL shader parameters, volume levels, and AI model parameters. |

---

## 4. Prompt-to-Timeline AI Orchestration

HypKraft translates natural language prompts into precise timeline edits, keyframes, and clips.

### How to Use:
1. Locate the **Create with AI** prompt bar on the left panel.
2. Select your generation category: `Video`, `Image`, `Audio`, `Motion Graphics`, or `FX`.
3. Type your creative vision in natural language.
4. Press `Enter` or click **"Generate"**.

### Prompt Examples:
- *"A futuristic cyberpunk city at dusk with neon flying cars, chromatic aberration, and a 3D kinetic title 'NEO TOKYO 2099' entering from the left."*
- *"Add an intense cinematic sub-bass impact at second 4 and transition into a space nebula sequence."*
- *"Split clip 1 at the playhead and insert an extruded holographic HUD overlay."*

---

## 5. 3D Motion Graphics & Three.js WebGL

HypKraft Studio features an internal Three.js engine executing real-time WebGL 2.0 shaders:

- **Extruded 3D Ribbons:** Kinetic title texts are tessellated into real 3D geometry with custom ambient lighting and reflections.
- **GLSL Post-Processing FX:** Bloom, scanlines, chromatic aberration, and motion blur are computed directly on your GPU.
- **Particle Systems:** Procedural dust, cosmic nebulas, and digital glitch grids customizable in the Inspector.

---

## 6. Procedural Audio Synthesis

Generate custom sound effects directly inside the studio using high-resolution procedural synthesis:

- **Sub-Bass Drops:** Heavy low-frequency cinematic drops with exponential decay.
- **Hologram Blips:** Crisp sine wave telemetry audio blips.
- **Glitch Impacts:** Dual-oscillator frequency modulations simulating cyber hits.
- **Spatial Tail:** Natural acoustic reverberation tailored to match timeline clip lengths.

---

## 7. Multi-Track Non-Linear Editing (NLE)

- **Timeline Tracks:** Manage multiple overlapping layers of video, 3D graphics, sound effects, and background scores.
- **Trimming & Snapping:** Drag clip boundaries to trim in-points and out-points with magnetic snapping.
- **Splitting:** Position the playhead at the desired second and press <kbd>Ctrl+K</kbd> to cleanly split the selected clip.
- **Aspect Ratios:** Switch dynamically between `16:9` (Cinematic Landscape), `9:16` (TikTok/Reels/Shorts), and `1:1` (Square).

---

## 8. Model Context Protocol (MCP) Integration

HypKraft Studio includes a native **Model Context Protocol (MCP)** server on `localhost:8000` allowing autonomous AI coding assistants (such as Claude Desktop, Cursor, or Antigravity) to control the editor.

### Configuration for Claude Desktop / Cursor:
Add this configuration snippet to your `claude_desktop_config.json`:
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

### Registered MCP Tools:
- `hypkraft_get_project_state`: Read current project tracks, clips, and duration.
- `hypkraft_execute_prompt`: Instruct the studio to generate or modify timeline clips.
- `hypkraft_add_clip`: Insert video, audio, or 3D graphics programmatically.
- `hypkraft_split_clip`: Split clips at a designated time.
- `hypkraft_render_export`: Trigger headless video export.

---

## 9. Keyboard Shortcuts Cheat Sheet

| Shortcut | Action |
|---|---|
| <kbd>Space</kbd> | Toggle Timeline Play / Pause |
| <kbd>Ctrl + N</kbd> | New Studio Project |
| <kbd>Ctrl + S</kbd> | Save Project to Local Storage |
| <kbd>Ctrl + E</kbd> | Open Video Export Dialog |
| <kbd>Ctrl + K</kbd> | Split Selected Clip at Playhead |
| <kbd>Del</kbd> | Delete Selected Clip |
| <kbd>Ctrl + Z</kbd> | Undo Last Timeline Action |
| <kbd>Ctrl + Y</kbd> | Redo Last Timeline Action |
| <kbd>Ctrl + M</kbd> | Open AI Model Selector Hub |

---

## 10. Exporting & Hardware Acceleration

- Click **"Export Video"** in the top navigation or press <kbd>Ctrl+E</kbd>.
- Select your target format: **MP4 (H.264 / NVENC GPU)**, **WebM (VP9)**, or **ProRes (Master Quality)**.
- Choose resolution: `1080p Full HD`, `1440p 2K`, or `2160p 4K UHD` at 60 FPS.
- Click **"Start Render"** to composite frames directly using GPU acceleration.

---

## 11. Troubleshooting & FAQ

**Q: Does HypKraft require an active internet connection?**  
A: No! The standalone engine, Three.js shaders, timeline editor, and procedural audio work 100% offline. An internet connection is only needed if you configure optional cloud models like OpenAI or Gemini.

**Q: Where are my project files stored?**  
A: Projects are stored locally in your browser/desktop application storage. No files are uploaded to external servers without your command.

**Q: How do I report issues or get support?**  
A: Visit [https://hypkraft.webspiderstudios.com](https://hypkraft.webspiderstudios.com) or join the official WebSpider Studios developer community.
