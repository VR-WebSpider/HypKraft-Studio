import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
from backend.config import PROJECTS_DIR

router = APIRouter(prefix="/api/project", tags=["Projects"])

class ProjectSaveRequest(BaseModel):
    id: str
    name: str
    data: Dict[str, Any]

@router.post("/save")
async def save_project(req: ProjectSaveRequest):
    """Saves a project JSON file."""
    try:
        project_file = PROJECTS_DIR / f"{req.id}.json"
        project_data = {
            "id": req.id,
            "name": req.name,
            **req.data
        }
        with open(project_file, "w", encoding="utf-8") as f:
            json.dump(project_data, f, indent=2)
        return {"status": "saved", "id": req.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/load/{project_id}")
async def load_project(project_id: str):
    """Loads a project JSON file."""
    project_file = PROJECTS_DIR / f"{project_id}.json"
    if not project_file.exists():
        raise HTTPException(status_code=404, detail="Project not found")
    with open(project_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

@router.get("/list")
async def list_projects():
    """Lists saved projects."""
    projects = []
    for f in PROJECTS_DIR.glob("*.json"):
        try:
            with open(f, "r", encoding="utf-8") as pf:
                d = json.load(pf)
                projects.append({
                    "id": d.get("id", f.stem),
                    "name": d.get("name", f.stem),
                    "duration": d.get("duration", 0),
                    "aspectRatio": d.get("aspectRatio", "16:9")
                })
        except Exception:
            continue
    return projects
