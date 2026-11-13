import React, { useEffect, useRef, useState } from 'react';
import { Map, NavigationControl, Marker, setWorkerUrl } from 'maplibre-gl';
import maplibreWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import { Radio, Navigation, Volume2, ShieldCheck, MapPin, Compass } from 'lucide-react';
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

// Key coordinates around Plaza 24 de Septiembre, Casco Viejo, Santa Cruz de la Sierra
const PLAZA_24_SEPT: [number, number] = [-63.182654, -17.783236];

// Snapped real street coordinates strictly following the actual road network of Santa Cruz Casco Viejo:
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
  [-63.182654, -17.783236], // Plaza 24 de Septiembre (Don Neyer / Int 32)
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
  [-63.180272, -17.785188], // René Moreno & Suárez de Figueroa (Don José Luis / Int 58)
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
    line: 'Línea 30',
    color: '#00C9A7',
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

export const CascoViejoMap: React.FC<CascoViejoMapProps> = ({
  activeBus,
  onBusSelect,
  onMapReady,
  className,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const markersRef = useRef<{ [key: string]: Marker }>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<'32' | '58' | null>('32');

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Official OpenFreeMap Dark Vector Style (100% Free, No API Key, No Watermark)
    const map = new Map({
      container: mapContainerRef.current,
      style: 'https://tiles.openfreemap.org/styles/dark',
      center: PLAZA_24_SEPT,
      zoom: 15.3,
      pitch: 35,
      bearing: -12,
      attributionControl: true,
      scrollZoom: false, // Prevents hijacking page scroll
      cooperativeGestures: true,
    });

    map.addControl(new NavigationControl({ showCompass: true, showZoom: true }), 'top-right');

    map.on('error', (e) => {
      console.warn('MapLibre GL Error:', e);
    });

    map.on('load', () => {
      console.log('MapLibre GL Loaded successfully!');
      setMapLoaded(true);
      if (onMapReady) onMapReady();

      // Add Línea 30 Route Layer
      if (!map.getSource('line-30-route')) {
        map.addSource('line-30-route', {
          type: 'geojson',
          data: ROUTE_LINE_30_GEOJSON,
        });

        // Glow casing layer
        map.addLayer({
          id: 'line-30-glow',
          type: 'line',
          source: 'line-30-route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#00E5BE',
            'line-width': 7,
            'line-opacity': 0.35,
            'line-blur': 4,
          },
        });

        // Main crisp line
        map.addLayer({
          id: 'line-30-main',
          type: 'line',
          source: 'line-30-route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#00C9A7',
            'line-width': 3.5,
          },
        });
      }

      // Add Plaza 24 de Septiembre Landmark Marker
      const plazaEl = document.createElement('div');
      plazaEl.className = 'landmark-marker flex items-center justify-center';
      plazaEl.innerHTML = `
        <div style="background: rgba(11,20,38,0.85); border: 1px solid rgba(0,201,167,0.4); padding: 4px 8px; border-radius: 9999px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); backdrop-filter: blur(8px);">
          <span style="font-size: 10px; font-weight: 700; color: #FFFFFF; font-family: Outfit, sans-serif; letter-spacing: 0.05em;">🏛 Plaza 24 de Septiembre</span>
        </div>
      `;
      new Marker({ element: plazaEl, anchor: 'center' })
        .setLngLat(PLAZA_24_SEPT)
        .addTo(map);

      // Create Custom Bus Markers (32 & 58)
      Object.entries(BUS_LOCATIONS).forEach(([id, bus]) => {
        const markerEl = document.createElement('div');
        markerEl.className = `bus-marker-${id} cursor-pointer group`;
        markerEl.innerHTML = `
          <div class="relative flex items-center justify-center">
            <span class="absolute -inset-2 rounded-full bg-urbo-teal/30 animate-ping"></span>
            <div style="background: linear-gradient(135deg, #00E5BE, #00C9A7); width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(0,201,167,0.8); border: 2px solid #FFFFFF;">
              <span style="font-size: 11px; font-weight: 800; color: #070B14; font-family: monospace;">${id}</span>
            </div>
          </div>
        `;

        markerEl.addEventListener('click', () => {
          setSelectedMarker(id as '32' | '58');
          if (onBusSelect) onBusSelect(id as '32' | '58');
        });

        const marker = new Marker({ element: markerEl, anchor: 'center' })
          .setLngLat(bus.coords)
          .addTo(map);

        markersRef.current[id] = marker;
      });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // When active bus changes from outer props, smoothly center on it
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const bus = BUS_LOCATIONS[activeBus];
    if (bus) {
      mapInstanceRef.current.flyTo({
        center: bus.coords,
        zoom: 15.6,
        pitch: 38,
        speed: 1.2,
        curve: 1.4,
        essential: true,
      });
      setSelectedMarker(activeBus);
    }
  }, [activeBus, mapLoaded]);

  const activeInfo = BUS_LOCATIONS[selectedMarker || activeBus];

  return (
    <div className={cn('relative w-full h-full min-h-[460px] rounded-[32px] overflow-hidden border border-white/15 shadow-2xl bg-slate-950', className)}>
      {/* Real Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px]" />

      {/* Tactical Radar Fallback while map tiles calibrate */}
      {!mapLoaded && (
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-slate-950/95 pointer-events-none transition-opacity duration-700">
          <div className="relative w-16 h-16 rounded-full border border-urbo-teal/20 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-urbo-teal/40 animate-ping" style={{ animationDuration: '3s' }} />
            <Compass className="w-7 h-7 text-urbo-teal animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <span className="text-[10px] font-mono text-slate-400 tracking-[0.2em] uppercase mt-3">
            CALIBRANDO CARTOGRAFÍA CASCO VIEJO
          </span>
        </div>
      )}

      {/* Top Overlay: Demonstration Indicator & Casco Viejo Label */}
      <div className="absolute top-3 left-3 right-14 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-urbo-teal/30 text-white backdrop-blur-md shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-urbo-teal2 animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-urbo-teal2">
            VISTA DEMOSTRATIVA · CASCO VIEJO SCZ
          </span>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/70 border border-white/10 text-[10px] font-mono text-slate-300 backdrop-blur-md pointer-events-auto">
          <MapPin className="w-3 h-3 text-urbo-amber" />
          <span>Plaza 24 de Septiembre</span>
        </div>
      </div>

      {/* Bottom Floating Glass Card: Active Bus Telemetry HUD */}
      <div className="absolute bottom-3 inset-x-3 z-10 pointer-events-auto">
        <div className="liquid-glass-elevated rounded-2xl p-3.5 sm:p-4 border-white/15 backdrop-blur-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-urbo-teal/20 border border-urbo-teal/30 text-urbo-teal2 font-mono text-xs font-bold">
                LÍNEA 30
              </span>
              <span className="text-xs sm:text-sm font-bold text-white font-mono">
                {activeInfo.intern} · {activeInfo.driver}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-urbo-teal2">
              Llegada: {activeInfo.eta}
            </span>
          </div>

          <div className="text-[11px] text-slate-300 font-sans truncate mb-2.5">
            📍 {activeInfo.locationName}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-slate-300 pt-2 border-t border-white/10">
            <div>
              <span className="text-slate-400 block text-[9px]">Velocidad</span>
              <span className="text-white font-bold">{activeInfo.speed}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">Frecuencia</span>
              <span className="text-urbo-teal2 font-bold">4.5 min</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">Telemetría</span>
              <span className="text-urbo-amber font-bold">GPS ACTIVO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
