import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { 
  X, 
  Maximize2, 
  Sun, 
  Moon, 
  Info, 
  Compass, 
  MessageCircle, 
  Calendar,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Property, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { SOCIAL_LINKS } from '../../data/mockProperties';

interface VirtualTourModalProps {
  property: Property;
  lang: Language;
  onClose: () => void;
  onScheduleViewing: (prop: Property) => void;
}

export const VirtualTour3DModal: React.FC<VirtualTourModalProps> = ({
  property,
  lang,
  onClose,
  onScheduleViewing
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const t = translations[lang].vrTour;
  const tDetail = translations[lang].detail;

  const [activeRoomIndex, setActiveRoomIndex] = useState<number>(0);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<{ title: string; detail: string } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const activeRoom = property.vrRooms[activeRoomIndex] || property.vrRooms[0];

  const tourStateRef = useRef({
    activeTheme: activeRoom?.panoramaTheme || 'living',
    isNight: false,
    hotspots: activeRoom?.hotspots || []
  });

  useEffect(() => {
    tourStateRef.current.activeTheme = activeRoom?.panoramaTheme || 'living';
    tourStateRef.current.hotspots = activeRoom?.hotspots || [];
  }, [activeRoomIndex, activeRoom]);

  useEffect(() => {
    tourStateRef.current.isNight = isNightMode;
  }, [isNightMode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
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

    const width = container.clientWidth;
    const height = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Camera inside room
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 100);
    camera.position.set(0, 1.6, 0.1); // Human eye level

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = -0.45; // Natural panoramic drag
    controls.enableZoom = true;
    controls.minDistance = 0.1;
    controls.maxDistance = 5;
    controls.target.set(0, 1.6, 0);

    // Studio Reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Procedural Textures for Interior
    const createMarbleTexture = () => {
      const cvs = document.createElement('canvas');
      cvs.width = 512;
      cvs.height = 512;
      const ctx = cvs.getContext('2d')!;
      ctx.fillStyle = '#f8f8fa';
      ctx.fillRect(0, 0, 512, 512);

      // Statuario grey and gold veins
      ctx.strokeStyle = 'rgba(160, 160, 175, 0.35)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(30, 0);
      ctx.bezierCurveTo(150, 180, 280, 240, 512, 420);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 320);
      ctx.bezierCurveTo(200, 280, 340, 480, 512, 500);
      ctx.stroke();

      const tex = new THREE.CanvasTexture(cvs);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 4);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const createSkylineTexture = (isNight: boolean) => {
      const cvs = document.createElement('canvas');
      cvs.width = 1024;
      cvs.height = 512;
      const ctx = cvs.getContext('2d')!;

      // Gradient sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 512);
      if (isNight) {
        skyGrad.addColorStop(0, '#04060e');
        skyGrad.addColorStop(0.6, '#0f172a');
        skyGrad.addColorStop(1, '#1e1b4b');
      } else {
        skyGrad.addColorStop(0, '#38bdf8');
        skyGrad.addColorStop(0.5, '#7dd3fc');
        skyGrad.addColorStop(1, '#fed7aa');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 1024, 512);

      // Horizon skyline buildings & landscape
      ctx.fillStyle = isNight ? '#090a12' : '#64748b';
      for (let x = 0; x < 1024; x += 36) {
        const h = 50 + Math.sin(x * 0.05) * 40 + (x % 5) * 15;
        ctx.fillRect(x, 512 - h, 30, h);

        if (isNight) {
          // Building night window lights
          ctx.fillStyle = 'rgba(255, 235, 150, 0.8)';
          for (let wy = 512 - h + 10; wy < 500; wy += 14) {
            if (Math.random() > 0.4) {
              ctx.fillRect(x + 6, wy, 4, 6);
            }
          }
          ctx.fillStyle = '#090a12';
        }
      }

      const tex = new THREE.CanvasTexture(cvs);
      tex.wrapS = THREE.RepeatWrapping;
      tex.repeat.set(2, 1);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const marbleTex = createMarbleTexture();
    const daySkyTex = createSkylineTexture(false);
    const nightSkyTex = createSkylineTexture(true);

    // Room Envelope Geometry (Inverted Box for interior)
    const roomGroup = new THREE.Group();

    // Floor (Polished Italian Marble)
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      map: marbleTex,
      roughness: 0.15,
      metalness: 0.1,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    roomGroup.add(floorMesh);

    // Ceiling (Recessed architectural tray)
    const ceilGeo = new THREE.PlaneGeometry(16, 16);
    const ceilMat = new THREE.MeshStandardMaterial({
      color: 0x14151e,
      roughness: 0.8,
    });
    const ceilMesh = new THREE.Mesh(ceilGeo, ceilMat);
    ceilMesh.rotation.x = Math.PI / 2;
    ceilMesh.position.y = 3.6;
    roomGroup.add(ceilMesh);

    // Back Wall (Luxury Wood Slat Accent Wall)
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 3.6),
      new THREE.MeshStandardMaterial({ color: 0x241d18, roughness: 0.7 })
    );
    backWall.position.set(0, 1.8, -8);
    roomGroup.add(backWall);

    // Decorative Art on Back Wall
    const artMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 2.0),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 })
    );
    artMesh.position.set(0, 1.9, -7.94);
    roomGroup.add(artMesh);

    // Left & Right Interior Walls
    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 3.6),
      new THREE.MeshStandardMaterial({ color: 0xe2dfd8, roughness: 0.6 })
    );
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-8, 1.8, 0);
    roomGroup.add(leftWall);

    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 3.6),
      new THREE.MeshStandardMaterial({ color: 0xe2dfd8, roughness: 0.6 })
    );
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(8, 1.8, 0);
    roomGroup.add(rightWall);

    // Front Panoramic Window Wall overlooking view
    const windowGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 3.6),
      new THREE.MeshPhysicalMaterial({
        color: 0xd0e8ff,
        transparent: true,
        opacity: 0.15,
        transmission: 0.85,
        roughness: 0.05,
      })
    );
    windowGlass.rotation.y = Math.PI;
    windowGlass.position.set(0, 1.8, 8);
    roomGroup.add(windowGlass);

    // Outdoor Horizon Backdrop Sphere
    const skyDomeMat = new THREE.MeshBasicMaterial({
      map: daySkyTex,
      side: THREE.BackSide,
    });
    const skyDome = new THREE.Mesh(new THREE.SphereGeometry(60, 32, 32), skyDomeMat);
    scene.add(skyDome);

    // Furniture: Luxury Modular Sofa
    const sofaGroup = new THREE.Group();
    sofaGroup.position.set(0, 0, -2.5);

    const sofaMat = new THREE.MeshStandardMaterial({ color: 0x2e323e, roughness: 0.85 });
    // Base cushion
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.5, 2.2), sofaMat);
    sofaBase.position.y = 0.25;
    sofaGroup.add(sofaBase);

    // Backrest
    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.7, 0.4), sofaMat);
    sofaBack.position.set(0, 0.8, -0.9);
    sofaGroup.add(sofaBack);

    // Coffee Table (Calacatta Marble top + Bronze Legs)
    const tableTop = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.1, 0.08, 32),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
    );
    tableTop.position.set(0, 0.45, 1.6);
    sofaGroup.add(tableTop);

    const tableLegs = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 0.4, 16),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 })
    );
    tableLegs.position.set(0, 0.2, 1.6);
    sofaGroup.add(tableLegs);

    roomGroup.add(sofaGroup);

    // Modern Chandelier (Ring of light)
    const chandelier = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.04, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0xffe6b3 })
    );
    chandelier.rotation.x = Math.PI / 2;
    chandelier.position.set(0, 3.1, 0);
    roomGroup.add(chandelier);

    scene.add(roomGroup);

    // Interactive 3D Hotspot Markers
    const hotspotGroup = new THREE.Group();
    const hotspotMeshList: { mesh: THREE.Mesh; data: any }[] = [];

    const updateHotspots = () => {
      // Clear previous
      while (hotspotGroup.children.length > 0) {
        hotspotGroup.remove(hotspotGroup.children[0]);
      }
      hotspotMeshList.length = 0;

      const spots = tourStateRef.current.hotspots;
      spots.forEach((spot) => {
        const markerMat = new THREE.MeshBasicMaterial({
          color: 0xd4af37,
          wireframe: false,
        });
        const marker = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), markerMat);
        marker.position.set(spot.x, spot.y + 1.2, spot.z);

        // Halo ring
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.16, 0.22, 32),
          new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
        );
        ring.position.copy(marker.position);
        ring.rotation.x = -Math.PI / 2;

        hotspotGroup.add(marker);
        hotspotGroup.add(ring);
        hotspotMeshList.push({ mesh: marker, data: spot });
      });
    };

    scene.add(hotspotGroup);
    updateHotspots();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const warmCeilingSpot = new THREE.PointLight(0xffdfa0, 3.5, 12);
    warmCeilingSpot.position.set(0, 3.3, 0);
    scene.add(warmCeilingSpot);

    const sunWindowLight = new THREE.DirectionalLight(0xfff3e0, 2.2);
    sunWindowLight.position.set(0, 6, 14);
    scene.add(sunWindowLight);

    // Raycaster for clicking hotspots
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = hotspotMeshList.map(h => h.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = hotspotMeshList.find(h => h.mesh === intersects[0].object);
        if (hit) {
          const item = hit.data;
          setSelectedHotspot({
            title: item.title[lang] || item.title.en,
            detail: item.detail[lang] || item.detail.en
          });
        }
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    // Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = clock.getDelta();
      const state = tourStateRef.current;

      // Update Sky Dome texture for Day/Night
      skyDomeMat.map = state.isNight ? nightSkyTex : daySkyTex;
      sunWindowLight.intensity = state.isNight ? 0.3 : 2.5;
      warmCeilingSpot.intensity = state.isNight ? 4.8 : 2.2;
      ambientLight.intensity = state.isNight ? 0.4 : 0.95;

      // Subtle pulse to hotspot rings
      hotspotGroup.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.RingGeometry) {
          const s = 1 + Math.sin(clock.getElapsedTime() * 3 + index) * 0.15;
          child.scale.set(s, s, s);
        }
      });

      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    tick();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(frameId);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [lang]);

  const handleWhatsAppInquiry = () => {
    const text = lang === 'ar'
      ? `مرحباً بتاح للاستثمار العقاري، قمت بمعاينة الوحدة (${property.refCode} - ${property.title.ar}) عبر جولة الواقع الافتراضي 3D/VR وأود حجز موعد لمعاينة ميدانية وتفاصيل التعاقد.`
      : `Hello Ptah Real Estate, I explored property (${property.refCode} - ${property.title.en}) via the 3D/VR Virtual Tour and would like to schedule a private VIP site viewing and payment plan consultation.`;
    window.open(`https://wa.me/${SOCIAL_LINKS.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-2 md:p-6 animate-in fade-in duration-300">
      <div className={`relative w-full ${isFullscreen ? 'h-full max-w-none' : 'max-w-6xl h-[92vh]'} bg-neutral-950 rounded-2xl border border-amber-500/30 overflow-hidden flex flex-col shadow-2xl`}>
        
        {/* Top Header Bar */}
        <div className="px-4 py-3 bg-neutral-900/90 border-b border-amber-500/20 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-400 font-bold text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D VR TOUR</span>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-white line-clamp-1">
                {property.title[lang]}
              </h3>
              <p className="text-xs text-neutral-400">
                {property.compound} • {property.locationName[lang]} ({property.refCode})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Day / Night Toggle */}
            <button
              onClick={() => setIsNightMode(!isNightMode)}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium ${
                isNightMode
                  ? 'bg-indigo-950/70 border-indigo-500/40 text-indigo-300'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              }`}
              title={t.dayNightToggle}
            >
              {isNightMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
              <span className="hidden sm:inline">{isNightMode ? 'Night Mood' : 'Day Mood'}</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
              title={t.fullScreen}
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-red-500/20 hover:text-red-400 text-neutral-300 transition-colors cursor-pointer"
              title={t.exitVR}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D WebGL Viewport Container */}
        <div className="relative flex-1 w-full bg-black overflow-hidden select-none">
          <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

          {/* User Guide Pill */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10 px-3.5 py-1.5 rounded-full bg-neutral-900/80 border border-white/10 text-neutral-300 text-xs backdrop-blur-md flex items-center gap-2 shadow-lg">
            <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>{t.guide}</span>
          </div>

          {/* Interactive Hotspot Details Popup if clicked */}
          {selectedHotspot && (
            <div className="absolute top-16 right-6 z-20 max-w-xs p-4 rounded-xl glass-panel border border-amber-500/40 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                  <Info className="w-4 h-4" />
                  <span>{selectedHotspot.title}</span>
                </div>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="text-neutral-400 hover:text-white p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {selectedHotspot.detail}
              </p>
            </div>
          )}

          {/* Mini Room Radar / Indicator */}
          <div className="absolute bottom-20 left-4 z-10 hidden sm:block pointer-events-none">
            <div className="p-2.5 rounded-xl bg-neutral-900/85 border border-white/10 backdrop-blur-md text-[11px] text-neutral-300 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span>{activeRoom?.name[lang] || activeRoom?.name.en}</span>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Room Navigation Dock */}
        <div className="px-4 py-3 bg-neutral-950 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-3 z-20">
          
          {/* Room Selector Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            <span className="text-xs text-neutral-400 font-medium px-1 hidden md:inline">
              {t.roomSelect}
            </span>
            {property.vrRooms.map((room, idx) => (
              <button
                key={room.id}
                onClick={() => {
                  setActiveRoomIndex(idx);
                  setSelectedHotspot(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeRoomIndex === idx
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-white/5'
                }`}
              >
                <span>{room.name[lang] || room.name.en}</span>
                {activeRoomIndex === idx && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>

          {/* Action Buttons: Schedule Viewing & WhatsApp */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onScheduleViewing(property);
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs flex items-center gap-2 border border-white/10 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.scheduleViewing}</span>
            </button>

            <button
              onClick={handleWhatsAppInquiry}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/25 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp VIP</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
