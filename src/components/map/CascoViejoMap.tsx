import React, { useEffect, useRef, useState } from 'react';
import { Map, NavigationControl, Marker } from 'maplibre-gl';
import { Radio, Navigation, Volume2, ShieldCheck, MapPin, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CascoViejoMapProps {
  activeBus: '32' | '58';
  onBusSelect?: (bus: '32' | '58') => void;
  className?: string;
}

// Key coordinates around Plaza 24 de Septiembre, Casco Viejo, Santa Cruz de la Sierra
const PLAZA_24_SEPT: [number, number] = [-63.18212, -17.78329];

// Simulated real street path for Línea 30 through Casco Viejo
// Starting from 1er Anillo / Calle Junin, passing Plaza 24 de Septiembre, turning down Rene Moreno
const ROUTE_LINE_30_GEOJSON: GeoJSON.Feature<GeoJSON.LineString> = {
  type: 'Feature',
  properties: {
    line: 'Línea 30',
    color: '#00C9A7',
  },
  geometry: {
    type: 'LineString',
    coordinates: [
      [-63.1865, -17.7810], // Junín entrance
      [-63.1848, -17.7820],
      [-63.1832, -17.7828],
      [-63.18212, -17.78329], // Plaza 24 de Septiembre corner
      [-63.1812, -17.7837],
      [-63.1804, -17.7852], // René Moreno down towards south
      [-63.1798, -17.7870],
      [-63.1790, -17.7892],
    ],
  },
};

const BUS_LOCATIONS = {
  '32': {
    coords: [-63.18212, -17.78329] as [number, number],
    intern: 'INT 32',
    driver: 'Don Neyer',
    speed: '26 km/h',
    eta: '2 min',
    locationName: 'Plaza 24 de Septiembre (Calle Junín)',
  },
  '58': {
    coords: [-63.1804, -17.7852] as [number, number],
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
  className,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const markersRef = useRef<{ [key: string]: Marker }>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<'32' | '58' | null>('32');

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // OpenStreetMap & CARTO Dark high-performance vector-raster tiles (No watermark, clean dark streets)
    const map = new Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}@2x.png',
              'https://c.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}@2x.png',
              'https://d.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}@2x.png',
            ],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          },
          'carto-dark': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            ],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          },
        },
        layers: [
          {
            id: 'carto-dark-layer',
            type: 'raster',
            source: 'carto-dark',
            minzoom: 0,
            maxzoom: 20,
          },
        ],
      },
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
    <div className={cn('relative w-full h-full min-h-[460px] rounded-[32px] overflow-hidden border border-white/15 shadow-2xl', className)}>
      {/* Real Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px]" />

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
