import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createBuildingTextures, createCatedralModel, createCristoRedentorModel } from './SantaCruzModels';

interface UrboCityScene3DProps {
  scrollProgress: number; // 0 to 1
  className?: string;
  onReady?: () => void;
}

export const UrboCityScene3D: React.FC<UrboCityScene3DProps> = ({
  scrollProgress,
  className = '',
  onReady,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const beaconGroupRef = useRef<THREE.Group | null>(null);
  const pulseRingRef = useRef<THREE.Mesh | null>(null);
  const energyParticleRef = useRef<THREE.Mesh | null>(null);
  const activeRouteMeshRef = useRef<THREE.Mesh | null>(null);
  const splineRef = useRef<THREE.CatmullRomCurve3 | null>(null);
  const cameraCurveRef = useRef<THREE.CatmullRomCurve3 | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const progressTargetRef = useRef(0);
  const progressCurrentRef = useRef(0);
  const isVisibleRef = useRef(true);

  // Sync prop changes into the smoothed target ref
  useEffect(() => {
    progressTargetRef.current = THREE.MathUtils.clamp(scrollProgress, 0, 1);
  }, [scrollProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene Setup - Cinematic Deep Nocturnal Atmosphere (Original Dark URBO)
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x070b14);
    scene.fog = new THREE.FogExp2(0x070b14, 0.0075); // Softer fog for generous visibility

    // 2. Camera Setup - Cinematic Isometric Perspective (38 deg FOV)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.5, 800);
    cameraRef.current = camera;
    camera.position.set(-18, 38, 48); // Initial view framing Catedral & Plaza 24
    camera.lookAt(0, 8, 0);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35; // Bright, luminous urban night
    container.appendChild(renderer.domElement);

    // 4. Lighting Rig (Multi-spectrum Night City)
    // Ambient Skylight
    const ambientLight = new THREE.AmbientLight(0x1a2e4c, 2.8);
    scene.add(ambientLight);

    // Key Directional Moonlight (Cool cyan)
    const moonLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    moonLight.position.set(50, 90, 40);
    scene.add(moonLight);

    // Secondary Rim Light (Teal reflection)
    const rimLight = new THREE.DirectionalLight(0x00c9a7, 1.5);
    rimLight.position.set(-60, 50, -40);
    scene.add(rimLight);

    // 5. Ground Plane & Santa Cruz Asphalt Grid
    const groundGeo = new THREE.PlaneGeometry(600, 600, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a1322,
      roughness: 0.85,
      metalness: 0.25,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    scene.add(ground);

    // Secondary subtle asphalt grid
    const grid = new THREE.GridHelper(500, 100, 0x1f3453, 0x0f1d32);
    grid.position.y = 0;
    scene.add(grid);

    // 6. Landmark 1: Catedral Metropolitana & Plaza 24 de Septiembre (Punto de Partida)
    const catedral = createCatedralModel();
    catedral.position.set(0, 0, 0); // Positioned at Casco Viejo ground zero
    scene.add(catedral);

    // Plaza 24 de Septiembre surround & manicured trees
    const plazaPaveGeo = new THREE.BoxGeometry(32, 0.4, 32);
    const plazaPaveMat = new THREE.MeshStandardMaterial({
      color: 0x13233a,
      roughness: 0.8,
    });
    const plazaPave = new THREE.Mesh(plazaPaveGeo, plazaPaveMat);
    plazaPave.position.set(0, 0.2, 14);
    scene.add(plazaPave);

    // Plaza Street Lanterns
    const lanternPositions = [
      [-12, 12], [12, 12], [-12, 24], [12, 24], [0, 26]
    ];
    lanternPositions.forEach(([lx, lz]) => {
      const lanternPost = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.16, 4.2, 8),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 })
      );
      lanternPost.position.set(lx, 2.1, lz);
      scene.add(lanternPost);

      const lanternGlow = new THREE.PointLight(0xf59e0b, 2.2, 16, 1.4);
      lanternGlow.position.set(lx, 4.3, lz);
      scene.add(lanternGlow);
    });

    // 7. Landmark 2: El Cristo Redentor (Intersección Segundo Anillo & Monseñor Rivero)
    const cristo = createCristoRedentorModel();
    // Placed north along the transit corridor at (25, 0, -110)
    cristo.position.set(25, 0, -110);
    scene.add(cristo);

    // 8. Architectural City Blocks with Detailed Facades & Glowing Windows
    const { textureFacade, textureWindows } = createBuildingTextures();
    const buildingMat = new THREE.MeshStandardMaterial({
      map: textureFacade,
      emissiveMap: textureWindows,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.85,
      roughness: 0.5,
      metalness: 0.35,
    });

    // Procedural urban blocks avoiding Catedral, Plaza 24, Cristo Redentor, and the avenue
    const buildingCount = 240;
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const buildingsMesh = new THREE.InstancedMesh(boxGeo, buildingMat, buildingCount);
    const dummy = new THREE.Object3D();

    let placed = 0;
    for (let x = -100; x <= 100 && placed < buildingCount; x += 15) {
      for (let z = -170; z <= 60 && placed < buildingCount; z += 15) {
        // Exclude Casco Viejo center around Cathedral
        if (Math.abs(x) < 22 && Math.abs(z) < 25) continue;
        // Exclude Cristo Redentor roundabout
        const distToCristo = Math.sqrt(Math.pow(x - 25, 2) + Math.pow(z - (-110), 2));
        if (distToCristo < 24) continue;
        // Exclude transit corridor between Cathedral, Cristo, and North Exit
        const isCorridor = Math.abs(x - (z * -0.22)) < 9;
        if (isCorridor && z > -170 && z < 50) continue;

        const w = 6 + Math.random() * 5;
        const d = 6 + Math.random() * 5;
        // Taller commercial buildings north along Monseñor Rivero / Banzer, lower in Casco Viejo
        const h = z < -60 ? 12 + Math.random() * 26 : 7 + Math.random() * 12;

        dummy.position.set(x + (Math.random() - 0.5) * 3, h / 2, z + (Math.random() - 0.5) * 3);
        dummy.scale.set(w, h, d);
        dummy.updateMatrix();
        buildingsMesh.setMatrixAt(placed, dummy.matrix);
        placed++;
      }
    }
    buildingsMesh.instanceMatrix.needsUpdate = true;
    scene.add(buildingsMesh);

    // 9. Street Trees (Tropical Toborochi & Palm Trees typical of Santa Cruz)
    const foliageGeo = new THREE.SphereGeometry(1.6, 8, 8);
    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x0f422e,
      roughness: 0.8,
    });
    const foliageMesh = new THREE.InstancedMesh(foliageGeo, foliageMat, 120);
    const fDummy = new THREE.Object3D();
    for (let i = 0; i < 120; i++) {
      const angle = (i / 120) * Math.PI * 2;
      const r = 16 + (i % 6) * 12;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r - 40;
      fDummy.position.set(x, 2.5, z);
      fDummy.scale.set(1, 1.4, 1);
      fDummy.updateMatrix();
      foliageMesh.setMatrixAt(i, fDummy.matrix);
    }
    foliageMesh.instanceMatrix.needsUpdate = true;
    scene.add(foliageMesh);

    // 10. REALISTIC SANTA CRUZ URBAN TRANSIT ROUTE:
    // Catedral (Plaza 24) -> Calle René Moreno -> Av. Monseñor Rivero -> Cristo Redentor -> Corredor Norte (Av. Banzer)
    const routeWaypoints = [
      new THREE.Vector3(0, 0.5, 24),     // 0: Frente a la Catedral (Calle 24 de Septiembre / Bolívar)
      new THREE.Vector3(6, 0.5, 12),     // 1: Borde este de Plaza 24
      new THREE.Vector3(8, 0.5, -15),    // 2: Salida hacia Calle René Moreno / 21 de Mayo
      new THREE.Vector3(14, 0.5, -45),   // 3: Inicio de Av. Monseñor Rivero (Zona Boulevar)
      new THREE.Vector3(20, 0.5, -80),   // 4: Av. Monseñor Rivero aproximándose al 2do Anillo
      new THREE.Vector3(25, 0.5, -110),  // 5: Rotonda del Cristo Redentor (Monumento)
      new THREE.Vector3(25, 0.5, -135),  // 6: Superando el 2do Anillo hacia Av. Banzer
      new THREE.Vector3(25, 0.5, -175),  // 7: Corredor Norte continuo hacia 3er y 4to Anillo
    ];

    const spline = new THREE.CatmullRomCurve3(routeWaypoints, false, 'centripetal', 0.25);
    splineRef.current = spline;

    // Capa 1: Base route casing (Tenue guía vial)
    const baseRouteGeo = new THREE.TubeGeometry(spline, 180, 0.5, 8, false);
    const baseRouteMat = new THREE.MeshStandardMaterial({
      color: 0x00c9a7,
      transparent: true,
      opacity: 0.35,
      roughness: 0.3,
      metalness: 0.8,
    });
    const baseRouteMesh = new THREE.Mesh(baseRouteGeo, baseRouteMat);
    scene.add(baseRouteMesh);

    // Capa 2: Active illuminated emerald/teal tube
    const activeRouteGeo = new THREE.TubeGeometry(spline, 180, 0.32, 8, false);
    const activeRouteMat = new THREE.MeshStandardMaterial({
      color: 0x00e5be,
      emissive: 0x00c9a7,
      emissiveIntensity: 1.4,
      roughness: 0.1,
      metalness: 0.9,
    });
    const activeRouteMesh = new THREE.Mesh(activeRouteGeo, activeRouteMat);
    activeRouteMeshRef.current = activeRouteMesh;
    scene.add(activeRouteMesh);

    // Capa 3: Flowing energy pulse bead on route
    const energyGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const energyMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: false,
    });
    const energyParticle = new THREE.Mesh(energyGeo, energyMat);
    energyParticleRef.current = energyParticle;
    scene.add(energyParticle);

    // 11. Camera Waypoint Trajectory for Cinematic Continuous Following
    // Camera starts focused on Catedral, glides along Monseñor Rivero, slows at Cristo, and follows into Corredor Norte
    const cameraWaypoints = [
      new THREE.Vector3(-18, 32, 48),    // Framing Catedral towers & Plaza
      new THREE.Vector3(-10, 30, 32),    // Starting vehicle pursuit
      new THREE.Vector3(0, 26, 4),       // Moving north through historic center
      new THREE.Vector3(34, 30, -32),    // Elevated view of Monseñor Rivero boulevard
      new THREE.Vector3(44, 32, -72),    // Approaching Segundo Anillo
      new THREE.Vector3(48, 28, -102),   // Deceleration angle framing Cristo Redentor
      new THREE.Vector3(42, 34, -130),   // Transition into Northern Corridor
      new THREE.Vector3(38, 42, -165),   // Wide overview of Santa Cruz North
    ];
    const cameraCurve = new THREE.CatmullRomCurve3(cameraWaypoints, false, 'centripetal', 0.3);
    cameraCurveRef.current = cameraCurve;

    // 12. Protagonist Cyan GPS Beacon (Active Bus in route)
    const beaconGroup = new THREE.Group();
    beaconGroupRef.current = beaconGroup;

    // Outer cyan sphere
    const beaconGeo = new THREE.SphereGeometry(1.0, 24, 24);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x00b4d8,
      emissiveIntensity: 2.2,
      roughness: 0.1,
      metalness: 0.9,
    });
    const beaconSphere = new THREE.Mesh(beaconGeo, beaconMat);
    beaconGroup.add(beaconSphere);

    // Inner bright white core
    const coreGeo = new THREE.SphereGeometry(0.48, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    beaconGroup.add(coreMesh);

    // Pulsing cyan radar aura ring
    const ringGeo = new THREE.RingGeometry(1.4, 2.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });
    const pulseRing = new THREE.Mesh(ringGeo, ringMat);
    pulseRing.rotation.x = Math.PI / 2;
    pulseRing.position.y = -0.2;
    pulseRingRef.current = pulseRing;
    beaconGroup.add(pulseRing);

    // Dynamic Vehicle PointLight with ground glow
    const beaconLight = new THREE.PointLight(0x38bdf8, 4.5, 30, 1.4);
    beaconLight.position.y = 1.4;
    beaconGroup.add(beaconLight);

    // Set initial position at start of route (Catedral)
    const startPoint = spline.getPointAt(0);
    beaconGroup.position.copy(startPoint);
    scene.add(beaconGroup);

    // Resize listener
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Visibility observer to pause RAF when off-screen
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    observer.observe(container);

    // 13. High-Performance Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (!isVisibleRef.current) return;

      const time = clock.getElapsedTime();

      // Smooth progress lerp (lerp factor 0.08)
      const target = progressTargetRef.current;
      progressCurrentRef.current = THREE.MathUtils.lerp(progressCurrentRef.current, target, 0.08);
      const p = progressCurrentRef.current;

      // Update vehicle beacon position along spline
      if (splineRef.current && beaconGroupRef.current) {
        const busPos = splineRef.current.getPointAt(p);
        beaconGroupRef.current.position.copy(busPos);

        // Turn vehicle in direction of next street coordinate
        if (p < 0.99) {
          const nextPos = splineRef.current.getPointAt(Math.min(p + 0.015, 1));
          beaconGroupRef.current.lookAt(nextPos);
        }
      }

      // Animate flowing energy pulse along route
      if (splineRef.current && energyParticleRef.current) {
        const energyProgress = (p + (time * 0.15) % 0.25) % 1;
        const ePos = splineRef.current.getPointAt(energyProgress);
        energyParticleRef.current.position.copy(ePos);
      }

      // Pulse ring animation
      if (pulseRingRef.current) {
        const scale = 1 + (time * 2.8) % 1.8;
        pulseRingRef.current.scale.set(scale, scale, 1);
        const ringMat = pulseRingRef.current.material as THREE.MeshBasicMaterial;
        ringMat.opacity = Math.max(0, 0.8 - ((time * 2.8) % 1.8) * 0.45);
      }

      // Smooth cinematic camera following
      if (cameraCurveRef.current && cameraRef.current && beaconGroupRef.current) {
        const targetCamPos = cameraCurveRef.current.getPointAt(p);
        cameraRef.current.position.lerp(targetCamPos, 0.075);

        // Target camera slightly ahead of the bus position
        const busPos = beaconGroupRef.current.position;
        const lookTarget = new THREE.Vector3(
          busPos.x,
          busPos.y + 4.5,
          busPos.z - 4
        );
        cameraRef.current.lookAt(lookTarget);
      }

      renderer.render(scene, camera);
    };

    animate();

    if (onReady) {
      onReady();
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
      style={{ touchAction: 'pan-y' }}
    />
  );
};
export default UrboCityScene3D;
