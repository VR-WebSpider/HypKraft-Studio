import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.config import MEDIA_DIR, EXPORTS_DIR
from backend.routes.ai_routes import router as ai_router
from backend.routes.export_routes import router as export_router
from backend.routes.media_routes import router as media_router
from backend.routes.timeline_routes import router as timeline_router
from backend.routes.mcp_routes import router as mcp_router, streamable_router
from backend.services.ffmpeg_engine import FFmpegEngine

app = FastAPI(
    title="AI Video & Motion Graphics Studio API",
    description="Backend engine for AI-assisted video editing, 3D motion graphics, audio synthesis, and FFmpeg export",
    version="1.0.0"
)

# Enable CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static media directories
app.mount("/media/exports", StaticFiles(directory=str(EXPORTS_DIR)), name="exports")
app.mount("/media", StaticFiles(directory=str(MEDIA_DIR)), name="media")

# Include API Routers
app.include_router(ai_router)
app.include_router(export_router)
app.include_router(media_router)
app.include_router(timeline_router)
app.include_router(mcp_router)
app.include_router(streamable_router)  # MCP Streamable HTTP at /mcp

@app.on_event("startup")
async def startup_event():
    print("[Studio Backend] Initializing default media assets...")
    try:
        FFmpegEngine.create_starter_video("sample_cyber_reel.mp4", duration=15.0)
        print("[Studio Backend] Starter sample media ready.")
    except Exception as e:
        print(f"[Studio Backend] Warning during starter video creation: {e}")

@app.get("/health")
async def health_check():
    return {"status": "ok", "app": "AI Video & Motion Graphics Editor API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
