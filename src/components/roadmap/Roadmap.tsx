import React, { useEffect, useRef, useState } from 'react';
import { Map, NavigationControl, Marker, setWorkerUrl } from 'maplibre-gl';
import maplibreWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import { GlassBadge } from '@/components/ui/Glass';
import { 
  MapPin, 
  Navigation, 
  Sparkles, 
  RotateCcw, 
  ChevronRight,
  Radio,
  Play,
  Pause
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from '@/motion/motionTokens';
import STREET_ROUTE_COORDS from '@/data/roadmap-street-route.json';

gsap.registerPlugin(ScrollTrigger);

if (typeof window !== 'undefined') {
  setWorkerUrl(maplibreWorker);
}

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
  progressRatio: number;
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
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState<string>('03'); // Default to Phase 3 (Current)
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldInitMap, setShouldInitMap] = useState(false);

  const REAL_PROGRESS = ROADMAP_STATIONS[2].progressRatio; // 0.261
  const progressHolder = useRef<{ p: number }>({ p: REAL_PROGRESS });
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Lazy Initialization of WebGL context
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

  // 1. Initialize MapLibre with Santa Cruz Street Network
  useEffect(() => {
    if (!shouldInitMap || !mapContainerRef.current) return;

    const map = new Map({
      container: mapContainerRef.current,
      style: 'https://tiles.openfreemap.org/styles/dark',
      center: [-63.182646, -17.783332],
      zoom: 14.5,
      pitch: 35,
      bearing: -14,
      attributionControl: true,
      scrollZoom: false,
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

      // Layer 1: Ambient road glow casing (emerald #10B981)
      map.addLayer({
        id: 'corridor-glow',
        type: 'line',
        source: 'roadmap-street-corridor',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#059669',
          'line-width': 8,
          'line-opacity': 0.45,
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
          'line-color': '#10B981',
          'line-width': 4.5,
        },
      });

      // Layer 3: Subtle dash flow accent
      map.addLayer({
        id: 'corridor-flow',
        type: 'line',
        source: 'roadmap-street-corridor',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#A7F3D0',
          'line-width': 2,
          'line-dasharray': [1, 2],
        },
      });

      // Create Custom Station Markers
      ROADMAP_STATIONS.forEach((station) => {
        const markerEl = document.createElement('div');
        markerEl.className = `station-marker-pin station-${station.id} cursor-pointer group`;
        
        const isCurrent = station.id === '03';
        const isDone = station.stepNumber <= 2;

        markerEl.innerHTML = `
          <div class="relative flex flex-col items-center">
            ${isCurrent ? '<span class="absolute -inset-2.5 rounded-full bg-cyan-400/35 animate-ping"></span>' : ''}
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-md shadow-xl transition-all duration-300 ${
              isCurrent 
                ? 'bg-[#0F1D36] text-cyan-300 border border-cyan-400 ring-2 ring-cyan-400/40 scale-105' 
                : isDone 
                ? 'bg-[#0F1D36]/90 text-emerald-400 border border-emerald-500/40' 
                : 'bg-[#0F1D36]/80 text-slate-400 border border-white/15'
            }">
              <span class="w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-cyan-400 animate-pulse' : isDone ? 'bg-emerald-400' : 'bg-slate-500'}"></span>
              <span>${station.phase}</span>
            </div>
            <div class="w-3 h-3 rounded-full mt-1 border-2 border-white ${
              isCurrent ? 'bg-cyan-400 shadow-[0_0_12px_#38BDF8]' : isDone ? 'bg-emerald-400 shadow-[0_0_10px_#10B981]' : 'bg-slate-600'
            }"></div>
          </div>
        `;

        markerEl.addEventListener('click', () => {
          navigateToStation(station);
        });

        const marker = new Marker({ element: markerEl, anchor: 'bottom' })
          .setLngLat(station.coords)
          .addTo(map);

        stationMarkersRef.current.push(marker);
      });

      // 2. BLUE GPS LIVE BEACON ON THE CORRIDOR
      const gpsDotEl = document.createElement('div');
      gpsDotEl.className = 'gps-live-beacon select-none pointer-events-none relative flex items-center justify-center';
      gpsDotEl.style.width = '48px';
      gpsDotEl.style.height = '48px';

      gpsDotEl.innerHTML = `
        <div class="relative flex items-center justify-center w-full h-full">
          <span class="absolute w-12 h-12 rounded-full bg-cyan-400/25 animate-ping" style="animation-duration: 2.2s;"></span>
          <span class="absolute w-9 h-9 rounded-full bg-cyan-500/35 blur-sm animate-pulse" style="animation-duration: 1.8s;"></span>
          <span class="absolute w-6 h-6 rounded-full bg-cyan-400/50 border border-cyan-200/80 shadow-[0_0_15px_rgba(6,182,212,0.8)]"></span>
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
      activeTimelineRef.current?.kill();
      stationMarkersRef.current.forEach((m) => m.remove());
      stationMarkersRef.current = [];
      gpsDotMarkerRef.current?.remove();
      map.remove();
    };
  }, [shouldInitMap]);

  // Navigate directly to a specific station (Gentle, smooth camera flight & dot movement)
  const navigateToStation = (station: StationData) => {
    if (activeTimelineRef.current) activeTimelineRef.current.kill();
    setIsAnimating(true);
    setSelectedStationId(station.id);

    const map = mapInstanceRef.current;
    const dot = gpsDotMarkerRef.current;

    // Smoothly fly camera
    map?.flyTo({
      center: station.coords,
      zoom: 14.8,
      pitch: 36,
      bearing: -14,
      duration: 2200,
      essential: true,
    });

    // Move GPS dot smoothly along polyline to the station's progress ratio
    gsap.to(progressHolder.current, {
      p: station.progressRatio,
      duration: 2.2,
      ease: 'power2.out',
      onUpdate: () => {
        const coords = getInterpolatedStreetPoint(CORRIDOR_COORDINATES, progressHolder.current.p);
        if (dot) dot.setLngLat(coords);
      },
      onComplete: () => {
        setIsAnimating(false);
      },
    });
  };

  // 3. NARRATIVE CINEMATIC RECORRIDO (Multi-step progressive tour with pauses & slow pacing)
  const startCinematicTour = () => {
    if (isAnimating) return;
    setIsTourRunning(true);
    setIsAnimating(true);

    const map = mapInstanceRef.current;
    const dot = gpsDotMarkerRef.current;

    // Create a smooth multi-phase GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsTourRunning(false);
        setIsAnimating(false);
      },
    });
    activeTimelineRef.current = tl;

    // Helper step function
    const addStationStep = (stationIndex: number, travelDuration: number, pauseDuration: number) => {
      const station = ROADMAP_STATIONS[stationIndex];
      tl.to(progressHolder.current, {
        p: station.progressRatio,
        duration: travelDuration,
        ease: 'power1.inOut',
        onStart: () => {
          setSelectedStationId(station.id);
          map?.flyTo({
            center: station.coords,
            zoom: 14.6,
            duration: travelDuration * 1000,
            essential: true,
          });
        },
        onUpdate: () => {
          const coords = getInterpolatedStreetPoint(CORRIDOR_COORDINATES, progressHolder.current.p);
          if (dot) dot.setLngLat(coords);
        },
      });
      // Pause at station for reading
      tl.to({}, { duration: pauseDuration });
    };

    // Begin tour from Phase 1 -> 2 -> 3 -> 4 -> 5
    addStationStep(0, 1.8, 1.4); // Phase 1: 1er Anillo
    addStationStep(1, 2.4, 1.4); // Phase 2: Junín
    addStationStep(2, 2.0, 1.6); // Phase 3: Plaza 24 (Active)
    addStationStep(3, 3.2, 1.6); // Phase 4: 2do Anillo Cristo Redentor
    addStationStep(4, 3.4, 2.0); // Phase 5: Warnes / Expansión Regional
  };

  const stopCinematicTour = () => {
    if (activeTimelineRef.current) {
      activeTimelineRef.current.kill();
    }
    setIsTourRunning(false);
    setIsAnimating(false);
    // Reset to current active Phase 3
    navigateToStation(ROADMAP_STATIONS[2]);
  };

  // Section Entrance GSAP
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.roadmap-header',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: motion.duration.normal,
          ease: motion.ease.enter,
          scrollTrigger: {
            trigger: sec,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sec);

    return () => ctx.revert();
  }, []);

  const activeStation = ROADMAP_STATIONS.find((s) => s.id === selectedStationId) || ROADMAP_STATIONS[2];

  return (
    <section ref={sectionRef} id="roadmap" className="relative py-20 lg:py-28 overflow-hidden bg-[#0A1220]">
      {/* Anchor alias */}
      <span id="ruta" className="absolute -top-32" />

      {/* Atmospheric Ambient Lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-emerald-500/10 blur-[180px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="roadmap-header max-w-3xl mb-10 sm:mb-14">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <GlassBadge variant="emerald">
              <Navigation className="w-3.5 h-3.5 text-emerald-400 mr-1 inline" />
              RUTA METROPOLITANA · SANTA CRUZ DE LA SIERRA
            </GlassBadge>

            {isTourRunning && (
              <span className="text-[11px] font-mono text-cyan-300 font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 animate-pulse">
                Recorrido Cinematográfico Activo
              </span>
            )}
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4 font-tech">
            Ruta de despliegue en{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 font-tech">
              asfalto real.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Cada fase es una estación activa sobre la red vial real de Santa Cruz de la Sierra. La ruta sigue las calles e intersecciones cartográficas desde el 1er Anillo y Junín hasta la red troncal metropolitana.
          </p>
        </div>

        {/* =================================================================
            URBAN MOBILITY COCKPIT (MAPLIBRE MAP + REFINED HUD)
            ================================================================= */}
        <div className="roadmap-cockpit-frame relative w-full h-[580px] sm:h-[640px] rounded-[34px] overflow-hidden bg-[#0F1D36] border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] select-none">
          
          {/* MapLibre Canvas */}
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

          {/* Top Bar: Live Status & Recorrido Cinematográfico Controls */}
          <div className="absolute top-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            
            <div className="pointer-events-auto inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#0F1D36]/90 border border-cyan-400/40 text-white backdrop-blur-xl shadow-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300" />
              </span>
              <span className="text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
                Red Vial Real · Telemetría GPS Activa
              </span>
            </div>

            {/* Recorrido Cinematográfico Toggle */}
            <div className="pointer-events-auto">
              {isTourRunning ? (
                <button
                  type="button"
                  onClick={stopCinematicTour}
                  className="px-4 py-2 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold flex items-center gap-2 shadow-xl backdrop-blur-xl hover:bg-rose-500/30 transition-all cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pausar recorrido</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startCinematicTour}
                  disabled={isAnimating}
                  className="px-4 py-2 rounded-full bg-emerald-500 text-slate-950 text-xs font-mono font-black flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:bg-emerald-400 hover:scale-105 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Ver recorrido cinematográfico</span>
                </button>
              )}
            </div>
          </div>

          {/* Left: Station Phase Selector Pill */}
          <div className="absolute top-20 left-4 z-20 hidden md:flex flex-col gap-1.5 max-w-[250px] pointer-events-auto">
            <div className="rounded-2xl p-2.5 bg-[#0F1D36]/90 border border-white/15 backdrop-blur-xl shadow-2xl space-y-1">
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
                    onClick={() => navigateToStation(station)}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-xs font-mono transition-all duration-200 cursor-pointer',
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={cn(
                        'w-2 h-2 rounded-full flex-shrink-0',
                        isActive ? 'bg-cyan-400 animate-pulse' : isCompleted ? 'bg-emerald-400' : 'bg-slate-500'
                      )} />
                      <span className="truncate">{station.phase}: {station.title}</span>
                    </div>
                    {isSelected && <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Floating Station Card */}
          <div className="absolute bottom-4 inset-x-4 z-20 pointer-events-auto">
            <div className="rounded-[26px] p-5 sm:p-6 bg-[#0F1D36]/95 border border-white/15 backdrop-blur-2xl shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                
                <div className="md:col-span-8">
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {activeStation.phase} · {activeStation.locationName}
                    </span>

                    <span
                      className={cn(
                        'text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border',
                        activeStation.status === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/35'
                          : activeStation.status === 'active'
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/35'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/35'
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

                <div className="md:col-span-4 flex flex-col items-start md:items-end justify-center">
                  <div className="rounded-2xl p-3.5 sm:p-4 bg-white/5 border border-white/10 w-full text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-mono font-bold text-slate-200 uppercase tracking-wider">
                        Telemetría en Calle
                      </span>
                    </div>
                    <div className="text-xs text-emerald-300 font-mono font-bold">
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
