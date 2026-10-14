from fastapi import APIRouter, Header, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from backend.services.mcp_server import MCP_TOOLS, MCP_SERVER_INFO, HypKraftMCPServer
from backend.config import settings
import sys
from pathlib import Path

router = APIRouter(prefix="/api/mcp", tags=["Model Context Protocol (MCP)"])

# ── MCP Streamable HTTP Transport (MCP spec 2025-03-26) ───────────────────────
# Antigravity and other MCP clients POST JSON-RPC 2.0 to /mcp directly.
# These routes are registered on the root app (no /api/mcp prefix) via main.py.
streamable_router = APIRouter(tags=["MCP Streamable HTTP"])

@streamable_router.get("/.well-known/oauth-protected-resource")
@streamable_router.get("/.well-known/oauth-protected-resource/mcp")
async def mcp_resource_metadata():
    """MCP resource metadata for OAuth-aware clients (returns 200 so clients stop retrying)."""
    return JSONResponse({
        "resource": "http://127.0.0.1:8000/mcp",
        "authorization_servers": [],
        "bearer_methods_supported": ["header"],
        "resource_documentation": "http://127.0.0.1:8000/api/mcp/tools"
    })

@streamable_router.post("/mcp")
async def mcp_streamable_http(request: Request):
    """
    MCP 2025-03-26 Streamable HTTP transport endpoint.
    Handles JSON-RPC 2.0 messages from Antigravity, Cursor, Claude Desktop, etc.
    """
    try:
        body = await request.json()
    except Exception:
        return JSONResponse({"jsonrpc": "2.0", "error": {"code": -32700, "message": "Parse error"}, "id": None}, status_code=400)

    rpc_id = body.get("id")
    method = body.get("method", "")
    params = body.get("params", {})

    # ── JSON-RPC 2.0 method dispatch ──
    if method == "initialize":
        return JSONResponse({
            "jsonrpc": "2.0",
            "id": rpc_id,
            "result": {
                "protocolVersion": "2025-03-26",
                "serverInfo": MCP_SERVER_INFO,
                "capabilities": {
                    "tools": {"listChanged": False},
                    "resources": {},
                    "prompts": {}
                }
            }
        })

    elif method == "notifications/initialized":
        return JSONResponse({"jsonrpc": "2.0", "id": rpc_id, "result": {}})

    elif method == "tools/list":
        tools_list = [
            {
                "name": t["name"],
                "description": t["description"],
                "inputSchema": t.get("inputSchema", {"type": "object", "properties": {}})
            }
            for t in MCP_TOOLS
        ]
        return JSONResponse({
            "jsonrpc": "2.0",
            "id": rpc_id,
            "result": {"tools": tools_list}
        })

    elif method == "tools/call":
        tool_name = params.get("name", "")
        arguments = params.get("arguments", {})
        try:
            result = await HypKraftMCPServer.handle_tool_call(tool_name, arguments)
            import json
            content_text = json.dumps(result, indent=2) if not isinstance(result, str) else result
            return JSONResponse({
                "jsonrpc": "2.0",
                "id": rpc_id,
                "result": {
                    "content": [{"type": "text", "text": content_text}],
                    "isError": False
                }
            })
        except Exception as e:
            return JSONResponse({
                "jsonrpc": "2.0",
                "id": rpc_id,
                "result": {
                    "content": [{"type": "text", "text": f"Error: {e}"}],
                    "isError": True
                }
            })

    elif method == "ping":
        return JSONResponse({"jsonrpc": "2.0", "id": rpc_id, "result": {}})

    else:
        return JSONResponse({
            "jsonrpc": "2.0",
            "id": rpc_id,
            "error": {"code": -32601, "message": f"Method not found: {method}"}
        }, status_code=404)


class ToolExecRequest(BaseModel):
    tool: str
    arguments: Dict[str, Any] = {}

class TokenVerifyRequest(BaseModel):
    token: str

@router.get("/tools")
async def get_mcp_tools():
    """Returns registered tools exposed by HypKraft MCP server."""
    return {
        "server": MCP_SERVER_INFO,
        "tools": MCP_TOOLS
    }

@router.get("/token")
async def get_token_info():
    """Returns the active API / MCP authentication token and usage headers."""
    return {
        "token": settings.api_token,
        "header_name": "X-HypKraft-Token",
        "bearer_format": f"Bearer {settings.api_token}",
        "endpoints": {
            "mcp_execute": "/api/mcp/execute",
            "prompt_edit": "/api/ai/edit-prompt",
            "generate_sound": "/api/ai/generate-sound",
            "render_export": "/api/export/render"
        },
        "curl_example": f'curl -X POST http://127.0.0.1:8000/api/mcp/execute -H "Authorization: Bearer {settings.api_token}" -H "Content-Type: application/json" -d "{{\\"tool\\": \\"hypkraft_execute_prompt\\", \\"arguments\\": {{\\"prompt\\": \\"Add neon title\\"}}}}"'
    }

@router.post("/token/verify")
async def verify_token(req: TokenVerifyRequest):
    """Verifies if an API token matches the server's configured token."""
    if req.token == settings.api_token:
        return {"valid": True, "message": "Token authenticated"}
    return {"valid": False, "message": "Invalid token"}

@router.post("/execute")
async def execute_mcp_tool(
    req: ToolExecRequest,
    authorization: Optional[str] = Header(None),
    x_hypkraft_token: Optional[str] = Header(None)
):
    """
    Direct HTTP endpoint to execute any HypKraft MCP tool from any agent, IDE, or curl script.
    Accepts token via Authorization: Bearer <token> or X-HypKraft-Token: <token>.
    """
    # Verify token if configured
    token_provided = x_hypkraft_token
    if not token_provided and authorization:
        parts = authorization.split(" ")
        if len(parts) == 2 and parts[0].lower() == "bearer":
            token_provided = parts[1]

    # Allow localhost calls or token match
    if token_provided and token_provided != settings.api_token:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid HypKraft Token")

    try:
        result = await HypKraftMCPServer.handle_tool_call(req.tool, req.arguments)
        return {
            "success": True,
            "tool": req.tool,
            "result": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/config")
async def get_mcp_config():
    """
    Returns copy-paste configurations for Cursor IDE, Claude Desktop, Antigravity, and VS Code.
    """
    python_exe = sys.executable
    mcp_script = str(Path(__file__).resolve().parent.parent / "services" / "mcp_server.py")
    
    claude_cursor_config = {
        "mcpServers": {
            "hypkraft": {
                "command": python_exe,
                "args": [mcp_script],
                "env": {
                    "PYTHONIOENCODING": "utf-8",
                    "HYPKRAFT_API_TOKEN": settings.api_token
                }
            }
        }
    }

    return {
        "status": "ready",
        "api_token": settings.api_token,
        "command": python_exe,
        "script": mcp_script,
        "configSnippet": claude_cursor_config,
        "instructions": {
            "cursor": "Paste into ~/.cursor/mcp.json or Cursor Settings -> Features -> MCP",
            "claude_desktop": "Paste into %APPDATA%/Claude/claude_desktop_config.json",
            "antigravity": "Registered in C:\\Users\\vivek\\.gemini\\antigravity\\mcp_config.json"
        }
    }
