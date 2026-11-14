import React, { useEffect, useRef, useState } from 'react';
import { Map, NavigationControl, Marker, setWorkerUrl } from 'maplibre-gl';
import maplibreWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import { Radio, Navigation, Volume2, ShieldCheck, MapPin, Compass, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  setWorkerUrl(maplibreWorker);
}

interface CascoViejoMapProps {
  activeBus: '32' | '58';
  onBusSelect?: (bus: '32' | '58') => void;
  onMapReady?: () => void;
  className?: string;
}

// Plaza 24 de Septiembre landmark coordinates, Santa Cruz de la Sierra
const PLAZA_24_SEPT: [number, number] = [-63.182654, -17.783236];

// Snapped street geometry following Santa Cruz Casco Viejo transit corridor:
// Av. Cañoto -> Calle Junín -> 21 de Mayo (Plaza 24 de Septiembre) -> Calle Sucre -> Calle René Moreno -> Av. Irala
const CASCO_VIEJO_STREET_COORDINATES: [number, number][] = [
  [-63.189575, -17.78223],
  [-63.189074, -17.782197],
  [-63.18875, -17.78218],
  [-63.187241, -17.782081],
  [-63.18585, -17.781996],
  [-63.184988, -17.781941],
  [-63.18385, -17.781869],
  [-63.1833, -17.781834],
  [-63.182783, -17.781804],
  [-63.182753, -17.782143],
  [-63.182699, -17.782751],
  [-63.182654, -17.783236], // Plaza 24 de Septiembre
  [-63.182608, -17.783764],
  [-63.182565, -17.784218],
  [-63.182542, -17.784471],
  [-63.182511, -17.784808],
  [-63.1825, -17.784955],
  [-63.182415, -17.785901],
  [-63.181813, -17.78589],
  [-63.18134, -17.785882],
  [-63.18138, -17.785521],
  [-63.181413, -17.785213],
  [-63.181451, -17.78487],
  [-63.18155, -17.783799],
  [-63.180522, -17.78368],
  [-63.180422, -17.783736],
  [-63.18033, -17.784638],
  [-63.180272, -17.785188], // René Moreno & Suárez de Figueroa
  [-63.180209, -17.785776],
  [-63.180125, -17.786742],
  [-63.180041, -17.78759],
  [-63.179934, -17.78859],
  [-63.179865, -17.78929],
  [-63.179829, -17.789663],
  [-63.178934, -17.789444],
];

const ROUTE_LINE_30_GEOJSON: GeoJSON.Feature<GeoJSON.LineString> = {
  type: 'Feature',
  properties: {
    line: 'Línea 30 · Casco Viejo',
  },
  geometry: {
    type: 'LineString',
    coordinates: CASCO_VIEJO_STREET_COORDINATES,
  },
};

const BUS_LOCATIONS = {
  '32': {
    coords: [-63.182654, -17.783236] as [number, number],
    intern: 'INT 32',
    driver: 'Don Neyer',
    speed: '26 km/h',
    eta: '2 min',
    locationName: 'Plaza 24 de Septiembre (Calle Junín)',
  },
  '58': {
    coords: [-63.180272, -17.785188] as [number, number],
    intern: 'INT 58',
    driver: 'Don José Luis',
    speed: '22 km/h',
    eta: '6 min',
    locationName: 'Calle René Moreno y Suárez de Figueroa',
  },
};

// Interpolate position along route coordinates for the animated flow pulse
function getInterpolatedPoint(coords: [number, number][], progress: number): [number, number] {
  const total = coords.length - 1;
  const p = Math.max(0, Math.min(1, progress)) * total;
  const idx = Math.min(Math.floor(p), total - 1);
  const frac = p - idx;
  const c1 = coords[idx];
  const c2 = coords[idx + 1];
  return [
    c1[0] + (c2[0] - c1[0]) * frac,
    c1[1] + (c2[1] - c1[1]) * frac,
  ];
}

