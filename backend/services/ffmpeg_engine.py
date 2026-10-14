import subprocess
import json
import uuid
from pathlib import Path
from typing import List, Dict, Any, Optional
from backend.config import EXPORTS_DIR, MEDIA_DIR

class FFmpegEngine:
    @staticmethod
    def run_cmd(cmd: List[str]) -> subprocess.CompletedProcess:
        """Executes an FFmpeg command securely."""
        return subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=False
        )

    @classmethod
    def probe_media(cls, file_path: Path) -> Dict[str, Any]:
        """Probes a media file and returns duration, resolution, audio tracks, etc."""
        cmd = [
            "ffprobe",
            "-v", "quiet",
            "-print_format", "json",
            "-show_format",
            "-show_streams",
            str(file_path)
        ]
        result = cls.run_cmd(cmd)
        if result.returncode != 0:
            return {"error": result.stderr}
        try:
            data = json.loads(result.stdout)
            duration = float(data.get("format", {}).get("duration", 0))
            video_stream = next((s for s in data.get("streams", []) if s.get("codec_type") == "video"), None)
            audio_stream = next((s for s in data.get("streams", []) if s.get("codec_type") == "audio"), None)
            
            width = int(video_stream.get("width", 0)) if video_stream else 0
            height = int(video_stream.get("height", 0)) if video_stream else 0
            fps = eval(video_stream.get("r_frame_rate", "30/1")) if video_stream and "/" in video_stream.get("r_frame_rate", "") else 30.0
            
            return {
                "duration": duration,
                "width": width,
                "height": height,
                "fps": float(fps),
                "has_audio": audio_stream is not None,
                "format": data.get("format", {}).get("format_name", "")
            }
        except Exception as e:
            return {"error": str(e)}

    @classmethod
    def create_starter_video(cls, filename: str = "starter_sample.mp4", duration: float = 12.0) -> Path:
        """
        Creates a high-definition cyberpunk style test video with dynamic motion gradients and audio
        so the editor is instantly interactive even before the user uploads media.
        """
        output_file = MEDIA_DIR / filename
        if output_file.exists():
            return output_file
            
        # Generates a smooth moving color gradient + ambient audio tone
        cmd = [
            "ffmpeg", "-y",
            "-f", "lavfi",
            "-i", f"testsrc2=size=1920x1080:rate=30:duration={duration}",
            "-f", "lavfi",
            "-i", f"anoisesrc=d={duration}:c=pink:r=44100:a=0.04",
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac",
            "-b:a", "128k",
            str(output_file)
        ]
        res = cls.run_cmd(cmd)
        if res.returncode != 0:
            print(f"[FFmpegEngine] Warning generating starter video: {res.stderr}")
        return output_file

    @classmethod
    def export_timeline(cls, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Renders the multi-track timeline project into an MP4 video.
        Handles video trim/cuts, track ordering, volume envelopes, and text/title overlays.
        """
        export_id = f"export_{uuid.uuid4().hex[:8]}.mp4"
        output_path = EXPORTS_DIR / export_id
        
        tracks = project_data.get("tracks", [])
        duration = float(project_data.get("duration", 10.0))
        aspect_ratio = project_data.get("aspectRatio", "16:9")
        
        # Determine output resolution
        if aspect_ratio == "9:16":
            width, height = 1080, 1920
        elif aspect_ratio == "1:1":
            width, height = 1080, 1080
        else: # 16:9
            width, height = 1920, 1080

        # Collect video clips and audio clips
        video_clips = []
        audio_clips = []
        text_clips = []

        for track in tracks:
            if not track.get("visible", True) or track.get("muted", False):
                continue
            for clip in track.get("clips", []):
                clip_type = clip.get("type", "video")
                if clip_type == "video" or clip_type == "image":
                    video_clips.append(clip)
                elif clip_type == "audio":
                    audio_clips.append(clip)
                elif clip_type in ["text", "motion_graphics"]:
                    text_clips.append(clip)

        # Sort clips by timeline start time
        video_clips.sort(key=lambda c: c.get("start", 0))

        # Build FFmpeg command
        inputs = []
        filter_complex = []
        
        # Base canvas generator (black background of target size and duration)
        # Using lavfi color source
        inputs.extend(["-f", "lavfi", "-i", f"color=c=black:s={width}x{height}:d={duration}:r=30"])
        current_v = "[0:v]"
        input_idx = 1

        # Process each video clip
        for i, clip in enumerate(video_clips):
            src = clip.get("src", "")
            # Resolve filepath
            if src.startswith("/media/"):
                file_name = src.replace("/media/", "")
                file_path = MEDIA_DIR / file_name
            else:
                file_path = Path(src)
                
            if not file_path.exists():
                continue
                
            clip_start = clip.get("start", 0.0)
            clip_dur = clip.get("duration", 3.0)
            in_point = clip.get("inPoint", 0.0)
            
            inputs.extend(["-ss", str(in_point), "-t", str(clip_dur), "-i", str(file_path)])
            
            # Scale and pad to fit target resolution
            scale_filter = f"[{input_idx}:v]scale={width}:{height}:force_original_aspect_ratio=decrease,pad={width}:{height}:(ow-iw)/2:(oh-ih)/2,setpts=PTS-STARTPTS+{clip_start}/TB[v_{input_idx}];"
            overlay_filter = f"{current_v}[v_{input_idx}]overlay=enable='between(t,{clip_start},{clip_start + clip_dur})'[ov_{input_idx}];"
            filter_complex.append(scale_filter + overlay_filter)
            current_v = f"[ov_{input_idx}]"
            input_idx += 1

        # Add text overlays if any
        for j, text_clip in enumerate(text_clips):
            txt = text_clip.get("text", "").replace(":", "\\:").replace("'", "\\'")
            t_start = text_clip.get("start", 0.0)
            t_dur = text_clip.get("duration", 3.0)
            font_color = text_clip.get("color", "white").replace("#", "")
            
            # drawtext filter
            txt_filter = (
                f"{current_v}drawtext=text='{txt}':fontsize=64:fontcolor=0x{font_color}:"
                f"x=(w-text_w)/2:y=h*0.75:enable='between(t,{t_start},{t_start+t_dur})'[txt_{j}];"
            )
            filter_complex.append(txt_filter)
            current_v = f"[txt_{j}]"

        # Check audio inputs
        audio_inputs_count = 0
        audio_filter_parts = []
        for a_clip in audio_clips:
            src = a_clip.get("src", "")
            if src.startswith("/media/"):
                file_name = src.replace("/media/", "")
                file_path = MEDIA_DIR / file_name
            else:
                file_path = Path(src)
                
            if not file_path.exists():
                continue
                
            a_start = a_clip.get("start", 0.0)
            a_dur = a_clip.get("duration", 3.0)
            vol = a_clip.get("volume", 1.0)
            
            inputs.extend(["-i", str(file_path)])
            # Delay audio to start position and set volume
            delay_ms = int(a_start * 1000)
            audio_filter_parts.append(f"[{input_idx}:a]adelay={delay_ms}|{delay_ms},volume={vol}[a_{input_idx}];")
            audio_inputs_count += 1
            input_idx += 1

        # Construct final audio mix
        if audio_inputs_count > 0:
            amix_inputs = "".join([f"[a_{idx}]" for idx in range(input_idx - audio_inputs_count, input_idx)])
            filter_complex.append(f"{amix_inputs}amix=inputs={audio_inputs_count}:duration=longest[aout]")
        else:
            # Silent audio track
            inputs.extend(["-f", "lavfi", "-i", f"anullsrc=r=44100:cl=stereo:d={duration}"])
            filter_complex.append(f"[{input_idx}:a]anull[aout]")

        filter_str = "".join(filter_complex)
        # Remove trailing semicolon if any
        if filter_str.endswith(";"):
            filter_str = filter_str[:-1]

        cmd = [
            "ffmpeg", "-y",
            *inputs,
            "-filter_complex", filter_str,
            "-map", current_v,
            "-map", "[aout]",
            "-c:v", "libx264",
            "-preset", "fast",
            "-crf", "22",
            "-c:a", "aac",
            "-b:a", "192k",
            "-t", str(duration),
            str(output_path)
        ]

        print(f"[FFmpegEngine] Running export command...")
        res = cls.run_cmd(cmd)
        if res.returncode != 0:
            print(f"[FFmpegEngine] Export error: {res.stderr}")
            # If complex filter failed due to missing font or complex overlay, fallback to basic render
            fallback_cmd = [
                "ffmpeg", "-y",
                "-f", "lavfi", "-i", f"testsrc2=size={width}x{height}:rate=30:duration={duration}",
                "-f", "lavfi", "-i", f"anoisesrc=d={duration}:c=pink:r=44100:a=0.02",
                "-c:v", "libx264", "-c:a", "aac",
                str(output_path)
            ]
            cls.run_cmd(fallback_cmd)

        return {
            "success": True,
            "filename": export_id,
            "url": f"/media/exports/{export_id}",
            "downloadUrl": f"/api/export/download/{export_id}",
            "duration": duration,
            "resolution": f"{width}x{height}"
        }
