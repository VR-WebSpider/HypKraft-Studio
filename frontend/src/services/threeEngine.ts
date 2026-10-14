import * as THREE from 'three';
import { Clip } from '../types/timeline';

export class ThreeStudioEngine {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  
  // Post-processing
  private renderTarget: THREE.WebGLRenderTarget;
  private postScene: THREE.Scene;
  private postCamera: THREE.OrthographicCamera;
  private postMaterial: THREE.ShaderMaterial;
  private postQuad: THREE.Mesh;

  // Video texture background
  private videoMesh: THREE.Mesh | null = null;
  private videoTexture: THREE.VideoTexture | null = null;

  // Dynamic 3D graphics & particle groups
  private graphicsGroup: THREE.Group;
  private particlesGroup: THREE.Group;

  // Active particle system state
  private particlePoints: THREE.Points | null = null;
  private particlePositions: Float32Array | null = null;
  private particleVelocities: Float32Array | null = null;

  private animationFrameId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // 1. Setup WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Setup 3D Scene & Perspective Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    this.camera.position.z = 10;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    this.scene.add(dirLight);

    // Groups
    this.graphicsGroup = new THREE.Group();
    this.scene.add(this.graphicsGroup);

    this.particlesGroup = new THREE.Group();
    this.scene.add(this.particlesGroup);

    // 3. Post-Processing Setup with Custom Shaders
    this.renderTarget = new THREE.WebGLRenderTarget(canvas.clientWidth, canvas.clientHeight);
    this.postScene = new THREE.Scene();
    this.postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const postVertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const postFragmentShader = `
      uniform sampler2D tDiffuse;
      uniform float uTime;
      uniform float uRgbSplit;
      uniform float uVhsScanlines;
      uniform float uVhsNoise;
      uniform float uGlowBoost;
      uniform float uNoirContrast;
      varying vec2 vUv;

      float rand(vec2 co) {
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = vUv;

        // VHS horizontal jitter
        if (uVhsNoise > 0.0) {
          float jitter = (rand(vec2(uTime, uv.y)) - 0.5) * 0.015 * uVhsNoise;
          uv.x += jitter;
        }

        // Chromatic Aberration / RGB Split
        float split = uRgbSplit;
        vec4 rColor = texture2D(tDiffuse, uv + vec2(split, 0.0));
        vec4 gColor = texture2D(tDiffuse, uv);
        vec4 bColor = texture2D(tDiffuse, uv - vec2(split, 0.0));
        vec4 col = vec4(rColor.r, gColor.g, bColor.b, 1.0);

        // VHS Scanlines
        if (uVhsScanlines > 0.0) {
          float scan = sin(uv.y * 700.0) * 0.07 * uVhsScanlines;
          col.rgb -= scan;
        }

        // Cyber Glow / Bloom boost
        if (uGlowBoost > 0.0) {
          col.rgb = pow(col.rgb, vec3(1.0 / (1.0 + uGlowBoost * 0.4)));
          col.rgb += vec3(0.02, 0.04, 0.08) * uGlowBoost;
        }

        // Film Noir contrast
        if (uNoirContrast > 0.0) {
          float gray = dot(col.rgb, vec3(0.299, 0.587, 0.114));
          col.rgb = mix(col.rgb, vec3(gray), uNoirContrast);
          col.rgb = (col.rgb - 0.5) * (1.0 + uNoirContrast * 0.5) + 0.5;
        }

        gl_FragColor = col;
      }
    `;

    this.postMaterial = new THREE.ShaderMaterial({
      vertexShader: postVertexShader,
      fragmentShader: postFragmentShader,
      uniforms: {
        tDiffuse: { value: this.renderTarget.texture },
        uTime: { value: 0 },
        uRgbSplit: { value: 0.0 },
        uVhsScanlines: { value: 0.0 },
        uVhsNoise: { value: 0.0 },
        uGlowBoost: { value: 0.0 },
        uNoirContrast: { value: 0.0 }
      }
    });

