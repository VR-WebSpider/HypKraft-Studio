from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import uuid
from pathlib import Path
from backend.config import MEDIA_DIR
from backend.services.ffmpeg_engine import FFmpegEngine

router = APIRouter(prefix="/api/media", tags=["Media Assets"])

@router.post("/upload")
async def upload_media(file: UploadFile = File(...)):
    """Uploads user media (video, audio, image) and probes metadata."""
    ext = Path(file.filename).suffix.lower()
    if ext not in [".mp4", ".mov", ".mkv", ".webm", ".avi", ".mp3", ".wav", ".aac", ".ogg", ".png", ".jpg", ".jpeg", ".webp"]:
        raise HTTPException(status_code=400, detail="Unsupported media format")

    unique_filename = f"{uuid.uuid4().hex[:10]}_{file.filename}"
    save_path = MEDIA_DIR / unique_filename

    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    metadata = FFmpegEngine.probe_media(save_path)
    
    media_type = "video"
    if ext in [".mp3", ".wav", ".aac", ".ogg"]:
        media_type = "audio"
    elif ext in [".png", ".jpg", ".jpeg", ".webp"]:
        media_type = "image"

    return {
        "filename": unique_filename,
        "name": file.filename,
        "url": f"/media/{unique_filename}",
        "type": media_type,
        "metadata": metadata
    }

@router.get("/list")
async def list_media_assets():
    """Lists available media assets in storage."""
    assets = []
    for file in MEDIA_DIR.glob("*.*"):
        if file.name.startswith("."):
            continue
        ext = file.suffix.lower()
        mtype = "video"
        if ext in [".wav", ".mp3", ".aac", ".ogg"]:
            mtype = "audio"
        elif ext in [".png", ".jpg", ".jpeg"]:
            mtype = "image"

        assets.append({
            "filename": file.name,
            "name": file.name,
            "url": f"/media/{file.name}",
            "type": mtype,
            "size": file.stat().st_size
        })
    return assets

@router.get("/starter")
async def get_or_create_starter_media():
    """Ensures starter test media exists so the editor has ready-to-play clips immediately."""
    starter_path = FFmpegEngine.create_starter_video("sample_cyber_reel.mp4", duration=15.0)
    meta = FFmpegEngine.probe_media(starter_path)
    return {
        "filename": starter_path.name,
        "name": "Sample Cyber Reel",
        "url": f"/media/{starter_path.name}",
        "type": "video",
        "metadata": meta
    }
