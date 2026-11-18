import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  MapPin,
  Sparkles,
  Sun,
  Moon,
  Sunset,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Eye,
  RotateCw,
  Move3d
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { NEW_HERO_HOUSE_IMAGE, SOCIAL_LINKS } from '../data/mockProperties';

interface HeroAnimatedHouseProps {
  lang: Language;
  heroImage?: string;
  mapsUrl?: string;
  onExploreUnits?: () => void;
}

// Native dimensions of the uploaded vertical architectural photo (736x970)
const IMAGE_ASPECT = 736 / 970;
const PLANE_HEIGHT = 10.0;
const PLANE_WIDTH = PLANE_HEIGHT * IMAGE_ASPECT;

const BACKDROP_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Seamless sunlit blurred ambient backdrop extension — eliminates all black sidebars/gaps completely
const BACKDROP_FRAGMENT_SHADER = `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uAnimate;
  uniform float uMood;
  uniform vec2 uScaleUv;
  varying vec2 vUv;

  void main() {
    // Cover-mapped UV into the uploaded photo so sky/trees/street extend smoothly edge-to-edge
    vec2 centered = (vUv - 0.5) * uScaleUv + 0.5;
    vec2 clampedUv = clamp(centered, 0.005, 0.995);

    // Smooth 9-tap soft bokeh blur so background feels naturally out-of-focus behind the sharp 3D building
    vec2 r = vec2(0.018, 0.022);
    vec3 sum = texture2D(uMap, clampedUv).rgb * 0.24;
    sum += texture2D(uMap, clamp(clampedUv + vec2( r.x,  0.0), 0.005, 0.995)).rgb * 0.12;
    sum += texture2D(uMap, clamp(clampedUv + vec2(-r.x,  0.0), 0.005, 0.995)).rgb * 0.12;
    sum += texture2D(uMap, clamp(clampedUv + vec2( 0.0,  r.y), 0.005, 0.995)).rgb * 0.12;
    sum += texture2D(uMap, clamp(clampedUv + vec2( 0.0, -r.y), 0.005, 0.995)).rgb * 0.12;
    sum += texture2D(uMap, clamp(clampedUv + vec2( r.x,  r.y), 0.005, 0.995)).rgb * 0.07;
    sum += texture2D(uMap, clamp(clampedUv + vec2(-r.x,  r.y), 0.005, 0.995)).rgb * 0.07;
    sum += texture2D(uMap, clamp(clampedUv + vec2( r.x, -r.y), 0.005, 0.995)).rgb * 0.07;
    sum += texture2D(uMap, clamp(clampedUv + vec2(-r.x, -r.y), 0.005, 0.995)).rgb * 0.07;

    float wGolden = 1.0 - smoothstep(0.0, 1.0, abs(uMood - 0.0));
    float wDay = 1.0 - smoothstep(0.0, 1.0, abs(uMood - 1.0));
    float wTwilight = 1.0 - smoothstep(0.0, 1.0, abs(uMood - 2.0));

    vec3 golden = sum * vec3(1.01, 0.97, 0.91);
    vec3 day = sum * vec3(1.04, 1.05, 1.09);
    vec3 twilight = sum * vec3(0.55, 0.62, 0.85);

    vec3 col = golden * wGolden + day * wDay + twilight * wTwilight;

    // Gentle sunlit atmospheric breath
    col *= 0.94 + 0.02 * sin(uTime * 0.8) * uAnimate;

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

const VERTEX_SHADER = `
  uniform float uTime;
  uniform float uAnimate;
  uniform float uHoverDepth;
  uniform sampler2D uMap;

  varying vec2 vUv;
  varying float vFoliageMask;
  varying float vSkyMask;

  // Analytic 3D architectural depth map tailored to the 4-story curved concrete & greenery building
  float computeArchitecturalDepth(vec2 uv) {
    // 1. Bright open sky far behind the roofline
    float roofLineY = mix(0.76, 0.86, smoothstep(0.15, 0.60, uv.x));
    float skyMask = smoothstep(roofLineY - 0.05, roofLineY + 0.08, uv.y)
                  * (1.0 - smoothstep(0.46, 0.64, uv.x) * (1.0 - smoothstep(0.82, 0.92, uv.y)));

    // 2. Main multi-story architectural building block (x: 0.07..0.95, y: 0.12..0.85)
    float bldgX = smoothstep(0.05, 0.10, uv.x) * (1.0 - smoothstep(0.90, 0.96, uv.x));
    float bldgY = smoothstep(0.10, 0.15, uv.y) * (1.0 - smoothstep(0.80, 0.88, uv.y));
    float bldgMass = bldgX * bldgY;

    // 3. Protruding curved horizontal concrete terrace slabs (roof, 3rd floor, 2nd floor, ground canopy)
    float slab4 = smoothstep(0.16, 0.22, uv.x) * (1.0 - smoothstep(0.84, 0.92, uv.x))
                * smoothstep(0.68, 0.72, uv.y) * (1.0 - smoothstep(0.77, 0.81, uv.y));
    float slab3 = smoothstep(0.07, 0.12, uv.x) * (1.0 - smoothstep(0.90, 0.95, uv.x))
                * smoothstep(0.45, 0.49, uv.y) * (1.0 - smoothstep(0.53, 0.57, uv.y));
    float slab2 = smoothstep(0.07, 0.12, uv.x) * (1.0 - smoothstep(0.90, 0.95, uv.x))
                * smoothstep(0.24, 0.28, uv.y) * (1.0 - smoothstep(0.32, 0.36, uv.y));

    // Corner perspective projection: building corner near x=0.58 projects closest toward camera
    float cornerCurve = exp(-pow((uv.x - 0.56) / 0.34, 2.0)) * bldgMass;

    // 4. Right foreground lush tree & street slope
    float rightTree = smoothstep(0.72, 0.84, uv.x) * smoothstep(0.08, 0.22, uv.y) * (1.0 - smoothstep(0.56, 0.66, uv.y));
    float streetSlope = (1.0 - smoothstep(0.08, 0.15, uv.y)) * pow(clamp((0.15 - uv.y) / 0.15, 0.0, 1.0), 1.15);

    float depth = -1.10 * skyMask;
    depth += bldgMass * 0.45;
    depth += cornerCurve * 0.52;
    depth += (slab4 + slab3 + slab2) * 0.28;
    depth += rightTree * 0.58;
    depth += streetSlope * 0.95;

    return depth;
  }

  void main() {
    vUv = uv;

    vec4 tex = texture2D(uMap, uv);
    float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));

    float baseDepth = computeArchitecturalDepth(uv);

    // Foliage zones: top-left overhanging leaves, rooftop plants, balcony ivy planters, and right tree canopy
    float topLeftLeaves = (1.0 - smoothstep(0.10, 0.22, uv.x)) * smoothstep(0.68, 0.82, uv.y);
    float roofPlants = smoothstep(0.22, 0.35, uv.x) * (1.0 - smoothstep(0.68, 0.80, uv.x)) * smoothstep(0.78, 0.88, uv.y);
    float balconyPlants = smoothstep(0.10, 0.18, uv.x) * (1.0 - smoothstep(0.66, 0.74, uv.x))
                        * (smoothstep(0.30, 0.35, uv.y) * (1.0 - smoothstep(0.41, 0.46, uv.y))
                        +  smoothstep(0.46, 0.51, uv.y) * (1.0 - smoothstep(0.56, 0.61, uv.y)));
    float rightTreeCanopy = smoothstep(0.72, 0.82, uv.x) * smoothstep(0.08, 0.18, uv.y) * (1.0 - smoothstep(0.58, 0.67, uv.y));
    vFoliageMask = clamp(topLeftLeaves + roofPlants + balconyPlants + rightTreeCanopy, 0.0, 1.0);

    float skyArea = smoothstep(0.74, 0.88, uv.y) * (1.0 - smoothstep(0.18, 0.30, uv.x) * (1.0 - smoothstep(0.76, 0.86, uv.x)));
    vSkyMask = clamp(skyArea, 0.0, 1.0);

    // Keep perimeter edge locked cleanly
    float edgeLockX = smoothstep(0.0, 0.03, uv.x) * (1.0 - smoothstep(0.97, 1.0, uv.x));
    float edgeLockY = smoothstep(0.0, 0.025, uv.y) * (1.0 - smoothstep(0.975, 1.0, uv.y));
    float edgeLock = edgeLockX * edgeLockY;

    float windWave = sin(uTime * 1.45 + uv.x * 11.0 + uv.y * 9.0) * 0.035
                   + cos(uTime * 2.1 + uv.x * 16.0) * 0.015;

    vec3 displaced = position;
    displaced.z += (baseDepth + lum * 0.15) * uHoverDepth * edgeLock;
    displaced.x += windWave * vFoliageMask * uAnimate * edgeLock;
    displaced.y += windWave * 0.45 * vFoliageMask * uAnimate * edgeLock;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uAnimate;
  uniform float uMood; // 0.0 = golden, 1.0 = daylight, 2.0 = twilight
  uniform vec2 uPointer;

  varying vec2 vUv;
  varying float vFoliageMask;
  varying float vSkyMask;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    // Organic breeze shimmer strictly on leaves & hanging planters
    vec2 animatedUv = vUv;
    float breeze = sin(uTime * 1.65 + vUv.y * 26.0 + vUv.x * 18.0) * 0.0012 * uAnimate * vFoliageMask;
    animatedUv.x += breeze;
    animatedUv.y += breeze * 0.4;
    animatedUv = clamp(animatedUv, 0.001, 0.999);

    vec4 tex = texture2D(uMap, animatedUv);
    vec3 color = tex.rgb;

    // Warm interior lobby lights & architectural recessed strip LEDs
    float warmthScore = smoothstep(0.05, 0.26, color.r - color.b * 0.75) * smoothstep(0.22, 0.68, color.r);
    float bldgInterior = smoothstep(0.16, 0.24, vUv.x) * (1.0 - smoothstep(0.84, 0.90, vUv.x))
                       * smoothstep(0.11, 0.16, vUv.y) * (1.0 - smoothstep(0.70, 0.78, vUv.y));
    float windowGlowMask = clamp(warmthScore * bldgInterior, 0.0, 1.0);

    float lightPulse = 1.0 + (0.06 * sin(uTime * 1.8 + vUv.x * 10.0) + 0.03 * cos(uTime * 2.9 + vUv.y * 14.0)) * uAnimate;

    // Subtle sky atmosphere drift
    float cloudPattern = vnoise(vec2(vUv.x * 4.0 + uTime * 0.025 * uAnimate, vUv.y * 3.0)) * 0.6
                       + vnoise(vec2(vUv.x * 8.0 - uTime * 0.015 * uAnimate, vUv.y * 5.0)) * 0.4;
    float skyFactor = vSkyMask;

    // Mood weights: 0 = golden, 1 = daylight, 2 = twilight
    float wGolden = 1.0 - smoothstep(0.0, 1.0, abs(uMood - 0.0));
    float wDay = 1.0 - smoothstep(0.0, 1.0, abs(uMood - 1.0));
    float wTwilight = 1.0 - smoothstep(0.0, 1.0, abs(uMood - 2.0));

    // Golden Hour: natural golden sunlit warmth
    vec3 goldenColor = color * vec3(1.03, 0.99, 0.93);
    goldenColor += vec3(0.05, 0.03, 0.005) * skyFactor * cloudPattern;
    goldenColor += color * vec3(0.18, 0.12, 0.03) * windowGlowMask * lightPulse;

    // Daylight: bright crisp modern concrete & vibrant sky
    vec3 dayColor = color * vec3(1.06, 1.08, 1.13);
    dayColor += vec3(0.04, 0.09, 0.16) * skyFactor * cloudPattern;

    // Twilight Night: sleek dusk transformation while interior windows glow warmly
    vec3 twilightColor = mix(color * vec3(0.56, 0.64, 0.92), color * 1.08, windowGlowMask);
    twilightColor = mix(twilightColor, twilightColor * vec3(0.45, 0.54, 0.85), skyFactor * 0.65);
    twilightColor += vec3(0.42, 0.25, 0.08) * windowGlowMask * lightPulse;

    color = goldenColor * wGolden + dayColor * wDay + twilightColor * wTwilight;

    // Reactive glass sheen across the curtain-wall glass as cursor moves
    float glintDist = distance(vUv, vec2(0.5 + uPointer.x * 0.25, 0.48 + uPointer.y * 0.16));
    float glassSpec = exp(-glintDist * 6.5) * bldgInterior * 0.09;
    color += vec3(1.0, 0.94, 0.80) * glassSpec * (wGolden + wDay * 0.9 + wTwilight * 0.35);

    // Soft edge feather ONLY on extreme outer border so building blends seamlessly into the matching sunlit backdrop with zero black seams or gaps
    float edgeFeather = smoothstep(0.0, 0.035, vUv.x) * (1.0 - smoothstep(0.965, 1.0, vUv.x))
                      * smoothstep(0.0, 0.025, vUv.y) * (1.0 - smoothstep(0.975, 1.0, vUv.y));

    gl_FragColor = vec4(color, edgeFeather);
    #include <colorspace_fragment>
  }
