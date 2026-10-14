import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent
STORAGE_DIR = BASE_DIR / "storage"
MEDIA_DIR = STORAGE_DIR / "media"
EXPORTS_DIR = STORAGE_DIR / "exports"
PROJECTS_DIR = STORAGE_DIR / "projects"

# Ensure directories exist
for folder in [MEDIA_DIR, EXPORTS_DIR, PROJECTS_DIR]:
    folder.mkdir(parents=True, exist_ok=True)

class AIProviderConfig(BaseModel):
    # Active default LLM reasoning provider: 'cloud-gemini', 'cloud-openai', 'cloud-anthropic', 'local-ollama', 'local-lmstudio'
    active_llm_provider: str = os.getenv("ACTIVE_LLM_PROVIDER", "cloud-gemini")
    
    # Active sound/music provider: 'cloud-elevenlabs', 'cloud-suno', 'local-audiocraft', 'local-bark', 'built-in-synth'
    active_sound_provider: str = os.getenv("ACTIVE_SOUND_PROVIDER", "built-in-synth")
    
    # Active video/image gen provider: 'cloud-replicate', 'cloud-openai', 'local-comfyui'
    active_visual_provider: str = os.getenv("ACTIVE_VISUAL_PROVIDER", "local-comfyui")
    
    # Cloud Keys
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    anthropic_api_key: str = os.getenv("ANTHROPIC_API_KEY", "")
    elevenlabs_api_key: str = os.getenv("ELEVENLABS_API_KEY", "")
    replicate_api_token: str = os.getenv("REPLICATE_API_TOKEN", "")
    
    # Local Service Endpoints
    ollama_url: str = os.getenv("OLLAMA_URL", "http://localhost:11434")
    lmstudio_url: str = os.getenv("LMSTUDIO_URL", "http://localhost:1234/v1")
    comfyui_url: str = os.getenv("COMFYUI_URL", "http://localhost:8188")
    audiocraft_url: str = os.getenv("AUDIOCRAFT_URL", "http://localhost:8001")
    whisper_url: str = os.getenv("WHISPER_URL", "http://localhost:9000")
    
    # HypKraft Access Token for direct MCP & API control (Set in .env for production)
    api_token: str = os.getenv("HYPKRAFT_API_TOKEN", "hypkraft-local-dev-token")

settings = AIProviderConfig()
