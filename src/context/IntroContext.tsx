import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

export type IntroPhase = 'loading' | 'ready' | 'exiting' | 'heroEntering' | 'complete';

export interface IntroContextType {
  phase: IntroPhase;
  setPhase: (phase: IntroPhase) => void;
  isComplete: boolean;
  statusText: string;
  isFirstVisit: boolean;
  heroReady: boolean;
  setHeroReady: (ready: boolean) => void;
}

const IntroContext = createContext<IntroContextType>({
  phase: 'loading',
  setPhase: () => {},
  isComplete: false,
  statusText: 'Conectando la ciudad...',
  isFirstVisit: true,
  heroReady: false,
  setHeroReady: () => {},
});

const SESSION_KEY = 'urbo_v55_session_active';

export const IntroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [phase, setPhase] = useState<IntroPhase>('loading');
  const [statusText, setStatusText] = useState<string>('Conectando la ciudad...');
  const [heroReady, setHeroReadyState] = useState<boolean>(false);

  const [isFirstVisit] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      return !sessionStorage.getItem(SESSION_KEY);
    } catch {
      return true;
    }
  });

  const mountedTimeRef = useRef<number>(Date.now());
  const hasFinishedRef = useRef<boolean>(false);
  const heroReadyRef = useRef<boolean>(false);

  const setHeroReady = useCallback((ready: boolean) => {
    heroReadyRef.current = ready;
    setHeroReadyState(ready);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Fast-path bypass for users who prefer reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setPhase('complete');
      return;
    }

    let isCancelled = false;

    // Minimum display time for brand impression (450ms first visit / 150ms repeat)
    const minDisplayTime = isFirstVisit ? 450 : 150;
    const safetyTimeout = 1200; // Hard fallback limit

    // Deterministic readiness verification: Wait for critical fonts + hero mounting
    const verifyReadiness = async () => {
      try {
        if (document.fonts) {
          await Promise.race([
            document.fonts.ready,
            new Promise((resolve) => setTimeout(resolve, 120)),
          ]);
        }
      } catch {
        // Fallback without stalling
      }

      if (isCancelled || hasFinishedRef.current) return;
      setStatusText('Movilidad en tiempo real');

      const elapsed = Date.now() - mountedTimeRef.current;
      const remainingWait = Math.max(0, minDisplayTime - elapsed);

      setTimeout(() => {
        if (isCancelled || hasFinishedRef.current) return;
        hasFinishedRef.current = true;
        setStatusText('Bienvenido a URBO');
        setPhase('ready');

        try {
          sessionStorage.setItem(SESSION_KEY, 'true');
        } catch {
          // Ignore storage restrictions
        }
      }, remainingWait);
    };

    verifyReadiness();

    // Failsafe timer: Never trap the user under any network anomaly
    const timer = setTimeout(() => {
      if (!hasFinishedRef.current && !isCancelled) {
        hasFinishedRef.current = true;
        setStatusText('Bienvenido a URBO');
        setPhase('ready');
      }
    }, safetyTimeout);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [isFirstVisit]);

  return (
    <IntroContext.Provider
      value={{
        phase,
        setPhase,
        isComplete: phase === 'complete',
        statusText,
        isFirstVisit,
        heroReady,
        setHeroReady,
      }}
    >
      {children}
    </IntroContext.Provider>
  );
};

export const useIntroSequence = () => useContext(IntroContext);
