import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Map, Marker, MercatorCoordinate, setWorkerUrl } from 'maplibre-gl';
import type { CustomLayerInterface } from 'maplibre-gl';
import * as THREE from 'three';
import { createCatedralModel, createCristoRedentorModel } from './SantaCruzModels';
import maplibreWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import {
  NAV_ROUTE_GEOJSON,
  CRISTO_COORDS,
  CATEDRAL_COORDS,
  STREET_LAMPS_GEOJSON,
  PEDESTRIANS_DATA,
  getNavStateAtProgress,
  DayNightVisuals,
} from './SantaCruzNavData';

if (typeof window !== 'undefined') {
  setWorkerUrl(maplibreWorker);
}

function createMonumentsLayer(lightRef: React.MutableRefObject<{ night: number }>): CustomLayerInterface {
  let renderer: THREE.WebGLRenderer | null = null;
  let scene: THREE.Scene | null = null;
  let camera: THREE.Camera | null = null;
  let ambient: THREE.AmbientLight;
  let sun: THREE.DirectionalLight;
  const place = (obj: THREE.Object3D, lngLat: [number, number], rotY: number, boost = 1) => {
    const c = MercatorCoordinate.fromLngLat(lngLat, 0);
    const s = c.meterInMercatorCoordinateUnits() * boost;
    // model: Y up, +Z front. Mercator: z up, y south. rotateX(PI/2) maps Y->z, +Z->north.
    const m = new THREE.Matrix4()
      .makeTranslation(c.x, c.y, c.z)
      .scale(new THREE.Vector3(s, -s, s))
      .multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2))
      .multiply(new THREE.Matrix4().makeRotationY(rotY));
    obj.matrixAutoUpdate = false;
    obj.matrix.copy(m);
    obj.matrixWorldNeedsUpdate = true;
  };
  return {
    id: 'urbo-monuments-3d',
    type: 'custom',
    renderingMode: '3d',
    onAdd(map, gl) {
      camera = new THREE.Camera();
      scene = new THREE.Scene();
      ambient = new THREE.AmbientLight(0xffffff, 1.2);
      sun = new THREE.DirectionalLight(0xfff1d6, 2.2);
      sun.position.set(40, 80, 60);
      scene.add(ambient, sun);
      const cat = createCatedralModel();
      const cristo = createCristoRedentorModel();
      [cat, cristo].forEach((m) => { const ls: THREE.Object3D[] = []; m.traverse((o) => { if ((o as any).isLight) ls.push(o); }); ls.forEach((l) => l.parent?.remove(l)); });
      place(cat, CATEDRAL_COORDS, 0, 2.2);
      place(cristo, CRISTO_COORDS, 0, 2.6);
      scene.add(cat, cristo);
      renderer = new THREE.WebGLRenderer({ canvas: map.getCanvas(), context: gl as WebGLRenderingContext, antialias: true });
      renderer.autoClear = false;
    },
    render(_gl, options) {
      if (!renderer || !scene || !camera) return;
      const n = Math.max(0, Math.min(1, lightRef.current.night));
      ambient.intensity = 0.75 - 0.4 * n;
      ambient.color.setHex(n > 0.5 ? 0x8aa2d8 : 0xffffff);
      sun.intensity = 1.5 - 1.0 * n;
      sun.color.setHex(n > 0.75 ? 0x6f86c8 : n > 0.4 ? 0xffb070 : 0xfff1d6);
      camera.projectionMatrix.fromArray(options.defaultProjectionData.mainMatrix as unknown as number[]);
      renderer.resetState();
      renderer.render(scene, camera);
      renderer.resetState();
    },
    onRemove() {
      scene?.traverse((o: any) => { o.geometry?.dispose?.(); });
      renderer?.dispose();
      renderer = null; scene = null; camera = null;
    },
  };
}
export interface UrboNavMap3DHandle {
  setProgress: (progress: number) => void;
}

