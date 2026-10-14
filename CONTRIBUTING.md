# Contributing to HypKraft Studio

Thank you for your interest in contributing to **HypKraft Studio**!

## Core Engineering Principles

1. **Zero-Prerequisites for End Users:**
   Any features added must preserve the standalone experience. End users downloading HypKraft on Windows must never be forced to install Python, Node.js, or complex build dependencies.
2. **Security & Privacy First:**
   Never commit API keys, personal file paths, tokens, or private media. All cloud integration must remain opt-in and utilize environment variables or safe local storage.
3. **Hardware Acceleration:**
   Leverage WebGL 2.0 and Three.js shader pipelines for visual effects to ensure real-time 60 FPS playback.

## Development Workflow

1. Fork or branch from `main`:
   ```bash
   git checkout -b feature/my-feature
   ```
2. Run local development servers:
   ```bash
   cd frontend
   npm run dev
   ```
3. Test production packaging:
   ```bash
   npm run build
   ```
4. Submit a Pull Request following the provided template.
