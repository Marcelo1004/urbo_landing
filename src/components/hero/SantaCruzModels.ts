import * as THREE from 'three';

/**
 * Creates procedural building textures:
 * 1. Base facade texture with subtle brick/concrete panels
 * 2. Emissive window texture with glowing warm amber & soft cyan night offices/homes
 */
export function createBuildingTextures() {
  // Canvas 1: Facade base with concrete panelling & vertical pillars
  const canvasFacade = document.createElement('canvas');
  canvasFacade.width = 256;
  canvasFacade.height = 512;
  const ctxF = canvasFacade.getContext('2d')!;

  // Deep navy architectural gradient
  const gradF = ctxF.createLinearGradient(0, 0, 0, 512);
  gradF.addColorStop(0, '#1E2C44'); // Top cornice
  gradF.addColorStop(0.5, '#162238'); // Mid facade
  gradF.addColorStop(1, '#0F1A2D'); // Ground base
  ctxF.fillStyle = gradF;
  ctxF.fillRect(0, 0, 256, 512);

  // Floor dividers
  ctxF.fillStyle = '#0B1320';
  for (let y = 32; y < 512; y += 40) {
    ctxF.fillRect(0, y, 256, 4);
  }

  // Vertical structural columns
  ctxF.fillStyle = '#22324D';
  for (let x = 16; x < 256; x += 32) {
    ctxF.fillRect(x, 0, 3, 512);
  }

  const textureFacade = new THREE.CanvasTexture(canvasFacade);
  textureFacade.wrapS = THREE.RepeatWrapping;
  textureFacade.wrapT = THREE.RepeatWrapping;

  // Canvas 2: Emissive Windows Map (Warm sodium amber, soft teal, dark unlit rooms)
  const canvasWindows = document.createElement('canvas');
  canvasWindows.width = 256;
  canvasWindows.height = 512;
  const ctxW = canvasWindows.getContext('2d')!;

  ctxW.fillStyle = '#000000';
  ctxW.fillRect(0, 0, 256, 512);

  const colors = [
    '#F59E0B', // Sodium amber light
    '#FDE68A', // Warm residential incandescent
    '#38BDF8', // Cool cyan office glow
    '#00E5BE', // URBO teal neon sign
    '#000000', // Unlit window
    '#000000',
    '#000000',
  ];

  for (let y = 42; y < 490; y += 40) {
    for (let x = 22; x < 240; x += 32) {
      const col = colors[Math.floor(Math.random() * colors.length)];
      if (col !== '#000000') {
        ctxW.fillStyle = col;
        ctxW.fillRect(x, y, 14, 20);
        // Soft window halo
        ctxW.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctxW.fillRect(x + 2, y + 2, 10, 8);
      }
    }
  }

  const textureWindows = new THREE.CanvasTexture(canvasWindows);
  textureWindows.wrapS = THREE.RepeatWrapping;
  textureWindows.wrapT = THREE.RepeatWrapping;

  return { textureFacade, textureWindows };
}

/**
 * Builds stylized architectural model of Catedral Metropolitana de San Lorenzo
 * (Basílica Menor, Casco Viejo de Santa Cruz de la Sierra)
 * Features:
 * - Central Romanesque/Neoclassical pediment & nave
 * - Two flanking twin bell towers with domed cupolas & crosses
 * - Clay-colored red brick facade with warm glowing stained-glass rose window
 */