export interface UrboNavMap3DProps {
  scrollProgress?: number;
  className?: string;
  onReady?: () => void;
  onTimeChange?: (visuals: DayNightVisuals, chapter: number, distMeters: number, isCenital: boolean) => void;
}

export const UrboNavMap3D = forwardRef<UrboNavMap3DHandle, UrboNavMap3DProps>(({
  scrollProgress = 0,
  className = '',
  onReady,
  onTimeChange,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const gpsMarkerRef = useRef<Marker | null>(null);
  const cristoMarkerRef = useRef<Marker | null>(null);
  const pedestrianMarkersRef = useRef<Marker[]>([]);

  const monumentLightRef = useRef<{ night: number }>({ night: 0 });
  const isMapLoadedRef = useRef(false);
  const isVisibleRef = useRef(true);
  const rafIdRef = useRef<number | null>(null);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastAppliedDayNightRef = useRef<number>(-1);

  // Persistent smoothed camera gimbal state
  const cameraLngRef = useRef(0);
  const cameraLatRef = useRef(0);
  const cameraBearingRef = useRef(0);
  const cameraPitchRef = useRef(56);
  const cameraZoomRef = useRef(16.5);

  useImperativeHandle(ref, () => ({
    setProgress: (progress: number) => {
      targetProgressRef.current = Math.max(0, Math.min(1, progress));
    },
  }));

  useEffect(() => {
    if (typeof scrollProgress === 'number') {
      targetProgressRef.current = Math.max(0, Math.min(1, scrollProgress));
    }
  }, [scrollProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initialState = getNavStateAtProgress(0);

    const map = new Map({
      container,
      style: 'https://tiles.openfreemap.org/styles/dark',
      center: initialState.center,
      zoom: initialState.zoom,
      pitch: initialState.pitch,
      bearing: initialState.bearing,
      interactive: false,
      attributionControl: false,
    });
    mapRef.current = map;

    map.on('error', (e) => {
      if (!e?.error?.message?.includes('sprite')) {
        console.warn('UrboNavMap3D Notice:', e);
      }
    });

    map.on('load', () => {
      isMapLoadedRef.current = true;

      // Initialize gimbal camera refs
      cameraLngRef.current = initialState.center[0];
      cameraLatRef.current = initialState.center[1];
      cameraBearingRef.current = initialState.bearing;
      cameraPitchRef.current = initialState.pitch;
      cameraZoomRef.current = initialState.zoom;

      // Hide noisy labels
      const layersToHide = [
        'highway_name_other', 'highway_name_motorway',
        'place_other', 'place_suburb', 'place_village', 'place_town',
        'road_oneway', 'road_oneway_opposite',
        'poi_level_1', 'poi_level_2', 'poi_level_3',
      ];
      layersToHide.forEach((id) => {
        if (map.getLayer(id)) {
          try { map.setLayoutProperty(id, 'visibility', 'none'); } catch (e) {}
        }
      });

      // Apply initial cartography paint
      if (map.getLayer('background'))
        map.setPaintProperty('background', 'background-color', initialState.dayNight.backgroundColor);
      if (map.getLayer('landuse_residential'))
        map.setPaintProperty('landuse_residential', 'fill-color', initialState.dayNight.residentialColor);
      if (map.getLayer('landuse_park'))
        map.setPaintProperty('landuse_park', 'fill-color', initialState.dayNight.residentialColor);
      if (map.getLayer('highway_minor'))
        map.setPaintProperty('highway_minor', 'line-color', initialState.dayNight.minorRoadColor);
      if (map.getLayer('highway_major_inner'))
        map.setPaintProperty('highway_major_inner', 'line-color', initialState.dayNight.majorRoadInnerColor);
      if (map.getLayer('highway_major_casing'))
        map.setPaintProperty('highway_major_casing', 'line-color', initialState.dayNight.majorRoadCasingColor);

      // 3D BUILDING EXTRUSION
      if (!map.getLayer('3d-buildings')) {
        map.addLayer(
          {
            id: '3d-buildings',
            source: 'openmaptiles',
            'source-layer': 'building',
            type: 'fill-extrusion',
            minzoom: 13,
            paint: {
              'fill-extrusion-color': initialState.dayNight.buildingColor,
              'fill-extrusion-height': [
                'interpolate', ['linear'], ['zoom'],
                13, 0,
                15, ['case', ['has', 'render_height'], ['get', 'render_height'], 11],
                17, ['case', ['has', 'render_height'], ['get', 'render_height'], 15],
              ],
              'fill-extrusion-base': [
                'case', ['has', 'render_min_height'], ['get', 'render_min_height'], 0,
              ],
              'fill-extrusion-opacity': 0.85,
            },
          },
          'highway_motorway_inner'
        );
      }

      // Hide OSM extrusions under the two monuments so the 3D models are not buried\n      const clearRing = (c: [number, number], r: number) => {\n        const dLat = r / 111320, dLng = r / (111320 * Math.cos((c[1] * Math.PI) / 180));\n        return { type: 'Polygon', coordinates: [[[c[0]-dLng,c[1]-dLat],[c[0]+dLng,c[1]-dLat],[c[0]+dLng,c[1]+dLat],[c[0]-dLng,c[1]+dLat],[c[0]-dLng,c[1]-dLat]]] };\n      };\n      try {\n        map.setFilter('3d-buildings', ['all', ['!', ['within', clearRing(CATEDRAL_COORDS, 38) as any]], ['!', ['within', clearRing(CRISTO_COORDS, 30) as any]]]);\n      } catch (e) { console.warn('monument clearing filter', e); }\n\n      // THREE.JS CUSTOM LAYER — real 3D monuments sharing MapLibre's WebGL context
      const monumentLayer = createMonumentsLayer(monumentLightRef);
      map.addLayer(monumentLayer);

      // NAVIGATION ROUTE LAYERS
      if (!map.getSource('nav-route-source')) {
        map.addSource('nav-route-source', {
          type: 'geojson',
          data: NAV_ROUTE_GEOJSON,
        });

        // Glow casing
        map.addLayer({
          id: 'nav-route-casing',
          type: 'line',
          source: 'nav-route-source',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': initialState.dayNight.routeGlowColor,
            'line-width': ['interpolate', ['linear'], ['zoom'], 13, 6, 15, 12, 17, 18],
            'line-opacity': 0.35,
            'line-blur': 5,
          },
        });

        // Main route
        map.addLayer({
          id: 'nav-route-main',
          type: 'line',
          source: 'nav-route-source',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': initialState.dayNight.routeColor,
            'line-width': ['interpolate', ['linear'], ['zoom'], 13, 3, 15, 5.5, 17, 8],
            'line-opacity': 0.92,
          },
        });

        // Core luminous accent
        map.addLayer({
          id: 'nav-route-inner-core',
          type: 'line',
          source: 'nav-route-source',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#FFFFFF',
            'line-width': ['interpolate', ['linear'], ['zoom'], 13, 1, 15, 2, 17, 3],
            'line-opacity': 0.85,
          },
        });
      }

      // STREET LAMPS — refined, less noisy
      if (!map.getSource('street-lamps-source')) {
        map.addSource('street-lamps-source', {
          type: 'geojson',
          data: STREET_LAMPS_GEOJSON,
        });

        map.addLayer({
          id: 'street-lamps-glow',
          type: 'circle',
          source: 'street-lamps-source',
          paint: {
            'circle-color': '#FBBF24',
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 2, 16, 5, 18, 8],
            'circle-opacity': initialState.dayNight.streetLampOpacity * 0.55,
            'circle-blur': 0.9,
          },
        });

        map.addLayer({
          id: 'street-lamps-core',
          type: 'circle',
          source: 'street-lamps-source',
          paint: {
            'circle-color': '#FFFBEB',
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 1, 16, 2, 18, 3],
            'circle-opacity': initialState.dayNight.streetLampOpacity * 0.80,
          },
        });
      }

      // 3D MAP LIGHT
      map.setLight({
        anchor: 'map',
        color: initialState.dayNight.lightColor,
        intensity: initialState.dayNight.lightIntensity,
        position: [1.3, 180, 50],
      });

      // PEDESTRIANS
      pedestrianMarkersRef.current = PEDESTRIANS_DATA.map((ped) => {
        const pEl = document.createElement('div');
        pEl.className = 'pedestrian-dot pointer-events-none select-none';
        pEl.style.cssText = 'width:5px;height:5px;border-radius:50%;background:#38BDF8;box-shadow:0 0 5px #38BDF8;border:1px solid #FFFFFF;';
        return new Marker({ element: pEl, anchor: 'center' })
          .setLngLat(ped.base as [number, number])
          .addTo(map);
      });

      // CRISTO REDENTOR 3D LANDMARK MARKER (Majestic icon of Santa Cruz at 2do Anillo)
      const cristoEl = document.createElement('div');
      cristoEl.className = 'cristo-landmark pointer-events-none select-none';
      cristoEl.style.cssText = 'width:120px;height:140px;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;z-index:10;';
      cristoEl.style.cssText = 'width:max-content;position:relative;z-index:10;margin-bottom:70px;';
      cristoEl.innerHTML = `<div style="padding:3px 8px;background:rgba(6,11,24,0.92);border:1px solid rgba(251,191,36,0.7);border-radius:8px;white-space:nowrap;"><span style="font-size:10px;font-family:monospace;font-weight:800;color:#FDE68A;letter-spacing:0.08em;text-transform:uppercase;">Cristo Redentor · 2do Anillo</span></div>`;
      cristoMarkerRef.current = new Marker({ element: cristoEl, anchor: 'bottom' })
        .setLngLat(CRISTO_COORDS)
        .addTo(map);

      // GPS BEACON
      const gpsEl = document.createElement('div');
      gpsEl.className = 'gps-nav-beacon-container pointer-events-none select-none';
      gpsEl.style.cssText = 'width:38px;height:38px;position:relative;display:flex;align-items:center;justify-content:center;';
      gpsEl.innerHTML = `
        <div style="position:absolute;inset:0;border-radius:50%;background:rgba(56,189,248,0.35);animation:gpsAuraPulse 2.2s ease-out infinite;"></div>
        <div style="position:absolute;width:24px;height:24px;border-radius:50%;background:#38BDF8;box-shadow:0 0 20px #38BDF8,0 0 35px rgba(56,189,248,0.7);display:flex;align-items:center;justify-content:center;border:2.5px solid #FFFFFF;">
          <div style="width:8px;height:8px;border-radius:50%;background:#FFFFFF;"></div>
        </div>
      `;

      gpsMarkerRef.current = new Marker({ element: gpsEl, anchor: 'center' })
        .setLngLat(initialState.beacon)
        .addTo(map);

      if (onReady) onReady();
      if (onTimeChange) {
        onTimeChange(initialState.dayNight, initialState.chapter, initialState.traveledDistanceMeters, false);
      }
    });

    // Intersection Observer
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    observer.observe(container);

    let animationTime = 0;

    // 60fps RAF Animation Loop
    const updateLoop = () => {
      rafIdRef.current = requestAnimationFrame(updateLoop);
      if (!isVisibleRef.current || !isMapLoadedRef.current || !mapRef.current) return;

      animationTime += 0.02;

      // Animate pedestrians
      if (pedestrianMarkersRef.current.length > 0) {
        pedestrianMarkersRef.current.forEach((marker, i) => {
          const ped = PEDESTRIANS_DATA[i];
          if (!ped) return;
          const a = animationTime * ped.speed + i;
          const lng = ped.base[0] + Math.cos(a) * ped.radius;
          const lat = ped.base[1] + Math.sin(a) * (ped.radius * 0.7);
          marker.setLngLat([lng, lat]);
        });
      }

      const target = targetProgressRef.current;
      // Smoother lerp for premium feel (0.12 = less jittery, more cinematic)
      const diff = target - currentProgressRef.current;
      if (Math.abs(diff) < 0.0001) {
        currentProgressRef.current = target;
      } else {
        currentProgressRef.current += diff * 0.12;
      }
      const p = currentProgressRef.current;

      const navState = getNavStateAtProgress(p);

      // Move GPS beacon
      if (gpsMarkerRef.current) {
        gpsMarkerRef.current.setLngLat(navState.beacon);
      }

      // Smooth gimbal camera — damped drone-follow
      const angleDiff = ((navState.bearing - cameraBearingRef.current + 540) % 360) - 180;
      cameraBearingRef.current = (cameraBearingRef.current + angleDiff * 0.035 + 360) % 360;

      // Look-ahead offset
      const rad = (cameraBearingRef.current * Math.PI) / 180;
      const forwardDist = navState.isCenital ? 0.0005 : 0.0008 + 0.0006 * Math.min(1, p / 0.12);
      const targetCenterLng = navState.beacon[0] + Math.sin(rad) * forwardDist;
      const targetCenterLat = navState.beacon[1] + Math.cos(rad) * forwardDist;

      cameraLngRef.current += (targetCenterLng - cameraLngRef.current) * 0.07;
      cameraLatRef.current += (targetCenterLat - cameraLatRef.current) * 0.07;
      cameraPitchRef.current += (navState.pitch - cameraPitchRef.current) * 0.04;
      cameraZoomRef.current += (navState.zoom - cameraZoomRef.current) * 0.04;

      mapRef.current.jumpTo({
        center: [cameraLngRef.current, cameraLatRef.current],
        bearing: cameraBearingRef.current,
        pitch: cameraPitchRef.current,
        zoom: cameraZoomRef.current,
        padding: { top: Math.round(240 * Math.max(0, 1 - p / 0.10)), bottom: 0, left: 0, right: 0 },
      });

      // Day-to-Night Atmosphere (finer threshold for smoother transitions)
      const dn = navState.dayNight;
      if (Math.abs(dn.dayNightProgress - lastAppliedDayNightRef.current) > 0.008) {
        lastAppliedDayNightRef.current = dn.dayNightProgress;
        const m = mapRef.current;

        const sp = (layerId: string, prop: string, val: any) => {
          if (m.getLayer(layerId)) {
            try { m.setPaintProperty(layerId, prop, val); } catch (e) {}
          }
        };

        monumentLightRef.current.night = dn.dayNightProgress;
        mapRef.current.triggerRepaint();
        sp('background', 'background-color', dn.backgroundColor);
        sp('landuse_residential', 'fill-color', dn.residentialColor);
        sp('landuse_park', 'fill-color', dn.residentialColor);
        sp('highway_minor', 'line-color', dn.minorRoadColor);
        sp('highway_major_inner', 'line-color', dn.majorRoadInnerColor);
        sp('highway_major_casing', 'line-color', dn.majorRoadCasingColor);
        sp('3d-buildings', 'fill-extrusion-color', dn.buildingColor);
        sp('nav-route-main', 'line-color', dn.routeColor);
        sp('nav-route-casing', 'line-color', dn.routeGlowColor);
        sp('street-lamps-glow', 'circle-opacity', dn.streetLampOpacity * 0.55);
        sp('street-lamps-core', 'circle-opacity', dn.streetLampOpacity * 0.80);

        m.setLight({
          anchor: 'map',
          color: dn.lightColor,
          intensity: dn.lightIntensity,
          position: dn.sunPosition,
        });

        if (onTimeChange) {
          onTimeChange(dn, navState.chapter, navState.traveledDistanceMeters, navState.isCenital);
        }
      }
    };

    updateLoop();

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      observer.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
      style={{ touchAction: 'pan-y' }}
    />
  );
});

UrboNavMap3D.displayName = 'UrboNavMap3D';

export default UrboNavMap3D;






