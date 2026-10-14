"""
Motion Graphics & FX Presets definitions.
Used by both the backend AI prompt interpreter and frontend Three.js / shader pipelines.
"""

MOTION_GRAPHICS_PRESETS = [
    {
        "id": "cyber_title_3d",
        "name": "Cyberpunk 3D Title",
        "category": "3d_title",
        "text": "NEON HORIZON",
        "fontStyle": "bold",
        "color": "#00ffcc",
        "glowColor": "#ff007f",
        "animation": "glitch_pulse",
        "extrudeDepth": 15,
        "material": "metallic",
        "description": "Futuristic 3D extruded title with chromatic edge glowing and pulse animation."
    },
    {
        "id": "hologram_text",
        "name": "Holographic Projection",
        "category": "3d_title",
        "text": "SYSTEM ONLINE",
        "fontStyle": "mono",
        "color": "#38bdf8",
        "glowColor": "#0284c7",
        "animation": "scanline_flicker",
        "extrudeDepth": 8,
        "material": "wireframe",
        "description": "3D sci-fi wireframe text with scanline flicker and ethereal particle halo."
    },
    {
        "id": "cinematic_bold",
        "name": "Cinematic Gold Trailer",
        "category": "3d_title",
        "text": "THE CHRONICLES",
        "fontStyle": "serif",
        "color": "#f59e0b",
        "glowColor": "#d97706",
        "animation": "slow_dolly_zoom",
        "extrudeDepth": 20,
        "material": "gold_reflective",
        "description": "Epic blockbuster 3D gold title with slow push-in camera movement."
    },
    {
        "id": "streamer_lower_third",
        "name": "Glassmorphism Lower Third",
        "category": "lower_third",
        "text": "Alex Vance | Creative Director",
        "color": "#ffffff",
        "backgroundColor": "rgba(15, 23, 42, 0.75)",
        "accentColor": "#6366f1",
        "animation": "slide_and_reveal",
        "description": "Modern frosted glass lower third banner with sleek gradient accent."
    },
    {
        "id": "breaking_news_bar",
        "name": "Breaking News Ticker",
        "category": "lower_third",
        "text": "BREAKING NEWS: AI Video Editor Launched",
        "color": "#ffffff",
        "backgroundColor": "#dc2626",
        "accentColor": "#facc15",
        "animation": "ticker_scroll",
        "description": "Dynamic high-urgency broadcast ticker with animated alert badge."
    },
    {
        "id": "particles_sparks",
        "name": "Golden Ember Sparks",
        "category": "particle_fx",
        "particleCount": 200,
        "color": "#ffaa22",
        "speed": 1.5,
        "behavior": "floating_upwards",
        "blendMode": "additive",
        "description": "Rising warm embers and sparks for epic or energetic scenes."
    },
    {
        "id": "particles_matrix",
        "name": "Digital Matrix Rain",
        "category": "particle_fx",
        "particleCount": 350,
        "color": "#22c55e",
        "speed": 2.2,
        "behavior": "falling_code",
        "blendMode": "screen",
        "description": "Cyberpunk digital stream particles falling vertically."
    },
    {
        "id": "particles_stardust",
        "name": "Cosmic Stardust Glow",
        "category": "particle_fx",
        "particleCount": 180,
        "color": "#a855f7",
        "speed": 0.8,
        "behavior": "swirling_orbit",
        "blendMode": "additive",
        "description": "Dreamy, gentle luminescent particles orbiting in 3D space."
    }
]

SHADER_FX_PRESETS = [
    {
        "id": "rgb_split",
        "name": "Chromatic Aberration / RGB Split",
        "type": "shader",
        "uniforms": {"amount": 0.008, "angle": 0.0},
        "description": "Splits red, green, and blue color channels for a cinematic lens or impact effect."
    },
    {
        "id": "vhs_glitch",
        "name": "Retro VHS Tape Glitch",
        "type": "shader",
        "uniforms": {"noiseIntensity": 0.15, "scanlines": 120.0, "jitter": 0.05},
        "description": "90s analog camcorder scanlines, tracking artifacts, and horizontal distortion."
    },
    {
        "id": "cyber_bloom",
        "name": "Neon Cyber Glow",
        "type": "shader",
        "uniforms": {"threshold": 0.6, "strength": 1.2, "radius": 0.8},
        "description": "High dynamic range bloom that makes highlights and neon titles glow intensely."
    },
    {
        "id": "film_noir",
        "name": "Film Noir Contrast & Grain",
        "type": "shader",
        "uniforms": {"contrast": 1.4, "grainAmount": 0.12, "vignette": 0.6},
        "description": "Dramatic black and white high-contrast film look with subtle vignette."
    },
    {
        "id": "vaporwave_lut",
        "name": "Vaporwave Pastel Tint",
        "type": "shader",
        "uniforms": {"tintCyan": 0.3, "tintMagenta": 0.4, "saturation": 1.25},
        "description": "80s synth aesthetic with electric cyan shadows and hot magenta highlights."
    }
]
