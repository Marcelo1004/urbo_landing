import React, { useEffect, useRef, useState } from 'react';
import { Map, NavigationControl, Marker, setWorkerUrl } from 'maplibre-gl';
import maplibreWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import { GlassBadge, GlassButton } from '@/components/ui/Glass';
import { 
  Bus, 
  MapPin, 
  Navigation, 
  Sparkles, 
  RotateCcw, 
  ChevronRight,
  Radio
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import STREET_ROUTE_COORDS from '@/data/roadmap-street-route.json';

gsap.registerPlugin(ScrollTrigger);

if (typeof window !== 'undefined') {
  setWorkerUrl(maplibreWorker);
}

// 5 Stations along the Santa Cruz Road Network (Snapped to exact street intersections)
export interface StationData {
  id: string;
  stepNumber: number;
  phase: string;
  title: string;
  description: string;
  locationName: string;
  coords: [number, number]; // [lng, lat]
  status: 'completed' | 'active' | 'projected';
  metric: string;
  progressRatio: number; // progress along street path
}

const ROADMAP_STATIONS: StationData[] = [
  {
    id: '01',
    stepNumber: 1,
    phase: 'Fase 1',
    title: 'Validación de campo',
    description: '92 encuestas presenciales · 9 choferes asociados · grupo piloto de validación activa en Línea 30.',
    locationName: '1er Anillo Norte / Av. Busch',
    coords: [-63.19345, -17.773439],
    status: 'completed',
    metric: '140 usuarios · 5 meses en calle',
    progressRatio: 0.0,
  },
  {
    id: '02',
    stepNumber: 2,
    phase: 'Fase 2',
    title: 'MVP técnico integrado',
    description: 'App de pasajero, app de chofer con aviso por voz manos libres y telemetría activa en tiempo real.',
    locationName: 'Calle Junín / Calle 21 de Mayo',
    coords: [-63.185488, -17.781973],
    status: 'completed',
    metric: 'Telemetría GPS + Síntesis de voz',
    progressRatio: 0.214,
  },
  {
    id: '03',
    stepNumber: 3,
    phase: 'Fase 3',
    title: 'Google Play Store',
    description: 'Fase de closed testing con usuarios reales de calle · despliegue oficial para Santa Cruz de la Sierra.',
    locationName: 'Plaza 24 de Septiembre (Km 0)',
    coords: [-63.182646, -17.783332],
    status: 'active',
    metric: 'Closed testing activo en ruta',
    progressRatio: 0.261,
  },
  {
    id: '04',
    stepNumber: 4,
    phase: 'Fase 4',
    title: 'Escalabilidad Santa Cruz',
    description: 'Integración progresiva de 10+ líneas troncales metropolitanas · alianzas estratégicas de ruta.',
    locationName: '2do Anillo / Av. Cristo Redentor',
    coords: [-63.175898, -17.766539],
    status: 'projected',
    metric: '10+ Líneas troncales objetivo',
    progressRatio: 0.672,
  },
  {
    id: '05',
    stepNumber: 5,
    phase: 'Fase 5',
    title: 'Expansión regional',
    description: 'Cochabamba, La Paz y principales capitales de Latinoamérica con transporte público de alta demanda.',
    locationName: 'Eje Metropolitano Santa Cruz / Warnes',
    coords: [-63.166999, -17.748984],
    status: 'projected',
    metric: 'Cochabamba · La Paz · Latam',
    progressRatio: 1.0,
  },
];

const CORRIDOR_COORDINATES: [number, number][] = STREET_ROUTE_COORDS as [number, number][];

// Helper to interpolate position along exact street coordinate array
function getInterpolatedStreetPoint(coords: [number, number][], progress: number): [number, number] {
  const totalSegments = coords.length - 1;
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const exactIndex = clampedProgress * totalSegments;
  const index = Math.min(Math.floor(exactIndex), totalSegments - 1);
  const t = exactIndex - index;

  const p1 = coords[index];
  const p2 = coords[index + 1];

  const lng = p1[0] + (p2[0] - p1[0]) * t;
  const lat = p1[1] + (p2[1] - p1[1]) * t;

  return [lng, lat];
}

export const Roadmap: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const gpsDotMarkerRef = useRef<Marker | null>(null);
  const stationMarkersRef = useRef<Marker[]>([]);
  
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isProjected, setIsProjected] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState<string>('03'); // Default to Phase 3 (Current)
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldInitMap, setShouldInitMap] = useState(false);

  // Exact Progress values for Phase 3 (Active) and Phase 5 (Projected)
  const REAL_PROGRESS = ROADMAP_STATIONS[2].progressRatio; // 0.261
  const PROJECTED_PROGRESS = 1.0;

  // GSAP animated progress holder
  const progressHolder = useRef<{ p: number }>({ p: REAL_PROGRESS });

  // Lazy Initialization: Mount WebGL context only when user scrolls near #roadmap section
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldInitMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: '350px' }
    );

    observer.observe(sec);
    return () => observer.disconnect();
  }, []);

  // 1. Initialize MapLibre with Santa Cruz Street Network (Deferred for 60fps initial paint)
  useEffect(() => {
    if (!shouldInitMap || !mapContainerRef.current) return;

    const map = new Map({
      container: mapContainerRef.current,
      style: 'https://tiles.openfreemap.org/styles/dark',
      center: [-63.182646, -17.783332], // Centered at Plaza 24 de Septiembre
      zoom: 14.3,
      pitch: 42,
      bearing: -16,
      attributionControl: true,
      scrollZoom: false, // Prevents taking over page scroll
      cooperativeGestures: true,
    });

    map.addControl(new NavigationControl({ showCompass: true, showZoom: true }), 'top-right');

    map.on('load', () => {
      setMapLoaded(true);

      // Add Real Road Geometry Route Source
      map.addSource('roadmap-street-corridor', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: CORRIDOR_COORDINATES,
          },
        },
      });

      // Layer 1: Ambient road glow casing
      map.addLayer({
        id: 'corridor-glow',
        type: 'line',
        source: 'roadmap-street-corridor',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#00E5BE',
          'line-width': 9,
          'line-opacity': 0.35,
          'line-blur': 3,
        },
      });

      // Layer 2: Main street snapped transit line
      map.addLayer({
        id: 'corridor-main',
        type: 'line',
        source: 'roadmap-street-corridor',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#00C9A7',
          'line-width': 4.5,
        },
      });

      // Create Custom Station Markers Snapped to Streets
      ROADMAP_STATIONS.forEach((station) => {
        const markerEl = document.createElement('div');
        markerEl.className = `station-marker-pin station-${station.id} cursor-pointer group`;
        
        const isCurrent = station.id === '03';
        const isDone = station.stepNumber <= 2;

        markerEl.innerHTML = `
          <div class="relative flex flex-col items-center">
            ${isCurrent ? '<span class="absolute -inset-2.5 rounded-full bg-urbo-teal2/35 animate-ping"></span>' : ''}
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-md shadow-xl transition-all duration-300 ${
              isCurrent 
                ? 'bg-slate-950/90 text-urbo-teal2 border border-urbo-teal2 ring-2 ring-urbo-teal/40 scale-105' 
                : isDone 
                ? 'bg-slate-900/85 text-emerald-400 border border-emerald-500/40' 
                : 'bg-slate-900/80 text-slate-400 border border-white/15'
            }">
              <span class="w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-urbo-teal2 animate-pulse' : isDone ? 'bg-emerald-400' : 'bg-slate-500'}"></span>
              <span>${station.phase}</span>
            </div>
            <div class="w-3 h-3 rounded-full mt-1 border-2 border-white ${
              isCurrent ? 'bg-urbo-teal2' : isDone ? 'bg-emerald-400' : 'bg-slate-600'
            } shadow-[0_0_12px_rgba(0,201,167,0.8)]"></div>
          </div>
        `;

        markerEl.addEventListener('click', () => {
          setSelectedStationId(station.id);
          flyToStation(station);
        });

        const marker = new Marker({ element: markerEl, anchor: 'bottom' })
          .setLngLat(station.coords)
          .addTo(map);

        stationMarkersRef.current.push(marker);
      });

      // =====================================================================
      // CAMBIO 1: PUNTO AZUL PARPADEANTE / GPS ACTIVO EN TIEMPO REAL
      // (Reemplaza el icono de micro por una baliza GPS viva y elegante)
      // =====================================================================
      const gpsDotEl = document.createElement('div');
      gpsDotEl.className = 'gps-live-beacon select-none pointer-events-none relative flex items-center justify-center';
      gpsDotEl.style.width = '48px';
      gpsDotEl.style.height = '48px';

      gpsDotEl.innerHTML = `
        <div class="relative flex items-center justify-center w-full h-full">
          <!-- Expanding Outer Halo 1 (Gentle continuous wave) -->
          <span class="absolute w-12 h-12 rounded-full bg-cyan-400/20 animate-ping" style="animation-duration: 2.2s;"></span>
          
          <!-- Outer Pulsing Glow Aura -->
          <span class="absolute w-9 h-9 rounded-full bg-cyan-500/30 blur-sm animate-pulse" style="animation-duration: 1.8s;"></span>
          
          <!-- Mid Luminous Ring -->
          <span class="absolute w-6 h-6 rounded-full bg-cyan-400/50 border border-cyan-200/80 shadow-[0_0_15px_rgba(6,182,212,0.8)]"></span>
          
          <!-- Solid Core Blue GPS Center -->
          <span class="relative w-3.5 h-3.5 rounded-full bg-cyan-300 border-2 border-white shadow-[0_0_10px_#38bdf8]"></span>
        </div>
      `;

      const initialCoords = getInterpolatedStreetPoint(CORRIDOR_COORDINATES, REAL_PROGRESS);
      const dotMarker = new Marker({ element: gpsDotEl, anchor: 'center' })
        .setLngLat(initialCoords)
        .addTo(map);

      gpsDotMarkerRef.current = dotMarker;
    });

    mapInstanceRef.current = map;

    return () => {
      stationMarkersRef.current.forEach((m) => m.remove());
      stationMarkersRef.current = [];
      gpsDotMarkerRef.current?.remove();
      map.remove();
    };
  }, [shouldInitMap]);

  // 2. Camera Navigation & Fly-To Station
  const flyToStation = (station: StationData) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo({
      center: station.coords,
      zoom: 14.8,
      pitch: 42,
      bearing: -16,
      duration: 1200,
      essential: true,
    });
  };

  // 3. GSAP Timeline: Move GPS Dot along Real Street Polyline
  const animateGpsTo = (targetProgress: number, duration: number = 2.0, onDone?: () => void) => {
    setIsAnimating(true);
    const dot = gpsDotMarkerRef.current;
    const map = mapInstanceRef.current;

    gsap.to(progressHolder.current, {
      p: targetProgress,
      duration: duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        const coords = getInterpolatedStreetPoint(CORRIDOR_COORDINATES, progressHolder.current.p);
        if (dot) {
          dot.setLngLat(coords);
        }
      },
      onComplete: () => {
        setIsAnimating(false);
        if (onDone) onDone();
      },
    });

    // Camera smoothly follows the GPS dot location
    const targetCoords = getInterpolatedStreetPoint(CORRIDOR_COORDINATES, targetProgress);
    map?.flyTo({
      center: targetCoords,
      duration: duration * 1000,
      zoom: 14.4,
      essential: true,
    });
  };

  // 4. Interactive Projection: Advance GPS from Phase 3 to Phase 5 or Restore
  const handleToggleProjection = () => {
    if (isAnimating) return;

    if (!isProjected) {
      // Advance GPS Dot to Phase 5 (Regional Expansion)
      animateGpsTo(PROJECTED_PROGRESS, 2.2, () => {
        setIsProjected(true);
        setSelectedStationId('05');
      });
    } else {
      // Return GPS Dot back to Phase 3 (Google Play Store en calle)
      animateGpsTo(REAL_PROGRESS, 1.6, () => {
        setIsProjected(false);
        setSelectedStationId('03');
      });
    }
  };

  // 5. Section Entrance GSAP Orchestration
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.roadmap-header',
        { opacity: 0, y: 35, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        '.roadmap-cockpit-frame',
        { opacity: 0, scale: 0.96, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sec);

    return () => ctx.revert();
  }, []);

  const activeStation = ROADMAP_STATIONS.find((s) => s.id === selectedStationId) || ROADMAP_STATIONS[2];

  return (
    <section ref={sectionRef} id="roadmap" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Anchor alias */}
      <span id="ruta" className="absolute -top-32" />

      {/* Atmospheric Ambient Lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[550px] rounded-full bg-urbo-teal/10 blur-[180px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* =================================================================
            SECTION EDITORIAL HEADER
            ================================================================= */}
        <div className="roadmap-header max-w-3xl mb-10 sm:mb-14">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <GlassBadge variant={isProjected ? 'radioactive' : 'teal'}>
              <Navigation className="w-3.5 h-3.5 text-urbo-teal2 mr-1 inline" />
              {isProjected ? 'ESCENARIO PROYECTADO DE EXPANSIÓN' : 'RUTA METROPOLITANA · SANTA CRUZ DE LA SIERRA'}
            </GlassBadge>

            {isProjected && (
              <span className="text-[11px] font-mono text-radioactive-bright font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-radioactive/15 border border-radioactive/30 animate-pulse">
                Modo Proyección Activo
              </span>
            )}
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4 font-tech">
            Ruta de despliegue en{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-urbo-teal2 via-urbo-teal to-teal-400 font-tech">
              asfalto real.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed">
            Cada fase es una estación activa sobre la red vial real de Santa Cruz de la Sierra. La ruta sigue las calles e intersecciones cartográficas desde el 1er Anillo y Junín hasta la red troncal metropolitana.
          </p>
        </div>

        {/* =================================================================
            URBAN MOBILITY NAVIGATION COCKPIT (MAPLIBRE MAP + LIQUID GLASS HUD)
            ================================================================= */}
        <div className="roadmap-cockpit-frame relative w-full h-[580px] sm:h-[640px] rounded-[36px] overflow-hidden border border-white/20 shadow-glass-volumetric select-none">
          
          {/* 1. Underlying Real MapLibre Interactive Canvas */}
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

          {/* 2. Top Floating Glass Bar: Urban Context & Projection CTA */}
          <div className="absolute top-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            
            {/* Live Corridor Status Indicator */}
            <div className="pointer-events-auto inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-950/85 border border-cyan-400/30 text-white backdrop-blur-xl shadow-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300" />
              </span>
              <span className="text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
                Red Vial Real · Telemetría GPS Activa
              </span>
            </div>

            {/* Projection Action Button */}
            <div className="pointer-events-auto sm:mr-14">
              <GlassButton
                variant={isProjected ? 'secondary' : 'radioactive'}
                size="sm"
                onClick={handleToggleProjection}
                disabled={isAnimating}
                className="font-bold flex items-center gap-2 cursor-pointer shadow-2xl backdrop-blur-2xl"
              >
                {isProjected ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 text-urbo-teal2" />
                    <span>Volver al estado actual</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>¿Cuál es nuestra proyección?</span>
                  </>
                )}
              </GlassButton>
            </div>
          </div>

          {/* 3. Left Floating Phase Navigation Tabs (Liquid Glass Capsule) */}
          <div className="absolute top-20 left-4 z-20 hidden md:flex flex-col gap-2 max-w-[240px] pointer-events-auto">
            <div className="liquid-glass-elevated rounded-2xl p-2 border-white/15 backdrop-blur-2xl space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                Estaciones en Malla Vial
              </div>

              {ROADMAP_STATIONS.map((station) => {
                const isSelected = selectedStationId === station.id;
                const isCompleted = station.stepNumber <= 2;
                const isActive = station.id === '03';

                return (
                  <button
                    key={station.id}
                    type="button"
                    onClick={() => {
                      setSelectedStationId(station.id);
                      flyToStation(station);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-xs font-mono transition-all duration-200 cursor-pointer',
                      isSelected
                        ? 'bg-urbo-teal/20 text-urbo-teal2 border border-urbo-teal/40 font-bold shadow-sm'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={cn(
                        'w-2 h-2 rounded-full flex-shrink-0',
                        isActive ? 'bg-cyan-300 animate-pulse' : isCompleted ? 'bg-emerald-400' : 'bg-slate-500'
                      )} />
                      <span className="truncate">{station.phase}: {station.title}</span>
                    </div>
                    {isSelected && <ChevronRight className="w-3.5 h-3.5 text-urbo-teal2" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Bottom Floating Station Insight Card (Liquid Glass Elevated Panel) */}
          <div className="absolute bottom-4 inset-x-4 z-20 pointer-events-auto">
            <div className="liquid-glass-elevated rounded-[28px] p-5 sm:p-6 border-white/20 backdrop-blur-3xl shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                
                {/* Station Headline and Description */}
                <div className="md:col-span-8">
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {activeStation.phase} · {activeStation.locationName}
                    </span>

                    <span
                      className={cn(
                        'text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border',
                        activeStation.status === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/35'
                          : activeStation.status === 'active'
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/35'
                          : 'bg-lime-500/15 text-radioactive-bright border-lime-500/35'
                      )}
                    >
                      {activeStation.status === 'completed' ? 'Completada' : activeStation.status === 'active' ? 'En Curso · GPS Activo' : 'Próxima Fase · Proyección'}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-1.5 font-sans">
                    {activeStation.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                    {activeStation.description}
                  </p>
                </div>

                {/* Right: Operational Metric Highlight */}
                <div className="md:col-span-4 flex flex-col items-start md:items-end justify-center">
                  <div className="liquid-glass-subtle rounded-2xl p-3.5 sm:p-4 border-white/15 w-full text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Radio className="w-4 h-4 text-cyan-300 animate-pulse" />
                      <span className="text-[11px] font-mono font-bold text-slate-200 uppercase tracking-wider">
                        Telemetría en Calle
                      </span>
                    </div>
                    <div className="text-xs text-cyan-300 font-mono font-bold">
                      {activeStation.metric}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
