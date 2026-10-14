from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict, Any
from backend.services.ffmpeg_engine import FFmpegEngine
from backend.config import EXPORTS_DIR

router = APIRouter(prefix="/api/export", tags=["Export & Rendering"])

class RenderRequest(BaseModel):
    project: Dict[str, Any]

@router.post("/render")
async def render_timeline(req: RenderRequest):
    """Triggers FFmpeg render pipeline for current timeline project."""
    try:
        result = FFmpegEngine.export_timeline(req.project)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")

@router.get("/download/{filename}")
async def download_exported_file(filename: str):
    """Serves the rendered export file as a download."""
    file_path = EXPORTS_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Export file not found")
    return FileResponse(
        path=str(file_path),
        filename=filename,
        media_type="video/mp4"
    )