export function createCatedralModel(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'CatedralSanLorenzo';

  // 1. Broad Base Pedestal (Atrio de la Catedral sobre Plaza 24)
  const baseGeo = new THREE.BoxGeometry(20, 1.2, 16);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x1E293B,
    roughness: 0.8,
    metalness: 0.2,
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = 0.6;
  group.add(base);

  // 2. Central Basilica Nave (Brick terracotta facade)
  const naveGeo = new THREE.BoxGeometry(11, 12, 14);
  const naveMat = new THREE.MeshStandardMaterial({
    color: 0x8C3B24, // Terracotta brick red typical of Santa Cruz cathedral
    roughness: 0.7,
    metalness: 0.15,
  });
  const nave = new THREE.Mesh(naveGeo, naveMat);
  nave.position.set(0, 6 + 1.2, -1);
  group.add(nave);

  // 3. Central Triangular Pediment / Gable
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-5.5, 0);
  roofShape.lineTo(0, 4);
  roofShape.lineTo(5.5, 0);
  roofShape.closePath();
  const extrudeSettings = { depth: 14, bevelEnabled: false };
  const roofGeo = new THREE.ExtrudeGeometry(roofShape, extrudeSettings);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x6E2D1B, roughness: 0.6 });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(0, 12 + 1.2, -8);
  group.add(roof);

  // 4. Twin Bell Towers (Torre Sur & Torre Norte)
  const towerGeo = new THREE.BoxGeometry(4.2, 22, 4.2);
  const towerMat = new THREE.MeshStandardMaterial({
    color: 0x9A432A,
    roughness: 0.65,
    metalness: 0.2,
  });

  const belfryGeo = new THREE.BoxGeometry(3.6, 5, 3.6);
  const belfryMat = new THREE.MeshStandardMaterial({
    color: 0x24334B,
    roughness: 0.4,
    metalness: 0.5,
  });

  const domeGeo = new THREE.ConeGeometry(2.4, 4.5, 8);
  const domeMat = new THREE.MeshStandardMaterial({
    color: 0xD97706, // Golden bronze cupola
    metalness: 0.7,
    roughness: 0.3,
  });

  [-6.8, 6.8].forEach((xPos, idx) => {
    // Tower main body
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.set(xPos, 11 + 1.2, 4);
    group.add(tower);

    // Campanario open arched belfry
    const belfry = new THREE.Mesh(belfryGeo, belfryMat);
    belfry.position.set(xPos, 22 + 2.5 + 1.2, 4);
    group.add(belfry);

    // Warm bell chamber interior light
    const bellLight = new THREE.PointLight(0xF59E0B, 2.5, 12, 1.2);
    bellLight.position.set(xPos, 22 + 2.5 + 1.2, 4);
    group.add(bellLight);

    // Cupola dome
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.set(xPos, 27 + 2.2 + 1.2, 4);
    group.add(dome);

    // Finial cross
    const crossVert = new THREE.BoxGeometry(0.3, 1.8, 0.3);
    const crossHoriz = new THREE.BoxGeometry(1.1, 0.3, 0.3);
    const crossMat = new THREE.MeshStandardMaterial({ color: 0xFDE68A, emissive: 0xF59E0B, emissiveIntensity: 0.8 });
    const cV = new THREE.Mesh(crossVert, crossMat);
    const cH = new THREE.Mesh(crossHoriz, crossMat);
    cV.position.set(xPos, 32 + 1.2, 4);
    cH.position.set(xPos, 32.2 + 1.2, 4);
    group.add(cV, cH);
  });

  // 5. Grand Portico Portal & Rose Window
  const porticoGeo = new THREE.BoxGeometry(4.5, 6, 1.5);
  const porticoMat = new THREE.MeshStandardMaterial({
    color: 0x1A2536,
    roughness: 0.9,
  });
  const portico = new THREE.Mesh(porticoGeo, porticoMat);
  portico.position.set(0, 3 + 1.2, 6.1);
  group.add(portico);

  // Glowing stained-glass rose window
  const roseGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.4, 16);
  roseGeo.rotateX(Math.PI / 2);
  const roseMat = new THREE.MeshStandardMaterial({
    color: 0x00E5BE,
    emissive: 0x00C9A7,
    emissiveIntensity: 1.6,
  });
  const rose = new THREE.Mesh(roseGeo, roseMat);
  rose.position.set(0, 9 + 1.2, 6.1);
  group.add(rose);

  // Architectural facade uplighting
  const atrioLight = new THREE.PointLight(0xF59E0B, 3.5, 26, 1.4);
  atrioLight.position.set(0, 4, 8);
  group.add(atrioLight);

  return group;
}