`;

const PARTICLE_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uAnimate;
  uniform float uPixelRatio;

  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;

  varying float vAlpha;

  void main() {
    vec3 pos = position;
    float t = uTime * aSpeed * uAnimate;
    pos.x += sin(t + aPhase) * 0.45;
    pos.y += cos(t * 0.85 + aPhase * 1.7) * 0.25 + mod(t * 0.08, 1.4) - 0.7;
    pos.z += sin(t * 0.6 + aPhase * 2.3) * 0.20;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * uPixelRatio * (18.0 / max(-mvPosition.z, 1.0));

    vAlpha = 0.45 + 0.55 * sin(uTime * 1.9 + aPhase * 3.1);
  }
`;

const PARTICLE_FRAGMENT_SHADER = `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float glow = pow(1.0 - dist * 2.0, 2.2);
    gl_FragColor = vec4(uColor, glow * vAlpha * 0.78);
    #include <colorspace_fragment>
  }
`;

export const HeroAnimatedHouse: React.FC<HeroAnimatedHouseProps> = ({
  lang,
  heroImage,
  mapsUrl,
  onExploreUnits
}) => {
  const t = translations[lang].controls3D;
  const [lightingMood, setLightingMood] = useState<'golden' | 'daylight' | 'twilight'>('golden');
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);
  const [isSceneReady, setIsSceneReady] = useState<boolean>(false);
  const [fittedBox, setFittedBox] = useState<{ width: number; height: number } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const moodRef = useRef<'golden' | 'daylight' | 'twilight'>('golden');
  const isAnimatingRef = useRef<boolean>(true);
  const pointerTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const dragOriginRef = useRef<{ x: number; y: number; px: number; py: number }>({
    x: 0,
    y: 0,
    px: 0,
    py: 0
  });

  useEffect(() => {
    moodRef.current = lightingMood;
  }, [lightingMood]);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  const resolvedHeroImage = heroImage || SOCIAL_LINKS.heroHouseImage || NEW_HERO_HOUSE_IMAGE;
  const resolvedMapsUrl = mapsUrl || SOCIAL_LINKS.mapsUrl;

  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    let isDisposed = false;
    let frameId = 0;

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas');
        const gl = probe.getContext('webgl2') || probe.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) || '');
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: false,
        powerPreference: 'high-performance'
      });
    } catch {
      return;
    }

    const pixelRatio = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0xdad4cb, 1);

    const width = mount.clientWidth || 1280;
    const height = mount.clientHeight || 720;
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    const lookAtTarget = new THREE.Vector3(0, 0, 0.15);

    const fallbackTex = new THREE.DataTexture(new Uint8Array([218, 212, 203, 255]), 1, 1);
    fallbackTex.colorSpace = THREE.SRGBColorSpace;
    fallbackTex.needsUpdate = true;

    // 1. Seamless Full-Viewport Sunlit Backdrop Plane (zero black spaces on any aspect ratio!)
    const backdropGeo = new THREE.PlaneGeometry(1, 1, 1, 1);
    const backdropUniforms = {
      uMap: { value: fallbackTex as THREE.Texture },
      uTime: { value: 0 },
      uAnimate: { value: 1 },
      uMood: { value: 0 },
      uScaleUv: { value: new THREE.Vector2(1, 1) }
    };
    const backdropMat = new THREE.ShaderMaterial({
      uniforms: backdropUniforms,
      vertexShader: BACKDROP_VERTEX_SHADER,
      fragmentShader: BACKDROP_FRAGMENT_SHADER,
      depthWrite: false
    });
    const backdropMesh = new THREE.Mesh(backdropGeo, backdropMat);
    backdropMesh.position.z = -3.0;
    scene.add(backdropMesh);

    // 2. Main Sharp Uncropped 3D Architectural Relief Plane (736x970 exact aspect)
    const planeGeo = new THREE.PlaneGeometry(
      PLANE_WIDTH,
      PLANE_HEIGHT,
      isSoftwareGl ? 64 : 128,
      isSoftwareGl ? 84 : 168
    );

    const houseUniforms = {
      uTime: { value: 0 },
      uAnimate: { value: 1 },
      uHoverDepth: { value: 1.0 },
      uMood: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uMap: { value: fallbackTex as THREE.Texture }
    };

    const houseMat = new THREE.ShaderMaterial({
      uniforms: houseUniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true
    });

    const houseMesh = new THREE.Mesh(planeGeo, houseMat);
    scene.add(houseMesh);

    // 3D Floating Architectural Sunlit Motes across the viewport
    const particleCount = 60;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18.0;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10.0;
      positions[i * 3 + 2] = 0.8 + Math.random() * 2.2;
      sizes[i] = 4.0 + Math.random() * 8.0;
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.35 + Math.random() * 0.55;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    particleGeo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    particleGeo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));

    const particleUniforms = {
      uTime: { value: 0 },
      uAnimate: { value: 1 },
      uPixelRatio: { value: pixelRatio },
      uColor: { value: new THREE.Color(0xfbbf24) }
    };

    const particleMat = new THREE.ShaderMaterial({
      uniforms: particleUniforms,
      vertexShader: PARTICLE_VERTEX_SHADER,
      fragmentShader: PARTICLE_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let loadedTex: THREE.Texture | null = null;
    const loader = new THREE.TextureLoader();
    loader.load(
      resolvedHeroImage,
      (tex) => {
        if (isDisposed) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        loadedTex = tex;
        houseUniforms.uMap.value = tex;
        backdropUniforms.uMap.value = tex;
        fallbackTex.dispose();
        setIsSceneReady(true);
      },
      undefined,
      () => {
        setIsSceneReady(true);
      }
    );

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let baseCameraZ = 16;
    const updateCameraContainFit = (w: number, h: number) => {
      const safeW = Math.max(w, 1);
      const safeH = Math.max(h, 1);
      const aspect = safeW / safeH;
      camera.aspect = aspect;
      camera.fov = 36;
      camera.updateProjectionMatrix();

      const halfFovRad = THREE.MathUtils.degToRad(camera.fov * 0.5);
      const tanHalf = Math.tan(halfFovRad);

      const reqZHeight = (PLANE_HEIGHT * 0.5) / tanHalf;
      const reqZWidth = (PLANE_WIDTH * 0.5) / (tanHalf * aspect);
      baseCameraZ = Math.max(reqZHeight, reqZWidth);

      // Scale backdrop plane cleanly so it ALWAYS covers 100% of the camera frustum at z = -3.0 (even while orbiting)
      const backdropDist = baseCameraZ - backdropMesh.position.z;
      const backdropH = 2 * backdropDist * tanHalf * 1.25;
      const backdropW = backdropH * aspect;
      backdropMesh.scale.set(backdropW, backdropH, 1);

      // Cover UV ratio for backdrop shader so it matches sky top -> trees sides -> street bottom seamlessly
      const viewAspect = backdropW / backdropH;
      if (viewAspect > IMAGE_ASPECT) {
        backdropUniforms.uScaleUv.value.set(1.0, IMAGE_ASPECT / viewAspect);
      } else {
        backdropUniforms.uScaleUv.value.set(viewAspect / IMAGE_ASPECT, 1.0);
      }

      renderer.setSize(safeW, safeH);

      if (aspect >= IMAGE_ASPECT) {
        setFittedBox({ width: safeH * IMAGE_ASPECT, height: safeH });
      } else {
        setFittedBox({ width: safeW, height: safeW / IMAGE_ASPECT });
      }
    };
    updateCameraContainFit(width, height);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) updateCameraContainFit(w, h);
      }
    });
    resizeObserver.observe(mount);

    const clock = new THREE.Clock();
    let smoothPointerX = 0;
    let smoothPointerY = 0;
    let smoothAnimate = 1;
    let smoothMood = 0;
    let orbitClock = 0;
    const goldColor = new THREE.Color(0xfbbf24);
    const dayColor = new THREE.Color(0xfef3c7);
    const twilightColor = new THREE.Color(0xf59e0b);
    const targetParticleColor = new THREE.Color();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const poll = () => {
        if (isDisposed) {
          gl.deleteSync(sync);
          return;
        }
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (isDisposed) return;

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      const animateTarget = isAnimatingRef.current ? 1 : 0;
      smoothAnimate = THREE.MathUtils.damp(smoothAnimate, animateTarget, 4.0, delta);
      orbitClock += delta * smoothAnimate;

      const moodVal = moodRef.current === 'golden' ? 0 : moodRef.current === 'daylight' ? 1 : 2;
      smoothMood = THREE.MathUtils.damp(smoothMood, moodVal, 4.5, delta);

      smoothPointerX = THREE.MathUtils.damp(smoothPointerX, pointerTargetRef.current.x, 5.0, delta);
      smoothPointerY = THREE.MathUtils.damp(smoothPointerY, pointerTargetRef.current.y, 5.0, delta);

      const autoOrbitX = Math.sin(orbitClock * 0.45) * 0.65 * smoothAnimate;
      const autoOrbitY = Math.cos(orbitClock * 0.32) * 0.24 * smoothAnimate;

      const camX = autoOrbitX + smoothPointerX * 1.05;
      const camY = autoOrbitY - smoothPointerY * 0.50;
      const camZ = baseCameraZ;

      camera.position.set(camX, camY, camZ);
      camera.lookAt(lookAtTarget);

      houseUniforms.uTime.value = elapsed;
      houseUniforms.uAnimate.value = smoothAnimate;
      houseUniforms.uMood.value = smoothMood;
      houseUniforms.uPointer.value.set(smoothPointerX, smoothPointerY);

      backdropUniforms.uTime.value = elapsed;
      backdropUniforms.uAnimate.value = smoothAnimate;
      backdropUniforms.uMood.value = smoothMood;

      particleUniforms.uTime.value = elapsed;
      particleUniforms.uAnimate.value = smoothAnimate;

      if (smoothMood <= 1.0) {
        targetParticleColor.copy(goldColor).lerp(dayColor, smoothMood);
      } else {
        targetParticleColor.copy(dayColor).lerp(twilightColor, smoothMood - 1.0);
      }
      particleUniforms.uColor.value.copy(targetParticleColor);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      backdropGeo.dispose();
      backdropMat.dispose();
      planeGeo.dispose();
      houseMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      fallbackTex.dispose();
      if (loadedTex) loadedTex.dispose();
      renderer.dispose();
    };
  }, [resolvedHeroImage]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    if (isDraggingRef.current) {
      const dx = (e.clientX - dragOriginRef.current.x) / rect.width;
      const dy = (e.clientY - dragOriginRef.current.y) / rect.height;
      pointerTargetRef.current = {
        x: THREE.MathUtils.clamp(dragOriginRef.current.px - dx * 2.2, -1, 1),
        y: THREE.MathUtils.clamp(dragOriginRef.current.py - dy * 2.2, -1, 1)
      };
    } else {
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointerTargetRef.current = {
        x: THREE.MathUtils.clamp(nx * 0.78, -1, 1),
        y: THREE.MathUtils.clamp(ny * 0.78, -1, 1)
      };
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    dragOriginRef.current = {
      x: e.clientX,
      y: e.clientY,
      px: pointerTargetRef.current.x,
      py: pointerTargetRef.current.y
    };
  };

  const handlePointerUpOrLeave = () => {
    isDraggingRef.current = false;
    pointerTargetRef.current = { x: 0, y: 0 };
  };

  const hotspots = [
    {
      id: 1,
      x: '42%',
      y: '23%',
      titleAr: 'حديقة الروف والسقف المنحني',
      titleEn: 'Curved Roof Terrace & Sky Garden',
      descAr: 'تراس علوي بسور زجاجي وحديقة نباتات طبيعية تمنح إطلالة مفتوحة رائعة.',
      descEn: 'Rooftop sky lounge with frameless glass balustrade and natural greenery.'
    },
    {
      id: 2,
      x: '32%',
      y: '44%',
      titleAr: 'الشرفات الخرسانية والنباتات المعلقة',
      titleEn: 'Curved Concrete & Hanging Greenery',
      descAr: 'تصميم خرساني عصري بخطوط منحنية وأحواض زهور متدلية تعزز الطابع الحيوي.',
      descEn: 'Architectural raw-concrete slabs paired with cascading green planters.'
    },
    {
      id: 3,
      x: '68%',
      y: '56%',
      titleAr: 'الواجهات الزجاجية والإضاءة الخطية',
      titleEn: 'Panorama Glazing & Linear LED',
      descAr: 'زجاج مزدوج ممتد بارتفاع كامل مع إضاءات سقف خطية دافئة مدمجة.',
      descEn: 'Full-height double glazing accented with warm recessed architectural cove LEDs.'
    },
    {
      id: 4,
      x: '41%',
      y: '79%',
      titleAr: 'المدخل الزجاجي الفندقي',
      titleEn: 'Illuminated Glazed Entrance Lobby',
      descAr: 'مدخل رحب بإضاءة دافئة محاط بمساحات خضراء وأشجار طبيعية ظليلة.',
      descEn: 'Warm illuminated glass lobby framed by lush courtyard foliage and shade trees.'
    }
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[560px] sm:h-[660px] md:h-[760px] overflow-hidden select-none bg-[#d8d2c9] border-b border-amber-500/20 touch-pan-y cursor-grab active:cursor-grabbing"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUpOrLeave}
      onPointerLeave={handlePointerUpOrLeave}
    >
      {/* Pre-load blurred full-bleed bright sunlit backdrop + crisp uncropped image before WebGL finishes loading */}
      <img
        src={resolvedHeroImage}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover scale-110 pointer-events-none transition-opacity duration-700 ${
          isSceneReady ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ filter: 'blur(24px)' }}
      />
      <img
        src={resolvedHeroImage}
        alt={lang === 'ar' ? 'بتاح للتطوير العقاري - واجهة 3D حية' : 'Ptah Real Estate Live 3D Building'}
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 pointer-events-none ${
          isSceneReady ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Isolated Three.js Interactive 3D Live Canvas (Bright Seamless Extended Backdrop + Uncropped 3D Building) */}
      <div
        ref={canvasMountRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Top Start Badge: Location in 10th of Ramadan */}
      <div className="absolute top-6 start-6 z-20 flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
        <a
          href={resolvedMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group px-3.5 py-2 rounded-2xl bg-neutral-950/92 hover:bg-neutral-900 border border-amber-500/40 text-amber-400 text-xs font-bold transition-all shadow-xl flex items-center gap-2 cursor-pointer hover:border-amber-400"
          title="افتح موقعنا على خرائط جوجل"
        >
          <MapPin className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
          <span>{lang === 'ar' ? 'العاشر من رمضان، الشرقية (خريطة جوجل)' : '10th of Ramadan, Sharqia (Google Maps)'}</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>

        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950/90 border border-amber-500/30 text-[11px] font-bold text-amber-300 shadow-lg">
          <Move3d className="w-3.5 h-3.5 text-amber-400" />
          <span>{lang === 'ar' ? 'عرض 3D حي كامل بدون قص' : 'Full Uncropped Live 3D View'}</span>
        </div>
      </div>

      {/* Top End Quick Action */}
      <div className="absolute top-6 end-6 z-20 hidden sm:flex items-center gap-3">
        <button
          onClick={onExploreUnits}
          className="px-4 py-2 rounded-xl bg-gold-gradient text-neutral-950 font-black text-xs tracking-wide transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer hover:opacity-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{translations[lang].hero.browseUnits}</span>
        </button>
      </div>

      {/* Interactive Architectural Hotspot Pins aligned cleanly inside the exact fitted uncropped building bounds */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
        style={
          fittedBox
            ? { width: `${fittedBox.width}px`, height: `${fittedBox.height}px` }
            : { width: '100%', height: '100%' }
        }
      >
        {hotspots.map((spot) => (
          <div
            key={spot.id}
            className="absolute pointer-events-auto"
            style={{ top: spot.y, left: spot.x }}
          >
            <button
              onClick={() => setSelectedHotspot(selectedHotspot === spot.id ? null : spot.id)}
              className="group relative flex items-center justify-center cursor-pointer"
              aria-label={lang === 'ar' ? spot.titleAr : spot.titleEn}
            >
              <span className="absolute w-8 h-8 rounded-full border border-amber-400/55 bg-amber-400/15 group-hover:scale-110 transition-transform" />
              <span className="relative w-6 h-6 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-[11px] shadow-lg shadow-black/60 border border-amber-200 group-hover:scale-110 transition-transform">
                <Eye className="w-3.5 h-3.5" />
              </span>
            </button>

            {selectedHotspot === spot.id && (
              <div className="absolute bottom-9 start-1/2 -translate-x-1/2 z-30 w-64 p-3.5 rounded-2xl bg-neutral-950/95 border border-amber-500/40 text-neutral-100 shadow-2xl">
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <h4 className="text-xs font-bold text-amber-400">
                    {lang === 'ar' ? spot.titleAr : spot.titleEn}
                  </h4>
                  <button
                    onClick={() => setSelectedHotspot(null)}
                    className="text-neutral-400 hover:text-white p-0.5 rounded cursor-pointer text-xs"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  {lang === 'ar' ? spot.descAr : spot.descEn}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sleek Bottom Control Dock (positioned cleanly above the floating hero card) */}
      <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-30 w-[94%] max-w-2xl transition-all duration-300">
        {/* Toggle Collapse Pill */}
        <div className={`flex justify-center ${isControlsCollapsed ? '' : '-mb-px'}`}>
          <button
            onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
            className="px-4 py-1.5 rounded-t-xl bg-neutral-900/95 border border-amber-500/35 text-amber-400 text-xs font-medium flex items-center gap-1.5 hover:bg-neutral-800 transition-colors cursor-pointer shadow-lg"
            style={isControlsCollapsed ? { borderRadius: '0.75rem' } : undefined}
          >
            {isControlsCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>{t.showControls}</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>{t.hideControls}</span>
              </>
            )}
          </button>
        </div>

        {/* Control Dock Panel */}
        {!isControlsCollapsed && (
          <div className="rounded-2xl p-3 shadow-2xl border border-amber-500/25 bg-neutral-950/92">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Lighting Mood Switcher */}
              <div className="flex items-center gap-1 bg-neutral-900/90 p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setLightingMood('golden')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
                    lightingMood === 'golden'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Sunset className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.lighting.golden}</span>
                </button>

                <button
                  onClick={() => setLightingMood('daylight')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
                    lightingMood === 'daylight'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{t.lighting.daylight}</span>
                </button>

                <button
                  onClick={() => setLightingMood('twilight')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
                    lightingMood === 'twilight'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-blue-300" />
                  <span>{t.lighting.twilight}</span>
                </button>
              </div>

              {/* Live 3D Orbit & Motion Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAnimating(!isAnimating)}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isAnimating
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                      : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <RotateCw
                    className={`w-3.5 h-3.5 ${isAnimating ? 'animate-spin' : ''}`}
                    style={{ animationDuration: '8s' }}
                  />
                  <span>{t.autoRotate}</span>
                </button>
              </div>

              {/* Direct Google Maps Link */}
              <a
                href={resolvedMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>{lang === 'ar' ? 'مقر العاشر من رمضان' : '10th of Ramadan HQ'}</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
