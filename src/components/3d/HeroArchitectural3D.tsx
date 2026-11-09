import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { 
  Sun, 
  Moon, 
  Sunset, 
  Eye, 
  RotateCw, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Maximize2 
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';

interface Hero3DProps {
  lang: Language;
  onExploreUnits?: () => void;
}

export const HeroArchitectural3D: React.FC<Hero3DProps> = ({ lang, onExploreUnits }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const t = translations[lang].controls3D;

  const [lightingPreset, setLightingPreset] = useState<'golden' | 'daylight' | 'twilight'>('golden');
  const [cameraPreset, setCameraPreset] = useState<'panoramic' | 'penthouse' | 'wireframe' | 'terrace'>('panoramic');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);

  // References to communicate with Three.js loop
  const sceneStateRef = useRef({
    lightingPreset: 'golden',
    cameraPreset: 'panoramic',
    autoRotate: true,
    targetCamPos: new THREE.Vector3(26, 16, 26),
    targetLookAt: new THREE.Vector3(0, 5, 0),
    isWireframe: false,
    waterTime: 0
  });

  useEffect(() => {
    sceneStateRef.current.lightingPreset = lightingPreset;
    sceneStateRef.current.autoRotate = autoRotate;
  }, [lightingPreset, autoRotate]);

  useEffect(() => {
    sceneStateRef.current.cameraPreset = cameraPreset;
    if (cameraPreset === 'panoramic') {
      sceneStateRef.current.targetCamPos.set(24, 15, 24);
      sceneStateRef.current.targetLookAt.set(0, 4, 0);
      sceneStateRef.current.isWireframe = false;
    } else if (cameraPreset === 'penthouse') {
      sceneStateRef.current.targetCamPos.set(8, 18, 12);
      sceneStateRef.current.targetLookAt.set(0, 11, 0);
      sceneStateRef.current.isWireframe = false;
    } else if (cameraPreset === 'terrace') {
      sceneStateRef.current.targetCamPos.set(14, 6, 12);
      sceneStateRef.current.targetLookAt.set(2, 2, 0);
      sceneStateRef.current.isWireframe = false;
    } else if (cameraPreset === 'wireframe') {
      sceneStateRef.current.targetCamPos.set(22, 14, 20);
      sceneStateRef.current.targetLookAt.set(0, 5, 0);
      sceneStateRef.current.isWireframe = true;
    }
  }, [cameraPreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 2. Setup Renderer
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 650;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0e15, 0.015);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 200);
    camera.position.set(26, 16, 26);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.03; // Don't go below ground
    controls.minDistance = 6;
    controls.maxDistance = 55;
    controls.target.set(0, 5, 0);

    // 4. Studio Environment via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Procedural Texture Generators
    const createTravertineTexture = () => {
      const cvs = document.createElement('canvas');
      cvs.width = 512;
      cvs.height = 512;
      const ctx = cvs.getContext('2d')!;
      ctx.fillStyle = '#ece8df';
      ctx.fillRect(0, 0, 512, 512);

      // Veins & grain
      ctx.fillStyle = 'rgba(205, 195, 180, 0.35)';
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const w = 20 + Math.random() * 80;
        const h = 2 + Math.random() * 4;
        ctx.fillRect(x, y, w, h);
      }
      const tex = new THREE.CanvasTexture(cvs);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 4);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return tex;
    };

    const createWoodDeckTexture = () => {
      const cvs = document.createElement('canvas');
      cvs.width = 512;
      cvs.height = 512;
      const ctx = cvs.getContext('2d')!;
      ctx.fillStyle = '#6e4f3a';
      ctx.fillRect(0, 0, 512, 512);

      // Planks
      ctx.fillStyle = '#4c3525';
      for (let y = 0; y < 512; y += 32) {
        ctx.fillRect(0, y, 512, 2);
      }
      const tex = new THREE.CanvasTexture(cvs);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(6, 6);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const travertineTex = createTravertineTexture();
    const woodDeckTex = createWoodDeckTexture();

    // 6. Materials
    const marbleMat = new THREE.MeshStandardMaterial({
      map: travertineTex,
      roughness: 0.3,
      metalness: 0.05,
    });

    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0xc8963e,
      roughness: 0.25,
      metalness: 0.9,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xa8c5dc,
      roughness: 0.05,
      metalness: 0.1,
      transmission: isSoftwareGl ? 0 : 0.88,
      transparent: true,
      opacity: isSoftwareGl ? 0.45 : 0.95,
      ior: 1.52,
      thickness: 0.8,
    });

    const woodMat = new THREE.MeshStandardMaterial({
      map: woodDeckTex,
      roughness: 0.6,
      metalness: 0.1,
    });

    const poolWaterMat = new THREE.MeshStandardMaterial({
      color: 0x00a8b5,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85,
    });

    const interiorGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffd99a,
    });

    const wireframeMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      wireframe: true,
      roughness: 0.3,
      metalness: 0.8,
    });

    // 7. Architectural Assembly (THREE.Group with 3-12 subcomponents)
    const buildingGroup = new THREE.Group();

    // Ground Podium / Platform
    const podiumGeo = new THREE.BoxGeometry(28, 0.8, 24);
    const podiumMesh = new THREE.Mesh(podiumGeo, marbleMat);
    podiumMesh.position.set(0, 0.4, 0);
    podiumMesh.receiveShadow = !isSoftwareGl;
    buildingGroup.add(podiumMesh);

    // Ground Floor Pavilion (Main Living Villa Wing)
    const groundFloorGeo = new THREE.BoxGeometry(16, 4.2, 12);
    const groundFloorMesh = new THREE.Mesh(groundFloorGeo, marbleMat);
    groundFloorMesh.position.set(-2, 2.9, 0);
    groundFloorMesh.castShadow = !isSoftwareGl;
    groundFloorMesh.receiveShadow = !isSoftwareGl;
    buildingGroup.add(groundFloorMesh);

    // Ground Floor Panoramic Glass Facade
    const glassFacadeGeo = new THREE.BoxGeometry(15.8, 3.8, 11.8);
    const glassFacade = new THREE.Mesh(glassFacadeGeo, glassMat);
    glassFacade.position.set(-2, 2.9, 0);
    buildingGroup.add(glassFacade);

    // Ground Floor Bronze Mullions Grid
    for (let x = -8; x <= 4; x += 3) {
      const mullionGeo = new THREE.CylinderGeometry(0.08, 0.08, 4.2, 8);
      const mullion = new THREE.Mesh(mullionGeo, bronzeMat);
      mullion.position.set(x, 2.9, 5.95);
      buildingGroup.add(mullion);
    }

    // Cantilevered Upper Architectural Level (Penthouse Wing)
    const upperLevelGeo = new THREE.BoxGeometry(14, 3.8, 14);
    const upperLevelMesh = new THREE.Mesh(upperLevelGeo, marbleMat);
    upperLevelMesh.position.set(1.5, 6.9, -1);
    upperLevelMesh.castShadow = !isSoftwareGl;
    upperLevelMesh.receiveShadow = !isSoftwareGl;
    buildingGroup.add(upperLevelMesh);

    // Upper Level Glass Corner Balcony
    const upperGlassGeo = new THREE.BoxGeometry(8, 3.4, 6);
    const upperGlass = new THREE.Mesh(upperGlassGeo, glassMat);
    upperGlass.position.set(4, 6.9, 2.5);
    buildingGroup.add(upperGlass);

    // Rooftop Sky Pergola / Sunshade (Bronze Louvers)
    const pergolaGroup = new THREE.Group();
    pergolaGroup.position.set(2, 9.2, -1);
    for (let z = -5; z <= 5; z += 1.2) {
      const louverGeo = new THREE.BoxGeometry(12, 0.12, 0.4);
      const louver = new THREE.Mesh(louverGeo, bronzeMat);
      louver.position.set(0, 0, z);
      pergolaGroup.add(louver);
    }
    buildingGroup.add(pergolaGroup);

    // Infinity Swimming Pool Terrace Wing
    const poolDeckGeo = new THREE.BoxGeometry(10, 0.6, 14);
    const poolDeck = new THREE.Mesh(poolDeckGeo, woodMat);
    poolDeck.position.set(8, 0.7, 3);
    poolDeck.receiveShadow = !isSoftwareGl;
    buildingGroup.add(poolDeck);

    // Water Surface
    const waterGeo = new THREE.PlaneGeometry(7.5, 11.5);
    const waterMesh = new THREE.Mesh(waterGeo, poolWaterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.set(8.5, 0.95, 3);
    buildingGroup.add(waterMesh);

    // Pool Infinity Edge Glass Wall
    const poolGlassGeo = new THREE.BoxGeometry(0.15, 0.8, 11.5);
    const poolGlass = new THREE.Mesh(poolGlassGeo, glassMat);
    poolGlass.position.set(12.3, 1.2, 3);
    buildingGroup.add(poolGlass);

    // Modern Sun Loungers by Pool (2 sets)
    for (let i = -1; i <= 1; i += 2) {
      const loungerBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.25, 2.8), woodMat);
      loungerBase.position.set(5.5, 1.1, 2 + i * 2.5);
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.15, 2.6), new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: 0.8 }));
      cushion.position.set(5.5, 1.25, 2 + i * 2.5);
      buildingGroup.add(loungerBase);
      buildingGroup.add(cushion);
    }

    // Warm Interior Glow Volumes
    const interiorGlow1 = new THREE.Mesh(new THREE.BoxGeometry(10, 2.5, 7), interiorGlowMat);
    interiorGlow1.position.set(-2, 2.8, 0);
    buildingGroup.add(interiorGlow1);

    const interiorGlow2 = new THREE.Mesh(new THREE.BoxGeometry(8, 2.2, 7), interiorGlowMat);
    interiorGlow2.position.set(2, 6.8, -1);
    buildingGroup.add(interiorGlow2);

    // Landscaping: Architectural Cypress & Palm Trees
    const createModernTree = (x: number, z: number, scale = 1) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(x, 0.8, z);
      treeGroup.scale.set(scale, scale, scale);

      const trunkGeo = new THREE.CylinderGeometry(0.18, 0.28, 4.5, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.9 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 2.25;
      trunk.castShadow = !isSoftwareGl;
      treeGroup.add(trunk);

      // Foliage layers
      const foliageColors = [0x234426, 0x2e5632, 0x1d3820];
      for (let i = 0; i < 3; i++) {
        const coneGeo = new THREE.ConeGeometry(1.6 - i * 0.35, 2.6, 7);
        const coneMat = new THREE.MeshStandardMaterial({ 
          color: foliageColors[i], 
          roughness: 0.8 
        });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.position.y = 3.8 + i * 1.4;
        cone.castShadow = !isSoftwareGl;
        treeGroup.add(cone);
      }
      return treeGroup;
    };

    buildingGroup.add(createModernTree(-10, 8, 1.1));
    buildingGroup.add(createModernTree(-12, 5, 0.85));
    buildingGroup.add(createModernTree(-11, -8, 1.2));
    buildingGroup.add(createModernTree(11, -8, 0.95));

    // Ground Plane with subtle reflection
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x090a10,
      roughness: 0.7,
      metalness: 0.2,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = 0;
    groundMesh.receiveShadow = !isSoftwareGl;
    scene.add(groundMesh);

    scene.add(buildingGroup);

    // 8. Balanced 3-Point Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xffecd0, 2.4);
    keyLight.position.set(25, 30, 20);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 10;
      keyLight.shadow.camera.far = 80;
      keyLight.shadow.camera.left = -20;
      keyLight.shadow.camera.right = 20;
      keyLight.shadow.camera.top = 20;
      keyLight.shadow.camera.bottom = -20;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x406080, 0x1a1208, 1.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xa5c4e0, 1.1);
    rimLight.position.set(-20, 20, -25);
    scene.add(rimLight);

    // Interior Warm Spotlights
    const interiorPoint1 = new THREE.PointLight(0xffaa44, 3, 18);
    interiorPoint1.position.set(-2, 3.5, 0);
    scene.add(interiorPoint1);

    const poolSpotLight = new THREE.PointLight(0x00e1ff, 2, 12);
    poolSpotLight.position.set(8.5, 1.5, 3);
    scene.add(poolSpotLight);

    // 9. Render Loop with Software GL pacing & Smooth Camera Transition
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      const delta = clock.getDelta();
      const state = sceneStateRef.current;

      // Smooth camera interpolation towards target presets
      camera.position.lerp(state.targetCamPos, delta * 2.2);
      controls.target.lerp(state.targetLookAt, delta * 2.2);

      // Auto rotation when enabled and user isn't vigorously dragging
      if (state.autoRotate) {
        buildingGroup.rotation.y += delta * 0.12;
      }

      // Shimmering pool water
      state.waterTime += delta * 1.5;
      waterMesh.position.y = 0.95 + Math.sin(state.waterTime) * 0.02;

      // Adjust lighting according to preset
      if (state.lightingPreset === 'golden') {
        keyLight.color.setHex(0xffb74d);
        keyLight.intensity = 2.8;
        renderer.toneMappingExposure = 1.15;
        scene.fog?.color.setHex(0x13111c);
        renderer.setClearColor(0x13111c, 0);
      } else if (state.lightingPreset === 'daylight') {
        keyLight.color.setHex(0xffffff);
        keyLight.intensity = 3.2;
        renderer.toneMappingExposure = 1.25;
        scene.fog?.color.setHex(0x101524);
        renderer.setClearColor(0x101524, 0);
      } else if (state.lightingPreset === 'twilight') {
        keyLight.color.setHex(0x384a68);
        keyLight.intensity = 0.7;
        renderer.toneMappingExposure = 0.95;
        interiorPoint1.intensity = 5.5;
        scene.fog?.color.setHex(0x06080e);
        renderer.setClearColor(0x06080e, 0);
      }

      // Wireframe toggle
      podiumMesh.material = state.isWireframe ? wireframeMat : marbleMat;
      groundFloorMesh.material = state.isWireframe ? wireframeMat : marbleMat;
      upperLevelMesh.material = state.isWireframe ? wireframeMat : marbleMat;

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 650;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (isSoftwareGl) clearTimeout(frameId);
      else cancelAnimationFrame(frameId);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[620px] md:h-[720px] bg-gradient-to-b from-[#090a10] via-[#0d0f1a] to-[#090a10] overflow-hidden select-none border-b border-amber-500/10">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0" />

      {/* Top Left/Right Luxury Brand Watermark */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shadow-lg shadow-amber-500/5">
          3D
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-amber-400/80 font-medium font-sans">
            Ptah Architectural Engine
          </div>
          <div className="text-sm font-semibold text-white/90">
            {t.title}
          </div>
        </div>
      </div>

      {/* Top Right Quick Action */}
      <div className="absolute top-6 right-6 z-10 hidden sm:flex items-center gap-3">
        <button
          onClick={onExploreUnits}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs tracking-wide transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>{translations[lang].hero.browseUnits}</span>
        </button>
      </div>

      {/* Unified Bottom Control Dock (Compliant with Skill Directive 5: Zero Viewport Occlusion, pinned bottom center) */}
      <div 
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-3xl transition-transform duration-300"
        style={{
          transform: isDockCollapsed 
            ? 'translateX(-50%) translateY(calc(100% - 32px))' 
            : 'translateX(-50%) translateY(0)'
        }}
      >
        {/* Collapse / Expand Tab */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="px-4 py-1.5 rounded-t-lg bg-neutral-900/90 border-t border-x border-amber-500/30 text-amber-400 text-xs font-medium flex items-center gap-1.5 backdrop-blur-md hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            {isDockCollapsed ? (
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

        {/* Main Dock Glass Panel */}
        <div className="glass-panel rounded-2xl p-3 md:p-4 shadow-2xl border border-amber-500/25 bg-neutral-950/85 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Camera Angles / Presets */}
            <div className="flex items-center gap-1.5 bg-neutral-900/80 p-1 rounded-xl border border-white/5">
              <span className="text-neutral-400 px-2 hidden lg:inline-block font-medium">
                {t.presets.panoramic.split(' ')[0]}:
              </span>

              <button
                onClick={() => setCameraPreset('panoramic')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  cameraPreset === 'panoramic'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{t.presets.panoramic}</span>
              </button>

              <button
                onClick={() => setCameraPreset('penthouse')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  cameraPreset === 'penthouse'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{t.presets.penthouse}</span>
              </button>

              <button
                onClick={() => setCameraPreset('terrace')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  cameraPreset === 'terrace'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{t.presets.terrace}</span>
              </button>

              <button
                onClick={() => setCameraPreset('wireframe')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  cameraPreset === 'wireframe'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t.presets.wireframe}</span>
              </button>
            </div>

            {/* Lighting Time of Day Switcher */}
            <div className="flex items-center gap-1 bg-neutral-900/80 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setLightingPreset('golden')}
                title={t.lighting.golden}
                className={`p-1.5 px-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  lightingPreset === 'golden'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Sunset className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{t.lighting.golden}</span>
              </button>

              <button
                onClick={() => setLightingPreset('daylight')}
                title={t.lighting.daylight}
                className={`p-1.5 px-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  lightingPreset === 'daylight'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-yellow-300" />
                <span className="hidden sm:inline">{t.lighting.daylight}</span>
              </button>

              <button
                onClick={() => setLightingPreset('twilight')}
                title={t.lighting.twilight}
                className={`p-1.5 px-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  lightingPreset === 'twilight'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-blue-300" />
                <span className="hidden sm:inline">{t.lighting.twilight}</span>
              </button>
            </div>

            {/* Auto-Rotate Switch */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                  autoRotate
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                <span>{t.autoRotate}</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
