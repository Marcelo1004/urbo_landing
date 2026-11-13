import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export type IntroPhase = 'loading' | 'ready' | 'revealing' | 'complete';

export interface IntroContextType {
  phase: IntroPhase;
  setPhase: (phase: IntroPhase) => void;
  isComplete: boolean;
  progress: number;
  statusText: string;
  isFirstVisit: boolean;
  mapReady: boolean;
  setMapReady: (ready: boolean) => void;
  heroReady: boolean;
  setHeroReady: (ready: boolean) => void;
}

const IntroContext = createContext<IntroContextType>({
  phase: 'loading',
  setPhase: () => {},
  isComplete: false,
  progress: 0,
  statusText: 'INICIALIZANDO SISTEMA',
  isFirstVisit: true,
  mapReady: false,
  setMapReady: () => {},
  heroReady: false,
  setHeroReady: () => {},
});

const SESSION_KEY = 'urbo_v51_session_active';

export const IntroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [phase, setPhase] = useState<IntroPhase>('loading');
  const [progress, setProgress] = useState<number>(10);
  const [statusText, setStatusText] = useState<string>('INICIALIZANDO MOTOR REACT');
  const [mapReady, setMapReady] = useState<boolean>(false);
  const [heroReady, setHeroReady] = useState<boolean>(false);

  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      return !sessionStorage.getItem(SESSION_KEY);
    } catch {
      return true;
    }
  });

  const mountedTimeRef = useRef<number>(Date.now());
  const hasFinishedRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Bypass completely if user prefers reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setPhase('complete');
      return;
    }

    let isCancelled = false;

    // Calibrated target display time:
    // First visit: ~1.7s of smooth perception for branding & liquid glass progress
    // Repeat visit in same session: ~0.8s accelerated
    const minDisplayTime = isFirstVisit ? 1650 : 800;
    const safetyTimeoutTime = 2600; // Hard fallback limit against slow CDN / fonts

    const advanceProgress = (val: number, text: string) => {
      if (isCancelled || hasFinishedRef.current) return;
      setProgress(val);
      setStatusText(text);
    };

    // Stage 1 — React Hydration & Initial DOM (Immediate)
    advanceProgress(25, 'INICIALIZANDO MOTOR REACT & DOM');

    // Stage 2 — Critical Fonts Check with strict race timeout (0.4s)
    const runFontVerification = async () => {
      try {
        if (document.fonts) {
          await Promise.race([
            document.fonts.ready,
            new Promise((resolve) => setTimeout(resolve, 450)),
          ]);
        }
      } catch {
        // Fallback gracefully without stalling
      }

      advanceProgress(55, 'VERIFICANDO TIPOGRAFÍA Y ACTIVOS');
    };

    // Stage 3 — GSAP Context & Hero Assembly (0.8s)
    const runHeroPreparation = () => {
      setTimeout(() => {
        advanceProgress(80, 'SINCRONIZANDO TIMELINES GSAP');
      }, isFirstVisit ? 850 : 400);
    };

    // Stage 4 — Final Handshake & Telemetry Calibration (100%)
    const runFinalCalibration = () => {
      const elapsed = Date.now() - mountedTimeRef.current;
      const remaining = Math.max(120, minDisplayTime - elapsed);

      setTimeout(() => {
        if (isCancelled || hasFinishedRef.current) return;
        advanceProgress(100, 'CASCO VIEJO · SISTEMA LISTO');
        
        // Brief pause at 100% so the user sees the completed liquid glass bar
        setTimeout(() => {
          if (isCancelled || hasFinishedRef.current) return;
          hasFinishedRef.current = true;
          setPhase('ready');
          try {
            sessionStorage.setItem(SESSION_KEY, 'true');
          } catch {
            // Ignore storage restrictions
          }
        }, 180);
      }, remaining);
    };

    runFontVerification()
      .then(runHeroPreparation)
      .then(runFinalCalibration);

    // Hard Safety Timeout — Never leave user trapped on loading screen
    const safetyTimer = setTimeout(() => {
      if (!hasFinishedRef.current && !isCancelled) {
        hasFinishedRef.current = true;
        advanceProgress(100, 'SISTEMA LISTO');
        setPhase('ready');
      }
    }, safetyTimeoutTime);

    return () => {
      isCancelled = true;
      clearTimeout(safetyTimer);
    };
  }, [isFirstVisit]);

  return (
    <IntroContext.Provider
      value={{
        phase,
        setPhase,
        isComplete: phase === 'complete',
        progress,
        statusText,
        isFirstVisit,
        mapReady,
        setMapReady,
        heroReady,
        setHeroReady,
      }}
    >
      {children}
    </IntroContext.Provider>
  );
};

export const useIntroSequence = () => useContext(IntroContext);