/**
 * Builds stylized monument of El Cristo Redentor
 * (Segundo Anillo & Av. Monseñor Rivero, Santa Cruz de la Sierra)
 * Features:
 * - Round roundabout base (rotonda del 2do Anillo)
 * - Tapered stone pedestal
 * - Stylized figure of Christ with welcoming outstretched arms
 * - Uplighting floodlights (Cyan & Warm amber)
 */
export function createCristoRedentorModel(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'CristoRedentor';

  // 1. Landscaped Rotonda Base
  const rotondaGeo = new THREE.CylinderGeometry(11, 11, 1.2, 32);
  const rotondaMat = new THREE.MeshStandardMaterial({
    color: 0x133829, // Lush manicured grass ring
    roughness: 0.8,
  });
  const rotonda = new THREE.Mesh(rotondaGeo, rotondaMat);
  rotonda.position.y = 0.6;
  group.add(rotonda);

  // Curb border ring
  const curbGeo = new THREE.TorusGeometry(10.8, 0.4, 8, 32);
  curbGeo.rotateX(Math.PI / 2);
  const curbMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
  const curb = new THREE.Mesh(curbGeo, curbMat);
  curb.position.y = 1.0;
  group.add(curb);

  // 2. Multi-tiered Pedestal
  const tier1Geo = new THREE.BoxGeometry(6, 1.5, 6);
  const tier1Mat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
  const tier1 = new THREE.Mesh(tier1Geo, tier1Mat);
  tier1.position.y = 1.2 + 0.75;
  group.add(tier1);

  const pedestalGeo = new THREE.CylinderGeometry(2.4, 3.2, 9, 16);
  const pedestalMat = new THREE.MeshStandardMaterial({
    color: 0xCBD5E1, // Light travertine stone
    roughness: 0.45,
    metalness: 0.2,
  });
  const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
  pedestal.position.y = 2.7 + 4.5;
  group.add(pedestal);

  // 3. Christ Figure (Tapered bronze/marble robe, head, outstretched arms)
  const robeGeo = new THREE.CylinderGeometry(1.2, 1.8, 7.5, 12);
  const figureMat = new THREE.MeshStandardMaterial({
    color: 0xE2E8F0,
    roughness: 0.35,
    metalness: 0.3,
  });
  const robe = new THREE.Mesh(robeGeo, figureMat);
  robe.position.y = 11.7 + 3.75;
  group.add(robe);

  // Head
  const headGeo = new THREE.SphereGeometry(0.9, 16, 16);
  const head = new THREE.Mesh(headGeo, figureMat);
  head.position.y = 15.45 + 3.9;
  group.add(head);

  // Outstretched Welcoming Arms (Iconic silhouette facing the avenue)
  const armsGeo = new THREE.BoxGeometry(10.5, 0.9, 1.1);
  const arms = new THREE.Mesh(armsGeo, figureMat);
  arms.position.set(0, 18.2, 0);
  group.add(arms);

  // 4. Dramatic Architectural Floodlights (Monument illumination)
  const floodlightCyan = new THREE.SpotLight(0x38BDF8, 8, 35, Math.PI / 4, 0.4, 1.2);
  floodlightCyan.position.set(5, 1.5, 5);
  floodlightCyan.target = head;
  group.add(floodlightCyan);

  const floodlightTeal = new THREE.SpotLight(0x00E5BE, 8, 35, Math.PI / 4, 0.4, 1.2);
  floodlightTeal.position.set(-5, 1.5, -5);
  floodlightTeal.target = head;
  group.add(floodlightTeal);

  const auraLight = new THREE.PointLight(0x38BDF8, 3.5, 20, 1.3);
  auraLight.position.set(0, 18, 0);
  group.add(auraLight);

  return group;
}
