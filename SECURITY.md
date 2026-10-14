# Security Policy & Responsible Disclosure

## Security Architecture

HypKraft Studio is engineered with security and privacy by design:
- **Local-First Execution:** Your projects, timeline tracks, and media footage remain strictly local to your machine.
- **Zero Hardcoded Secrets:** No API keys, credentials, or production tokens are hardcoded into the source code or released binaries.
- **Isolated MCP Endpoints:** The Model Context Protocol (MCP) server binds exclusively to local loopback interfaces (`localhost` / `127.0.0.1`), ensuring external networks cannot access your editing session without your authorization.
- **No Injected Telemetry:** HypKraft Studio does not harbor third-party user trackers or unauthorized data harvesting pipelines.

## Reporting a Vulnerability

If you discover a security vulnerability or security concern in HypKraft Studio, please do NOT file a public issue on GitHub.

Instead, please submit a responsible disclosure report directly to the security team:
- **Primary Security Contact:** `vivekanandrajbhar96@gmail.com`
- **Security Portal:** [https://hypkraft.webspiderstudios.com](https://hypkraft.webspiderstudios.com)

Please include:
1. Description of the vulnerability.
2. Steps to reproduce or proof-of-concept.
3. Potential impact on local user environments.

We appreciate the efforts of security researchers and will acknowledge legitimate findings promptly.
