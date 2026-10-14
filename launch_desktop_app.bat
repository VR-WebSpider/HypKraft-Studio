@echo off
title HypKraft AI Studio Desktop Launcher
echo ===================================================================
echo             Launching HypKraft Native Desktop Studio
echo ===================================================================
echo.
echo [1/2] Starting HypKraft FastAPI Backend & MCP Server on port 8000...
start /b "HypKraft Backend" cmd /c ".\venv\Scripts\activate && python -m uvicorn backend.main:app --port 8000 --host 127.0.0.1"

echo [2/2] Launching HypKraft Native Desktop App (Electron with Native Menus)...
cd frontend
call npx electron electron/main.cjs

echo.
echo HypKraft Native Desktop closed.