    this.postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.postMaterial);
    this.postScene.add(this.postQuad);

    this.startLoop();
  }

  public resize(width: number, height: number) {
    if (width === 0 || height === 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.renderTarget.setSize(width, height);
  }

  public setVideoSource(videoElement: HTMLVideoElement | null) {
    if (this.videoMesh) {
      this.scene.remove(this.videoMesh);
      this.videoMesh.geometry.dispose();
      (this.videoMesh.material as THREE.Material).dispose();
      this.videoMesh = null;
    }
    if (this.videoTexture) {
      this.videoTexture.dispose();
      this.videoTexture = null;
    }

    if (videoElement) {
      this.videoTexture = new THREE.VideoTexture(videoElement);
      this.videoTexture.minFilter = THREE.LinearFilter;
      this.videoTexture.magFilter = THREE.LinearFilter;

      // Plane aspect 16:9
      const planeGeo = new THREE.PlaneGeometry(16, 9);
      const planeMat = new THREE.MeshBasicMaterial({
        map: this.videoTexture,
        depthWrite: false,
        depthTest: false
      });
      this.videoMesh = new THREE.Mesh(planeGeo, planeMat);
      this.videoMesh.position.z = -1; // behind 3D graphics
      this.scene.add(this.videoMesh);
    }
  }

  public updateActiveClips(clips: Clip[], currentTime: number) {
    // 1. Clear previous motion graphics meshes
    while (this.graphicsGroup.children.length > 0) {
      const child = this.graphicsGroup.children[0] as THREE.Mesh;
      this.graphicsGroup.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) (child.material as THREE.Material).dispose();
    }

    // 2. Clear shader uniforms by default
    this.postMaterial.uniforms.uRgbSplit.value = 0.0;
    this.postMaterial.uniforms.uVhsScanlines.value = 0.0;
    this.postMaterial.uniforms.uVhsNoise.value = 0.0;
    this.postMaterial.uniforms.uGlowBoost.value = 0.0;
    this.postMaterial.uniforms.uNoirContrast.value = 0.0;

    // Check active clips at currentTime
    let hasParticles = false;
    let particleType = 'sparks';

    for (const clip of clips) {
      const clipStart = clip.start;
      const clipEnd = clip.start + clip.duration;
      if (currentTime < clipStart || currentTime > clipEnd) continue;

      const progress = (currentTime - clipStart) / clip.duration;

      // Motion Graphics / 3D Title
      if (clip.type === 'motion_graphics' || clip.type === 'text') {
        const textMesh = this.createDynamicTextMesh(clip, progress);
        if (textMesh) {
          this.graphicsGroup.add(textMesh);
        }
      }

      // Particle FX
      if (clip.type === 'particle_fx') {
        hasParticles = true;
        particleType = clip.presetId || 'particles_sparks';
      }

      // Shader FX
      if (clip.type === 'shader_fx') {
        if (clip.shaderId === 'rgb_split') {
          this.postMaterial.uniforms.uRgbSplit.value = (clip.uniforms?.amount ?? 0.008) * (1.0 + Math.sin(currentTime * 8) * 0.4);
        } else if (clip.shaderId === 'vhs_glitch') {
          this.postMaterial.uniforms.uVhsScanlines.value = 1.0;
          this.postMaterial.uniforms.uVhsNoise.value = 1.0;
        } else if (clip.shaderId === 'cyber_bloom') {
          this.postMaterial.uniforms.uGlowBoost.value = 1.2;
        } else if (clip.shaderId === 'film_noir') {
          this.postMaterial.uniforms.uNoirContrast.value = 1.0;
        }
      }
    }

    // Update Particles
    if (hasParticles) {
      if (!this.particlePoints) {
        this.initParticleSystem(particleType);
      }
    } else {
      if (this.particlePoints) {
        this.destroyParticleSystem();
      }
    }
  }

  private createDynamicTextMesh(clip: Clip, progress: number): THREE.Mesh | null {
    const text = clip.text || 'CYBER TITLE';
    const color = clip.color || '#00ffcc';
    const glowColor = clip.glowColor || '#ff007f';
    const category = clip.category || '3d_title';

    // Canvas-based crisp typography texture
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (category === 'lower_third') {
      // Glassmorphic banner
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.roundRect(40, 60, 944, 136, 16);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = color;
      ctx.stroke();

      // Text inside
      ctx.font = 'bold 54px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, 80, 145);
    } else {
      // 3D Title with Neon Glow & Shadow
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 76px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      
      // Glow pass
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 25;
      ctx.fillStyle = color;
      ctx.fillText(text.toUpperCase(), 512, 128);

      // Core crisp text
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text.toUpperCase(), 512, 128);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });

    const geo = new THREE.PlaneGeometry(8, 2);
    const mesh = new THREE.Mesh(geo, mat);

    // Apply Transform & Animation
    const tx = clip.transform?.x ?? 0;
    const ty = clip.transform?.y ?? (category === 'lower_third' ? -2.5 : 0);
    const tz = clip.transform?.z ?? 0.5;
    const scale = (clip.transform?.scale ?? 1.0);

    // Dynamic animation entrance
    let animScale = 1.0;
    if (progress < 0.15) {
      // Smooth scale-in bounce
      animScale = (progress / 0.15);
    } else if (progress > 0.85) {
      // Smooth fade out
      mat.opacity = (1.0 - progress) / 0.15;
    }

    mesh.position.set(tx, ty, tz);
    mesh.scale.set(scale * animScale, scale * animScale, 1.0);
    mesh.rotation.z = (clip.transform?.rotation ?? 0) * (Math.PI / 180);

    return mesh;
  }

  private initParticleSystem(type: string) {
    const count = type.includes('matrix') ? 400 : 250;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;

      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = type.includes('matrix') ? -(0.05 + Math.random() * 0.08) : (0.02 + Math.random() * 0.05);
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.particlePositions = pos;
    this.particleVelocities = vel;

    const pColor = type.includes('matrix') ? 0x22c55e : (type.includes('stardust') ? 0xa855f7 : 0xffaa22);
    const mat = new THREE.PointsMaterial({
      size: 0.12,
      color: pColor,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particlePoints = new THREE.Points(geo, mat);
    this.particlesGroup.add(this.particlePoints);
  }

  private destroyParticleSystem() {
    if (this.particlePoints) {
      this.particlesGroup.remove(this.particlePoints);
      this.particlePoints.geometry.dispose();
      (this.particlePoints.material as THREE.Material).dispose();
      this.particlePoints = null;
      this.particlePositions = null;
      this.particleVelocities = null;
    }
  }

  private updateParticles() {
    if (!this.particlePoints || !this.particlePositions || !this.particleVelocities) return;
    const count = this.particlePositions.length / 3;

    for (let i = 0; i < count; i++) {
      this.particlePositions[i * 3] += this.particleVelocities[i * 3];
      this.particlePositions[i * 3 + 1] += this.particleVelocities[i * 3 + 1];
      this.particlePositions[i * 3 + 2] += this.particleVelocities[i * 3 + 2];

      // Respawn wrapping
      if (this.particlePositions[i * 3 + 1] > 5) {
        this.particlePositions[i * 3 + 1] = -5;
      } else if (this.particlePositions[i * 3 + 1] < -5) {
        this.particlePositions[i * 3 + 1] = 5;
      }
    }

    this.particlePoints.geometry.attributes.position.needsUpdate = true;
  }

  private startLoop = () => {
    const loop = (time: number) => {
      this.animationFrameId = requestAnimationFrame(loop);
      this.postMaterial.uniforms.uTime.value = time * 0.001;

      // Update particle physics
      this.updateParticles();

      // Render Scene to Render Target
      this.renderer.setRenderTarget(this.renderTarget);
      this.renderer.render(this.scene, this.camera);

      // Render Post-Processing Quad to Screen
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.postScene, this.postCamera);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  };

  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.destroyParticleSystem();
    this.renderer.dispose();
    this.renderTarget.dispose();
  }
}
