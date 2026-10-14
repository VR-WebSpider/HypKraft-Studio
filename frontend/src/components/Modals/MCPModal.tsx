import React, { useState } from 'react';
import {
  Zap,
  Copy,
  CheckCircle2,
  Terminal,
  Code2,
  ExternalLink,
  Play,
  KeyRound
} from 'lucide-react';

interface MCPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MCPModal: React.FC<MCPModalProps> = ({ isOpen, onClose }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  if (!isOpen) return null;

  const pythonPath = 'D:\\AI Video Editor\\venv\\Scripts\\python.exe';
  const mcpScriptPath = 'D:\\AI Video Editor\\backend\\services\\mcp_server.py';

  const cursorSnippet = JSON.stringify(
    {
      mcpServers: {
        hypkraft: {
          command: pythonPath,
          args: [mcpScriptPath]
        }
      }
    },
    null,
    2
  );

  const claudeSnippet = JSON.stringify(
    {
      mcpServers: {
        hypkraft: {
          command: pythonPath,
          args: [mcpScriptPath]
        }
      }
    },
    null,
    2
  );

  const apiToken = 'hypkraft_live_secret_key_2026';

  const antigravitySnippet = JSON.stringify(
    {
      mcpServers: {
        hypkraft: {
          command: pythonPath,
          args: [mcpScriptPath],
          env: {
            PYTHONIOENCODING: "utf-8",
            HYPKRAFT_API_TOKEN: apiToken
          }
        }
      }
    },
    null,
    2
  );

  const cliSnippet = `python hypkraft_cli.py prompt "Add 3D neon title saying CYBER REEL and bass drop"`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleTestMCP = async () => {
    try {
      setTesting(true);
      const res = await fetch('/api/mcp/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
        body: JSON.stringify({
          tool: 'hypkraft_execute_prompt',
          arguments: { prompt: 'Add 3D neon title saying LIVE MCP and whoosh sound' }
        })
      });
      const data = await res.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setTestResult(`Error: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  const toolsList = [
    {
      name: 'hypkraft_get_project_state',
      desc: 'Retrieves active timeline clips, tracks, playhead, and resolution.'
    },
    {
      name: 'hypkraft_execute_prompt',
      desc: 'Natural language video editing: adds 3D titles, splits clips, adds SFX.'
    },
    {
      name: 'hypkraft_add_clip',
      desc: 'Programmatically adds video, image, audio, 3D text, or FX clip to timeline.'
    },
    {
      name: 'hypkraft_generate_sound',
      desc: 'Generates custom sound effects & background audio via zero-latency synth or cloud AI.'
    },
    {
      name: 'hypkraft_generate_visual',
      desc: 'Generates video clip, 3D mesh, or background graphic via ComfyUI / synth.'
    },
    {
      name: 'hypkraft_render_export',
      desc: 'Renders the timeline into MP4 using hardware-accelerated FFmpeg.'
    },
    {
      name: 'hypkraft_list_models',
      desc: 'Lists available cloud and local AI models and their connection statuses.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="h-14 border-b border-slate-200 px-6 flex items-center justify-between bg-gradient-to-r from-violet-50 to-cyan-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-violet-500/20">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                HypKraft MCP & API Access Token
              </div>
              <div className="text-[11px] text-slate-500">
                Direct Agentic Control from Antigravity, Cursor, Claude, or Terminal
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm px-2 py-1 rounded-lg hover:bg-slate-200/60 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Live API Token Card */}
          <div className="p-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl shadow-md border border-indigo-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-bold flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                  <span>HypKraft API Access Token</span>
                </div>
                <div className="font-mono text-sm font-semibold text-cyan-300 mt-1">
                  {apiToken}
                </div>
              </div>
              <button
                onClick={() => handleCopy(apiToken, 'token')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition flex items-center gap-1.5 shadow"
              >
                {copiedType === 'token' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Token</span>
                  </>
                )}
              </button>
            </div>
            <div className="text-[11px] text-slate-300 mt-2.5 pt-2 border-t border-indigo-800/60 flex items-center gap-2">
              <span className="text-slate-400">Header:</span>
              <code className="text-cyan-200 bg-black/40 px-2 py-0.5 rounded text-[10px]">
                Authorization: Bearer {apiToken}
              </code>
            </div>
          </div>

          {/* Active Status Banner */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <div className="text-xs font-bold text-emerald-900">
                  Antigravity MCP Server Registered & Online
                </div>
                <div className="text-[11px] text-emerald-700">
                  Tool schemas live in <code className="font-mono text-[10px] bg-emerald-100 px-1 py-0.5 rounded">.gemini/antigravity/mcp/hypkraft</code>
                </div>
              </div>
            </div>

            <button
              onClick={handleTestMCP}
              disabled={testing}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <Play className="w-3 h-3 fill-white" />
              {testing ? 'Executing...' : 'Run Live Test'}
            </button>
          </div>

          {testResult && (
            <div className="p-3 bg-slate-900 text-cyan-300 font-mono text-[10px] rounded-xl overflow-x-auto max-h-36">
              <pre>{testResult}</pre>
            </div>
          )}

          {/* Direct CLI Command */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-violet-600" />
                <span>Direct Command Line (hypkraft_cli.py)</span>
              </div>
              <button
                onClick={() => handleCopy(cliSnippet, 'cli')}
                className="flex items-center gap-1 text-[11px] text-violet-600 hover:text-violet-800 font-medium"
              >
                {copiedType === 'cli' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Command</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 text-[11px] font-mono text-slate-800 overflow-x-auto">
              {cliSnippet}
            </pre>
          </div>

          {/* Quick Copy Snippets */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-violet-600" />
              <span>IDE & Agent JSON Configs</span>
            </div>

            {/* Antigravity Config */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <div className="px-3 py-2 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Antigravity & AGY IDE (~/.gemini/antigravity/mcp_config.json)</span>
                <button
                  onClick={() => handleCopy(antigravitySnippet, 'antigravity')}
                  className="flex items-center gap-1 text-[11px] text-violet-600 hover:text-violet-800 font-medium"
                >
                  {copiedType === 'antigravity' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 text-[11px] font-mono text-slate-800 overflow-x-auto">
                {antigravitySnippet}
              </pre>
            </div>

            {/* Cursor Config */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <div className="px-3 py-2 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Cursor IDE (~/.cursor/mcp.json)</span>
                <button
                  onClick={() => handleCopy(cursorSnippet, 'cursor')}
                  className="flex items-center gap-1 text-[11px] text-violet-600 hover:text-violet-800 font-medium"
                >
                  {copiedType === 'cursor' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 text-[11px] font-mono text-slate-800 overflow-x-auto">
                {cursorSnippet}
              </pre>
            </div>
          </div>

          {/* Exposed MCP Tools List */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-600" />
              <span>Registered Tools ({toolsList.length})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {toolsList.map((t) => (
                <div
                  key={t.name}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <div className="text-xs font-mono font-bold text-violet-700 truncate">
                    {t.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    {t.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-14 border-t border-slate-200 px-6 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow-md shadow-violet-500/20 transition active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
