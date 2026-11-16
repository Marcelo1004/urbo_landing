import React, { useEffect, useRef } from 'react';
import { Map, Marker, setWorkerUrl } from 'maplibre-gl';
import maplibreWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import {
  NAV_ROUTE_GEOJSON,
  CATEDRAL_COORDS,
  ESTUDIANTE_COORDS,
  CRISTO_COORDS,
  TERCER_ANILLO_COORDS,
  CUARTO_ANILLO_COORDS,
  STREET_LAMPS_GEOJSON,
  URBAN_GREENERY_GEOJSON,
  PEDESTRIANS_DATA,
  getNavStateAtProgress,
  DayNightVisuals,
} from './SantaCruzNavData';

if (typeof window !== 'undefined') {
  setWorkerUrl(maplibreWorker);
}

interface UrboNavMap3DProps {
  scrollProgress: number; // 0 to 1
  className?: string;
  onReady?: () => void;
  onTimeChange?: (visuals: DayNightVisuals, chapter: number, distMeters: number) => void;
}

export const UrboNavMap3D: React.FC<UrboNavMap3DProps> = ({
  scrollProgress,
  className = '',
  onReady,
  onTimeChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const gpsMarkerRef = useRef<Marker | null>(null);
  const landmarkMarkersRef = useRef<Marker[]>([]);
  const pedestrianMarkersRef = useRef<Marker[]>([]);

  const isMapLoadedRef = useRef(false);
  const isVisibleRef = useRef(true);
  const rafIdRef = useRef<number | null>(null);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastAppliedDayNightRef = useRef<number>(-1);

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
      interactive: false,
      attributionControl: false,
    });
    mapRef.current = map;

    map.on('error', (e) => {
      // Ignore missing optional sprite warnings
      if (!e?.error?.message?.includes('sprite')) {
        console.warn('UrboNavMap3D Notice:', e);
      }
    });

    map.on('load', () => {
      isMapLoadedRef.current = true;

      // 1. ADD URBAN GREENERY LAYER (Plazas & Boulevards of Santa Cruz)
      if (!map.getSource('urban-greenery-source')) {
        map.addSource('urban-greenery-source', {
          type: 'geojson',
          data: URBAN_GREENERY_GEOJSON,
        });

        // Greenery Fill (Polygons: Plaza 24, Plaza del Estudiante, Cristo Redentor garden)
        map.addLayer({
          id: 'urban-greenery-fill',
          type: 'fill',
          source: 'urban-greenery-source',
          filter: ['!=', '$type', 'LineString'],
          paint: {
            'fill-color': '#059669',
            'fill-opacity': 0.45,
          },
        });

        // Greenery Median Boulevard Line (Av. Monseñor Rivero camellón central)
        map.addLayer({
          id: 'urban-greenery-median',
          type: 'line',
          source: 'urban-greenery-source',
          filter: ['==', '$type', 'LineString'],
          paint: {
            'line-color': '#10B981',
            'line-width': 6,
            'line-opacity': 0.65,
            'line-blur': 2,
          },
        });
      }

      // 2. ADD REALISTIC 3D BUILDING EXTRUSION LAYER (Google Maps 3D aesthetics)
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
                'interpolate',
                ['linear'],
                ['zoom'],
                13,
                0,
                15,
                ['case', ['has', 'render_height'], ['get', 'render_height'], 11],
                17,
                ['case', ['has', 'render_height'], ['get', 'render_height'], 15],
              ],
              'fill-extrusion-base': [
                'case',
                ['has', 'render_min_height'],
                ['get', 'render_min_height'],
                0,
              ],
              'fill-extrusion-opacity': 0.82,
            },
          },
          'highway_motorway_inner'
        );
      }

      // 3. ADD NAVIGATION ROUTE LAYERS (5.042 km Continuous OSM Geometry)
      if (!map.getSource('nav-route-source')) {
        map.addSource('nav-route-source', {
          type: 'geojson',
          data: NAV_ROUTE_GEOJSON,
        });

        // Layer A: Route Casing Glow
        map.addLayer({
          id: 'nav-route-casing',
          type: 'line',
          source: 'nav-route-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': initialState.dayNight.routeGlowColor,
            'line-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              13,
              6,
              15,
              12,
              17,
              18,
            ],
            'line-opacity': 0.40,
            'line-blur': 4,
          },
        });

        // Layer B: Main Navigation Route Line
        map.addLayer({
          id: 'nav-route-main',
          type: 'line',
          source: 'nav-route-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': initialState.dayNight.routeColor,
            'line-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              13,
              3.5,
              15,
              6.5,
              17,
              9.5,
            ],
            'line-opacity': 0.95,
          },
        });

        // Layer C: Core Luminous Accent
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
              13,
              1.2,
              15,
              2.2,
              17,
              3.4,
            ],
            'line-opacity': 0.90,
          },
        });
      }

      // 4. ADD STREET LAMPS LAYER (Alumbrado Público along Monseñor Rivero & Cristo Redentor)
      if (!map.getSource('street-lamps-source')) {
        map.addSource('street-lamps-source', {
          type: 'geojson',
          data: STREET_LAMPS_GEOJSON,
        });

        // Ambient Lamp Glow (Soft Amber Aura active at sunset & night)
        map.addLayer({
          id: 'street-lamps-glow',
          type: 'circle',
          source: 'street-lamps-source',
          paint: {
            'circle-color': '#FBBF24',
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14,
              3,
              16,
              7,
              18,
              12,
            ],
            'circle-opacity': initialState.dayNight.streetLampOpacity * 0.75,
            'circle-blur': 0.8,
          },
        });

        // Pinpoint Core Lamp Bulb
        map.addLayer({
          id: 'street-lamps-core',
          type: 'circle',
          source: 'street-lamps-source',
          paint: {
            'circle-color': '#FFFBEB',
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14,
              1.5,
              16,
              2.5,
              18,
              3.5,
            ],
            'circle-opacity': initialState.dayNight.streetLampOpacity,
          },
        });
      }

      // 5. INITIALIZE MAP LIGHT FOR 3D SHADING
      map.setLight({
        anchor: 'map',
        color: initialState.dayNight.lightColor,
        intensity: initialState.dayNight.lightIntensity,
        position: [1.3, 180, 50],
      });

      // 6. ADD 5 KEY LANDMARK MARKERS ALONG THE 5KM CORRIDOR
      const landmarks = [
        {
          coords: CATEDRAL_COORDS,
          name: 'Catedral Metropolitana',
          badge: '01 · Casco Viejo',
          color: '#00E5BE',
          icon: '🏛',
        },
        {
          coords: ESTUDIANTE_COORDS,
          name: 'Plaza del Estudiante',
          badge: '02 · 1er Anillo',
          color: '#38BDF8',
          icon: '🎓',
        },
        {
          coords: CRISTO_COORDS,
          name: 'Monumento Cristo Redentor',
          badge: '03 · 2do Anillo',
          color: '#F4C430',
          icon: '✝',
        },
        {
          coords: TERCER_ANILLO_COORDS,
          name: 'Av. Banzer / 3er Anillo',
          badge: '04 · Zona Norte',
          color: '#38BDF8',
          icon: '🧭',
        },
        {
          coords: CUARTO_ANILLO_COORDS,
          name: 'Viaducto Cuarto Anillo',
          badge: '05 · Corredor Metropolitano',
          color: '#00E5BE',
          icon: '🚀',
        },
      ];

      landmarkMarkersRef.current = landmarks.map((lm) => {
        const el = document.createElement('div');
        el.className = 'landmark-marker-pill pointer-events-none select-none transition-transform duration-300';
        el.innerHTML = `
          <div style="
            display: flex;
            align-items: center;
            gap: 7px;
            padding: 5px 12px;
            border-radius: 9999px;
            background: rgba(11, 20, 38, 0.94);
            border: 1.5px solid ${lm.color}80;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8), 0 0 14px ${lm.color}40;
            color: #FFFFFF;
            font-family: 'Space Grotesk', Outfit, sans-serif;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.04em;
            white-space: nowrap;
            transform: translateY(-8px);
          ">
            <span>${lm.icon}</span>
            <span style="color:${lm.color}; font-size:10px; font-family:monospace; margin-right:2px;">[${lm.badge}]</span>
            <span>${lm.name}</span>
          </div>
        `;
        return new Marker({ element: el, anchor: 'bottom' })
          .setLngLat(lm.coords)
          .addTo(map);
      });

      // 7. ADD STYLIZED PEDESTRIANS IN PLAZA 24 & PLAZA DEL ESTUDIANTE
      pedestrianMarkersRef.current = PEDESTRIANS_DATA.map((ped) => {
        const pEl = document.createElement('div');
        pEl.className = 'pedestrian-dot pointer-events-none select-none';
        pEl.style.width = '6px';
        pEl.style.height = '6px';
        pEl.style.borderRadius = '50%';
        pEl.style.background = '#38BDF8';
        pEl.style.boxShadow = '0 0 6px #38BDF8';
        pEl.style.border = '1px solid #FFFFFF';
        return new Marker({ element: pEl, anchor: 'center' })
          .setLngLat(ped.base as [number, number])
          .addTo(map);
      });

      // 8. ADD PROTAGONIST BLUE GPS BEACON (Google Maps style)
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
      if (onTimeChange) {
        onTimeChange(initialState.dayNight, initialState.chapter, initialState.traveledDistanceMeters);
      }
    });

    // Observer to pause animation loop when off-screen
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    observer.observe(container);

    let animationTime = 0;

    // Continuous 60fps RAF Animation Loop
    const updateLoop = () => {
      rafIdRef.current = requestAnimationFrame(updateLoop);
      if (!isVisibleRef.current || !isMapLoadedRef.current || !mapRef.current) return;

      animationTime += 0.02;

      // Animate stylized pedestrians along plaza paths
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
      // Smooth lerp for camera & beacon
      currentProgressRef.current += (target - currentProgressRef.current) * 0.08;
      const p = currentProgressRef.current;

      const navState = getNavStateAtProgress(p);

      // 1. Move GPS Beacon along real street coordinates
      if (gpsMarkerRef.current) {
        gpsMarkerRef.current.setLngLat(navState.beacon);
      }

      // 2. Smoothly Update Map Camera to look-ahead center (Google Maps 3D navigation perspective)
      mapRef.current.jumpTo({
        center: navState.center,
        bearing: navState.bearing,
        pitch: navState.pitch,
        zoom: navState.zoom,
      });

      // 3. Dynamic Day-to-Night Transitions (Throttled for maximum 60fps performance)
      const dn = navState.dayNight;
      if (Math.abs(dn.dayNightProgress - lastAppliedDayNightRef.current) > 0.015) {
        lastAppliedDayNightRef.current = dn.dayNightProgress;

        // Update 3D buildings color
        if (mapRef.current.getLayer('3d-buildings')) {
          mapRef.current.setPaintProperty('3d-buildings', 'fill-extrusion-color', dn.buildingColor);
        }

        // Update navigation route colors
        if (mapRef.current.getLayer('nav-route-main')) {
          mapRef.current.setPaintProperty('nav-route-main', 'line-color', dn.routeColor);
        }
        if (mapRef.current.getLayer('nav-route-casing')) {
          mapRef.current.setPaintProperty('nav-route-casing', 'line-color', dn.routeGlowColor);
        }

        // Update street lamps illumination
        if (mapRef.current.getLayer('street-lamps-glow')) {
          mapRef.current.setPaintProperty('street-lamps-glow', 'circle-opacity', dn.streetLampOpacity * 0.75);
        }
        if (mapRef.current.getLayer('street-lamps-core')) {
          mapRef.current.setPaintProperty('street-lamps-core', 'circle-opacity', dn.streetLampOpacity);
        }

        // Update 3D map lighting
        mapRef.current.setLight({
          anchor: 'map',
          color: dn.lightColor,
          intensity: dn.lightIntensity,
          position: [1.3, 180 - dn.dayNightProgress * 90, 50 - dn.dayNightProgress * 25],
        });

        // Notify parent hero for HUD telemetry & atmosphere updates
        if (onTimeChange) {
          onTimeChange(dn, navState.chapter, navState.traveledDistanceMeters);
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
};

export default UrboNavMap3D;
