import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

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

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x070b14); // Deep nocturnal navy
    scene.fog = new THREE.FogExp2(0x070b14, 0.012);

    // 2. Camera setup - Isometric feel (FOV 36 deg)
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.5, 500);
    cameraRef.current = camera;
    camera.position.set(45, 55, 65);
    camera.lookAt(0, 0, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 4. Lighting - Night urban palette
    const ambientLight = new THREE.AmbientLight(0x132238, 2.0); // Ambient deep navy
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0x38bdf8, 2.2); // Cool cyan moonlight
    moonLight.position.set(40, 70, 30);
    scene.add(moonLight);

    const warmCityLight = new THREE.PointLight(0xf59e0b, 1.8, 60, 1.2); // Warm sodium street light
    warmCityLight.position.set(0, 12, 0);
    scene.add(warmCityLight);

    // 5. Ground Plane & Grid
    const groundGeo = new THREE.PlaneGeometry(300, 300, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x091222,
      roughness: 0.85,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    scene.add(ground);

    // Road Grid GridHelper with navy/cyan accent lines
    const grid = new THREE.GridHelper(240, 48, 0x1e3a5f, 0x0f1d36);
    grid.position.y = 0;
    scene.add(grid);

    // 6. Procedural Santa Cruz Blocks & Buildings (InstancedMesh for maximum 60fps performance)
    const buildingCount = 180;
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x11213b,
      roughness: 0.45,
      metalness: 0.5,
    });
    const buildingMesh = new THREE.InstancedMesh(boxGeo, boxMat, buildingCount);

    const dummy = new THREE.Object3D();
    const cityMatrix: { x: number; z: number; w: number; d: number; h: number }[] = [];

    // Generate urban blocks with avenues running orthogonal, keeping the route clear
    let placed = 0;
    for (let x = -70; x <= 70 && placed < buildingCount; x += 14) {
      for (let z = -70; z <= 70 && placed < buildingCount; z += 14) {
        // Leave central avenue corridor free for the route
        const distToCenter = Math.sqrt(x * x + z * z);
        const isRouteCorridor = Math.abs(x + z) < 10 || Math.abs(x - z) < 8;
        if (isRouteCorridor && distToCenter < 50) continue;

        const w = 4 + Math.random() * 4;
        const d = 4 + Math.random() * 4;
        // Taller near center, lower near perimeter (Santa Cruz historic center scale)
        const h = distToCenter < 25 ? 5 + Math.random() * 6 : 8 + Math.random() * 18;

        dummy.position.set(x + (Math.random() - 0.5) * 2, h / 2, z + (Math.random() - 0.5) * 2);
        dummy.scale.set(w, h, d);
        dummy.updateMatrix();
        buildingMesh.setMatrixAt(placed, dummy.matrix);
        cityMatrix.push({ x: dummy.position.x, z: dummy.position.z, w, d, h });
        placed++;
      }
    }
    buildingMesh.instanceMatrix.needsUpdate = true;
    scene.add(buildingMesh);

    // 7. Landmark: Plaza 24 de Septiembre Central Square
    const plazaGeo = new THREE.BoxGeometry(16, 0.4, 16);
    const plazaMat = new THREE.MeshStandardMaterial({
      color: 0x0f283d,
      roughness: 0.7,
      metalness: 0.1,
    });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.position.set(0, 0.2, 0);
    scene.add(plaza);

    // Plaza landmark tower / Cathedral stylization
    const cathedralGeo = new THREE.BoxGeometry(6, 14, 8);
    const cathedralMat = new THREE.MeshStandardMaterial({
      color: 0x1b3459,
      roughness: 0.4,
      metalness: 0.6,
      emissive: 0x0a1d36,
      emissiveIntensity: 0.6,
    });
    const cathedral = new THREE.Mesh(cathedralGeo, cathedralMat);
    cathedral.position.set(0, 7, 0);
    scene.add(cathedral);

    // 8. Línea 30 Route Spline (Street pathing through Casco Viejo)
    const routeWaypoints = [
      new THREE.Vector3(-55, 0.4, 55),   // Entry: Av. Irala / Primer Anillo
      new THREE.Vector3(-35, 0.4, 35),   // Calle René Moreno
      new THREE.Vector3(-18, 0.4, 18),   // Calle Sucre
      new THREE.Vector3(0, 0.4, 6),      // Approaching Plaza 24 de Septiembre
      new THREE.Vector3(10, 0.4, -4),    // Corner Calle 24 de Septiembre
      new THREE.Vector3(26, 0.4, -22),   // Calle Bolívar
      new THREE.Vector3(45, 0.4, -42),   // Exit to Av. Cañoto
    ];

    const spline = new THREE.CatmullRomCurve3(routeWaypoints, false, 'centripetal', 0.3);
    splineRef.current = spline;

    // Route Geometry - Emerald Tube & Glowing Base
    const tubeGeo = new THREE.TubeGeometry(spline, 120, 0.35, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x10b981, // URBO Emerald
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x10b981,
      emissiveIntensity: 0.9,
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(tubeMesh);

    // Subtle wider route casing for optical glow
    const casingGeo = new THREE.TubeGeometry(spline, 120, 0.6, 6, false);
    const casingMat = new THREE.MeshBasicMaterial({
      color: 0x059669,
      transparent: true,
      opacity: 0.28,
    });
    const casingMesh = new THREE.Mesh(casingGeo, casingMat);
    scene.add(casingMesh);

    // 9. Camera Spline for Smooth Continuous Pursuit
    // The camera smoothly tracks slightly behind and above the vehicle
    const cameraWaypoints = routeWaypoints.map((pt, idx) => {
      // Elevated offset relative to route point for isometric angle
      return new THREE.Vector3(pt.x + 24, 30 + idx * 2, pt.z + 28);
    });
    const cameraCurve = new THREE.CatmullRomCurve3(cameraWaypoints, false, 'centripetal', 0.4);
    cameraCurveRef.current = cameraCurve;

    // 10. GPS Beacon Group (Active Bus: Cyan #38BDF8)
    const beaconGroup = new THREE.Group();
    beaconGroupRef.current = beaconGroup;

    // Inner bright sphere
    const beaconGeo = new THREE.SphereGeometry(0.85, 24, 24);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x00b4d8,
      emissiveIntensity: 1.8,
    });
    const beaconSphere = new THREE.Mesh(beaconGeo, beaconMat);
    beaconGroup.add(beaconSphere);

    // Core white light center
    const coreGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    beaconGroup.add(coreMesh);

    // Animated Pulsing Cyan Ring
    const ringGeo = new THREE.RingGeometry(1.2, 1.8, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const pulseRing = new THREE.Mesh(ringGeo, ringMat);
    pulseRing.rotation.x = Math.PI / 2;
    pulseRing.position.y = -0.2;
    pulseRingRef.current = pulseRing;
    beaconGroup.add(pulseRing);

    // Point Light attached to vehicle
    const beaconLight = new THREE.PointLight(0x38bdf8, 3.2, 22, 1.5);
    beaconLight.position.y = 1.0;
    beaconGroup.add(beaconLight);

    // Initial vehicle position
    const startPoint = spline.getPointAt(0);
    beaconGroup.position.copy(startPoint);
    scene.add(beaconGroup);

    // 11. Street Trees along the avenues (Emerald Low-Poly cones)
    const treeGeo = new THREE.ConeGeometry(0.8, 2.4, 5);
    const treeMat = new THREE.MeshStandardMaterial({
      color: 0x0d3b2e,
      roughness: 0.9,
    });
    const treeMesh = new THREE.InstancedMesh(treeGeo, treeMat, 60);
    const treeDummy = new THREE.Object3D();
    for (let i = 0; i < 60; i++) {
      const t = (i / 60) * 0.9 + 0.05;
      const pt = spline.getPointAt(t);
      const normal = new THREE.Vector3(-1, 0, 1).normalize();
      const offset = (i % 2 === 0 ? 1 : -1) * (2.8 + (i % 3) * 0.8);
      treeDummy.position.set(pt.x + normal.x * offset, 1.2, pt.z + normal.z * offset);
      treeDummy.scale.setScalar(0.7 + (i % 4) * 0.2);
      treeDummy.updateMatrix();
      treeMesh.setMatrixAt(i, treeDummy.matrix);
    }
    treeMesh.instanceMatrix.needsUpdate = true;
    scene.add(treeMesh);

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

    // 12. Animation Loop (Smooth Lerp Scrubbing + Pulse)
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (!isVisibleRef.current) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth progress interpolation (lerp factor 0.1)
      const target = progressTargetRef.current;
      progressCurrentRef.current = THREE.MathUtils.lerp(progressCurrentRef.current, target, 0.1);
      const p = progressCurrentRef.current;

      // Update vehicle beacon position along spline
      if (splineRef.current && beaconGroupRef.current) {
        const busPos = splineRef.current.getPointAt(p);
        beaconGroupRef.current.position.copy(busPos);

        // Orient vehicle in direction of travel
        if (p < 0.99) {
          const nextPos = splineRef.current.getPointAt(Math.min(p + 0.01, 1));
          beaconGroupRef.current.lookAt(nextPos);
        }
      }

      // Pulse ring animation
      if (pulseRingRef.current) {
        const scale = 1 + (time * 2.5) % 1.6;
        pulseRingRef.current.scale.set(scale, scale, 1);
        const ringMat = pulseRingRef.current.material as THREE.MeshBasicMaterial;
        ringMat.opacity = Math.max(0, 0.7 - ((time * 2.5) % 1.6) * 0.4);
      }

      // Smooth camera pursuit along camera curve
      if (cameraCurveRef.current && cameraRef.current && beaconGroupRef.current) {
        const targetCamPos = cameraCurveRef.current.getPointAt(p);
        cameraRef.current.position.lerp(targetCamPos, 0.08);

        // Smooth camera lookAt vehicle target
        const currentLookAt = new THREE.Vector3();
        cameraRef.current.getWorldDirection(currentLookAt);
        const vehiclePos = beaconGroupRef.current.position;
        // Look slightly ahead of the vehicle
        const lookTarget = new THREE.Vector3(
          vehiclePos.x + 2,
          vehiclePos.y + 0.5,
          vehiclePos.z - 2
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
