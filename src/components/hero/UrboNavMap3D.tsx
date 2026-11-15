import React, { useEffect, useRef, useState } from 'react';
import { Map, Marker, setWorkerUrl } from 'maplibre-gl';
import maplibreWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import {
  SANTA_CRUZ_NAV_ROUTE,
  NAV_ROUTE_GEOJSON,
  CATEDRAL_COORDS,
  CRISTO_COORDS,
  getNavStateAtProgress,
} from './SantaCruzNavData';

if (typeof window !== 'undefined') {
  setWorkerUrl(maplibreWorker);
}

interface UrboNavMap3DProps {
  scrollProgress: number; // 0 to 1
  className?: string;
  onReady?: () => void;
}

export const UrboNavMap3D: React.FC<UrboNavMap3DProps> = ({
  scrollProgress,
  className = '',
  onReady,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const gpsMarkerRef = useRef<Marker | null>(null);
  const catedralMarkerRef = useRef<Marker | null>(null);
  const cristoMarkerRef = useRef<Marker | null>(null);
  const isMapLoadedRef = useRef(false);
  const isVisibleRef = useRef(true);
  const rafIdRef = useRef<number | null>(null);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  // Sync prop changes
  useEffect(() => {
    targetProgressRef.current = Math.max(0, Math.min(1, scrollProgress));
  }, [scrollProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initialState = getNavStateAtProgress(0);

    // Initialize MapLibre GL instance
    const map = new Map({
      container,
      style: 'https://tiles.openfreemap.org/styles/dark',
      center: initialState.center,
      zoom: initialState.zoom,
      pitch: initialState.pitch,
      bearing: initialState.bearing,
      interactive: false, // Scroll controls the camera
      attributionControl: false,
    });
    mapRef.current = map;

    map.on('error', (e) => {
      console.warn('UrboNavMap3D MapLibre Notice:', e);
    });

    map.on('load', () => {
      isMapLoadedRef.current = true;

      // 1. ADD REALISTIC 3D BUILDING EXTRUSION LAYER (Google Maps 3D aesthetics)
      // Subtle architectural slate buildings with restrained heights
      if (!map.getLayer('3d-buildings')) {
        map.addLayer(
          {
            id: '3d-buildings',
            source: 'openmaptiles',
            'source-layer': 'building',
            type: 'fill-extrusion',
            minzoom: 13,
            paint: {
              // Subtle architectural palette: slate-navy #172436 to #1E2D44
              'fill-extrusion-color': [
                'interpolate',
                ['linear'],
                ['zoom'],
                13,
                '#101C2E',
                16,
                '#19293F',
                18,
                '#21344E',
              ],
              // Realistic contextual building heights (modest 8m - 28m typical of SCZ)
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                13,
                0,
                15,
                ['case', ['has', 'render_height'], ['get', 'render_height'], 12],
                17,
                ['case', ['has', 'render_height'], ['get', 'render_height'], 16],
              ],
              'fill-extrusion-base': [
                'case',
                ['has', 'render_min_height'],
                ['get', 'render_min_height'],
                0,
              ],
              'fill-extrusion-opacity': 0.78,
            },
          },
          'highway_motorway_inner' // Place under major street labels if any
        );
      }

      // 2. ADD NAVIGATION STREET ROUTE LAYERS (Real OpenStreetMap Geometry)
      if (!map.getSource('nav-route-source')) {
        map.addSource('nav-route-source', {
          type: 'geojson',
          data: NAV_ROUTE_GEOJSON,
        });

        // Layer A: Road Casing Glow (Soft dark teal aura)
        map.addLayer({
          id: 'nav-route-casing',
          type: 'line',
          source: 'nav-route-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#009E85',
            'line-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14,
              8,
              16,
              14,
              18,
              20,
            ],
            'line-opacity': 0.35,
            'line-blur': 4,
          },
        });

        // Layer B: Crisp Navigation Route Line (URBO Cyan #38BDF8)
        map.addLayer({
          id: 'nav-route-main',
          type: 'line',
          source: 'nav-route-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#38BDF8',
            'line-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14,
              4.5,
              16,
              7.5,
              18,
              11,
            ],
            'line-opacity': 0.95,
          },
        });

        // Layer C: Inner Core Luminous Accent
        map.addLayer({
          id: 'nav-route-inner-core',
          type: 'line',
          source: 'nav-route-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#FFFFFF',
            'line-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14,
              1.8,
              16,
              2.8,
              18,
              4.0,
            ],
            'line-opacity': 0.85,
          },
        });
      }

      // 3. ADD LANDMARK MARKER: CATEDRAL METROPOLITANA DE SAN LORENZO
      const catedralEl = document.createElement('div');
      catedralEl.className = 'catedral-landmark-marker pointer-events-none select-none';
      catedralEl.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 9999px;
          background: rgba(11, 20, 38, 0.92);
          border: 1.5px solid rgba(0, 229, 190, 0.6);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.7), 0 0 15px rgba(0, 201, 167, 0.4);
          color: #FFFFFF;
          font-family: 'Space Grotesk', Outfit, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          white-space: nowrap;
          transform: translateY(-8px);
        ">
          <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#00E5BE; box-shadow:0 0 8px #00E5BE;"></span>
          <span>🏛 Catedral Metropolitana</span>
        </div>
      `;
      catedralMarkerRef.current = new Marker({ element: catedralEl, anchor: 'bottom' })
        .setLngLat(CATEDRAL_COORDS)
        .addTo(map);

      // 4. ADD LANDMARK MARKER: MONUMENTO CRISTO REDENTOR
      const cristoEl = document.createElement('div');
      cristoEl.className = 'cristo-landmark-marker pointer-events-none select-none';
      cristoEl.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 9999px;
          background: rgba(11, 20, 38, 0.92);
          border: 1.5px solid rgba(56, 189, 248, 0.6);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.7), 0 0 15px rgba(56, 189, 248, 0.4);
          color: #FFFFFF;
          font-family: 'Space Grotesk', Outfit, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          white-space: nowrap;
          transform: translateY(-8px);
        ">
          <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#38BDF8; box-shadow:0 0 8px #38BDF8;"></span>
          <span>✝ Monumento Cristo Redentor</span>
        </div>
      `;
      cristoMarkerRef.current = new Marker({ element: cristoEl, anchor: 'bottom' })
        .setLngLat(CRISTO_COORDS)
        .addTo(map);

      // 5. ADD PROTAGONIST BLUE GPS NAVIGATION BEACON (Google Maps style)
      const gpsEl = document.createElement('div');
      gpsEl.className = 'gps-nav-beacon-container pointer-events-none select-none';
      gpsEl.style.width = '38px';
      gpsEl.style.height = '38px';
      gpsEl.style.position = 'relative';
      gpsEl.style.display = 'flex';
      gpsEl.style.alignItems = 'center';
      gpsEl.style.justifyContent = 'center';
      gpsEl.innerHTML = `
        <!-- Soft animated aura pulse -->
        <div style="
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(56, 189, 248, 0.35);
          animation: gpsAuraPulse 2.2s ease-out infinite;
        "></div>
        <!-- Outer solid cyan border ring -->
        <div style="
          position: absolute;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #38BDF8;
          box-shadow: 0 0 20px #38BDF8, 0 0 35px rgba(56, 189, 248, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2.5px solid #FFFFFF;
        ">
          <!-- Inner solid dot -->
          <div style="
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #FFFFFF;
          "></div>
        </div>
      `;

      gpsMarkerRef.current = new Marker({ element: gpsEl, anchor: 'center' })
        .setLngLat(initialState.beacon)
        .addTo(map);

      if (onReady) onReady();
    });

    // Observer to pause animation loop when off-screen
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    observer.observe(container);

    // Continuous Animation Loop (Interpolates Camera and Beacon smoothly)
    const updateLoop = () => {
      rafIdRef.current = requestAnimationFrame(updateLoop);
      if (!isVisibleRef.current || !isMapLoadedRef.current || !mapRef.current) return;

      const target = targetProgressRef.current;
      // Smooth lerp (factor 0.08)
      currentProgressRef.current += (target - currentProgressRef.current) * 0.08;
      const p = currentProgressRef.current;

      const navState = getNavStateAtProgress(p);

      // 1. Move GPS Beacon along real street coordinates (beacon point)
      if (gpsMarkerRef.current) {
        gpsMarkerRef.current.setLngLat(navState.beacon);
      }

      // 2. Smoothly Update Map Camera to look-ahead center (Google Maps navigation perspective)
      mapRef.current.jumpTo({
        center: navState.center,
        bearing: navState.bearing,
        pitch: navState.pitch,
        zoom: navState.zoom,
      });
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
};
export default UrboNavMap3D;