export const CascoViejoMap: React.FC<CascoViejoMapProps> = ({
  activeBus,
  onBusSelect,
  onMapReady,
  className,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const markersRef = useRef<{ [key: string]: Marker }>({});
  const flowDotMarkerRef = useRef<Marker | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<'32' | '58'>(activeBus);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // OpenFreeMap Dark Vector Style (Crisp contrast, no watermark, fast tile load)
    const map = new Map({
      container: mapContainerRef.current,
      style: 'https://tiles.openfreemap.org/styles/dark',
      center: PLAZA_24_SEPT,
      zoom: 15.3,
      pitch: 32,
      bearing: -12,
      attributionControl: true,
      scrollZoom: false,
      cooperativeGestures: true,
    });

    map.addControl(new NavigationControl({ showCompass: true, showZoom: true }), 'top-right');

    map.on('error', (e) => {
      console.warn('MapLibre GL Error:', e);
    });

    map.on('load', () => {
      setMapLoaded(true);
      if (onMapReady) onMapReady();

      // 1. ADD LÍNEA 30 STREET ROUTE
      if (!map.getSource('line-30-route')) {
        map.addSource('line-30-route', {
          type: 'geojson',
          data: ROUTE_LINE_30_GEOJSON,
        });

        // Ambient road glow casing (emerald #10B981)
        map.addLayer({
          id: 'line-30-glow',
          type: 'line',
          source: 'line-30-route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#059669',
            'line-width': 8,
            'line-opacity': 0.45,
            'line-blur': 3,
          },
        });

        // Crisp main street route line
        map.addLayer({
          id: 'line-30-main',
          type: 'line',
          source: 'line-30-route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#10B981',
            'line-width': 4.5,
          },
        });

        // Dashed animated flow guide layer
        map.addLayer({
          id: 'line-30-dash',
          type: 'line',
          source: 'line-30-route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#A7F3D0',
            'line-width': 2.5,
            'line-opacity': 0.85,
            'line-dasharray': [1, 2],
          },
        });
      }

      // 2. ANIMATED FLOW PULSE BEAD (Continuous gentle traveling light along the route)
      const flowEl = document.createElement('div');
      flowEl.className = 'route-flow-bead pointer-events-none select-none';
      flowEl.innerHTML = `
        <div class="relative flex items-center justify-center">
          <span class="absolute w-6 h-6 rounded-full bg-emerald-400/40 animate-ping" style="animation-duration: 1.5s;"></span>
          <div class="w-3.5 h-3.5 rounded-full bg-emerald-300 border-2 border-white shadow-[0_0_12px_#10B981]"></div>
        </div>
      `;
      const flowMarker = new Marker({ element: flowEl, anchor: 'center' })
        .setLngLat(CASCO_VIEJO_STREET_COORDINATES[0])
        .addTo(map);
      flowDotMarkerRef.current = flowMarker;

      let flowProgress = 0;
      let lastTime = performance.now();
      const animateRouteFlow = (time: number) => {
        const delta = (time - lastTime) / 1000;
        lastTime = time;
        // Complete route loop every 12 seconds (slow, elegant, legible)
        flowProgress = (flowProgress + delta / 12) % 1;
        const currentCoord = getInterpolatedPoint(CASCO_VIEJO_STREET_COORDINATES, flowProgress);
        flowMarker.setLngLat(currentCoord);
        animFrameRef.current = requestAnimationFrame(animateRouteFlow);
      };
      animFrameRef.current = requestAnimationFrame(animateRouteFlow);

      // 3. PLAZA 24 DE SEPTIEMBRE LANDMARK PIN
      const plazaEl = document.createElement('div');
      plazaEl.className = 'landmark-marker flex items-center justify-center pointer-events-none select-none';
      plazaEl.innerHTML = `
        <div style="background: rgba(15, 29, 54, 0.9); border: 1px solid rgba(16, 185, 129, 0.4); padding: 3px 8px; border-radius: 9999px; box-shadow: 0 4px 15px rgba(0,0,0,0.6); backdrop-filter: blur(8px);">
          <span style="font-size: 10px; font-weight: 700; color: #FAF5EC; font-family: Outfit, sans-serif; letter-spacing: 0.05em;">🏛 Plaza 24 de Septiembre</span>
        </div>
      `;
      new Marker({ element: plazaEl, anchor: 'center' })
        .setLngLat(PLAZA_24_SEPT)
        .addTo(map);

      // 4. ACTIVE BLUE GPS BEACON & BUS MARKERS (PUNTO AZUL PARPADEANTE)
      Object.entries(BUS_LOCATIONS).forEach(([id, bus]) => {
        const markerEl = document.createElement('div');
        markerEl.className = `bus-marker-${id} cursor-pointer group select-none`;
        
        markerEl.innerHTML = `
          <div class="relative flex flex-col items-center">
            <!-- Blue GPS Live Pulsing Beacon Wave -->
            <span class="absolute -top-3 w-10 h-10 rounded-full bg-cyan-400/35 animate-ping" style="animation-duration: 2s;"></span>
            <span class="absolute -top-2 w-7 h-7 rounded-full bg-cyan-500/40 blur-sm animate-pulse"></span>
            
            <!-- Main Bus Pill with Blue GPS Indicator Core -->
            <div class="relative z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F1D36] border border-cyan-400/70 shadow-[0_0_20px_rgba(6,182,212,0.6)] backdrop-blur-md transition-transform group-hover:scale-110">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-white shadow-[0_0_8px_#38BDF8] animate-pulse"></span>
              <span class="text-[11px] font-mono font-black text-white tracking-wider">${bus.intern}</span>
            </div>
            
            <!-- Anchor pointer dot -->
            <div class="w-2 h-2 rounded-full bg-cyan-400 border border-white shadow-[0_0_6px_#38BDF8] mt-0.5"></div>
          </div>
        `;

        markerEl.addEventListener('click', () => {
          setSelectedMarker(id as '32' | '58');
          if (onBusSelect) onBusSelect(id as '32' | '58');
        });

        const marker = new Marker({ element: markerEl, anchor: 'bottom' })
          .setLngLat(bus.coords)
          .addTo(map);

        markersRef.current[id] = marker;
      });
    });

    mapInstanceRef.current = map;

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      flowDotMarkerRef.current?.remove();
      Object.values(markersRef.current).forEach((m) => m.remove());
      map.remove();
    };
  }, []);

  // Center camera smoothly when active bus changes
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const bus = BUS_LOCATIONS[activeBus];
    if (bus) {
      mapInstanceRef.current.flyTo({
        center: bus.coords,
        zoom: 15.6,
        pitch: 34,
        speed: 1.1,
        curve: 1.4,
        essential: true,
      });
      setSelectedMarker(activeBus);
    }
  }, [activeBus, mapLoaded]);

  const activeInfo = BUS_LOCATIONS[selectedMarker || activeBus];

  return (
    <div className={cn('relative w-full h-full min-h-[460px] rounded-[30px] overflow-hidden bg-[#0A1220]', className)}>
      {/* Real MapLibre WebGL Canvas (Pure, Unobscured by Blurs or White Glare) */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px]" />

      {/* Loading state indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-[#0F1D36] pointer-events-none transition-opacity duration-700">
          <div className="relative w-14 h-14 rounded-full border border-emerald-500/30 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-emerald-400/40 animate-ping" style={{ animationDuration: '2.5s' }} />
            <Compass className="w-6 h-6 text-emerald-400 animate-spin" style={{ animationDuration: '7s' }} />
          </div>
          <span className="text-[10px] font-mono text-emerald-300 tracking-[0.2em] uppercase mt-3">
            CALIBRANDO CARTOGRAFÍA CASCO VIEJO
          </span>
        </div>
      )}

      {/* Top Left: Live Status Tag */}
      <div className="absolute top-3.5 left-3.5 z-10 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F1D36]/90 border border-emerald-500/40 text-white backdrop-blur-md shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-300">
            LÍNEA 30 · EN VIVO
          </span>
          <span className="text-[9px] font-mono text-slate-400 border-l border-white/15 pl-1.5 hidden sm:inline">
            CASCO VIEJO SCZ
          </span>
        </div>
      </div>

      {/* Top Right: Active GPS Beacon Indicator Tag */}
      <div className="absolute top-3.5 right-14 z-10 pointer-events-none hidden sm:block">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F1D36]/90 border border-cyan-400/40 text-cyan-300 text-[10px] font-mono backdrop-blur-md shadow-md pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <Wifi className="w-3 h-3 text-cyan-400" />
          <span>GPS ACTIVO 1 Hz</span>
        </div>
      </div>

      {/* Bottom HUD: Clean, High-Contrast Telemetry Card */}
      <div className="absolute bottom-3.5 inset-x-3.5 z-10 pointer-events-auto">
        <div className="rounded-2xl p-3.5 sm:p-4 bg-[#0F1D36]/95 border border-white/15 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                LÍNEA 30
              </span>
              <span className="text-xs sm:text-sm font-bold text-white font-mono">
                {activeInfo.intern} · {activeInfo.driver}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <span className="text-[10px] text-slate-400 font-normal">Llegada:</span>
              <span>{activeInfo.eta}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 font-sans truncate mb-2.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate">{activeInfo.locationName}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono pt-1">
            <div className="bg-white/5 rounded-lg py-1 px-1.5 border border-white/5">
              <span className="text-slate-400 block text-[9px]">Velocidad</span>
              <span className="text-white font-bold">{activeInfo.speed}</span>
            </div>
            <div className="bg-white/5 rounded-lg py-1 px-1.5 border border-white/5">
              <span className="text-slate-400 block text-[9px]">Frecuencia</span>
              <span className="text-emerald-400 font-bold">4.5 min</span>
            </div>
            <div className="bg-white/5 rounded-lg py-1 px-1.5 border border-white/5">
              <span className="text-slate-400 block text-[9px]">Punto GPS</span>
              <span className="text-cyan-400 font-bold">ACTIVO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
