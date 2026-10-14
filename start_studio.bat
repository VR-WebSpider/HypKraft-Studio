@echo off
title HypKraft AI Studio Launcher
echo ========================================================
echo       Launching HypKraft AI Video ^& Motion Studio
echo ========================================================
echo.
echo Starting FastAPI Backend & MCP Server on port 8000...
start "HypKraft Backend" cmd /k ".\venv\Scripts\activate && python -m uvicorn backend.main:app --port 8000 --host 127.0.0.1"

echo Starting Vite Frontend on port 5173...
start "HypKraft Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo HypKraft Studio UI: http://localhost:5173
echo MCP Server Endpoint: http://127.0.0.1:8000/api/mcp
echo API Documentation:   http://127.0.0.1:8000/docs
echo ========================================================
echo.
