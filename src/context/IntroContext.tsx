import React, { createContext, useContext, useState, useEffect } from 'react';

export type IntroPhase = 'loading' | 'ready' | 'revealing' | 'complete';

interface IntroContextType {
  phase: IntroPhase;
  setPhase: (phase: IntroPhase) => void;
  isComplete: boolean;
}

const IntroContext = createContext<IntroContextType>({
  phase: 'loading',
  setPhase: () => {},
  isComplete: false,
});

export const IntroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [phase, setPhase] = useState<IntroPhase>('loading');

  // Skip preloader if user explicitly has prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        setPhase('complete');
      }
    }
  }, []);

  return (
    <IntroContext.Provider value={{ phase, setPhase, isComplete: phase === 'complete' }}>
      {children}
    </IntroContext.Provider>
  );
};

export const useIntroSequence = () => useContext(IntroContext);
