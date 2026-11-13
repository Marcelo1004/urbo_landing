import React from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import { Hero } from '@/components/hero/Hero';
import { Opportunity } from '@/components/opportunity/Opportunity';
import { Solution } from '@/components/solution/Solution';
import { MetricsProof } from '@/components/metrics/MetricsProof';
import { Audiences } from '@/components/audiences/Audiences';
import { Footer } from '@/components/footer/Footer';
import { UrboPreloader } from '@/components/ui/UrboPreloader';
import { IntroProvider } from '@/motion/useIntroSequence';
import { useMotionSystem } from '@/motion/useMotionSystem';

// Code Splitting for heavy below-the-fold modules (reduces initial JS payload by >40%)
const CommunityFeed = React.lazy(() =>
  import('@/components/community/CommunityFeed').then((m) => ({ default: m.CommunityFeed }))
);
const Roadmap = React.lazy(() =>
  import('@/components/roadmap/Roadmap').then((m) => ({ default: m.Roadmap }))
);
const FinalCta = React.lazy(() =>
  import('@/components/cta/FinalCta').then((m) => ({ default: m.FinalCta }))
);

export const AppContent: React.FC = () => {
  useMotionSystem();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scrollTarget = params.get('scroll');
    const targetId = scrollTarget || (window.location.hash ? window.location.hash.replace('#', '') : null);
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'instant' });
        }
      }, 300);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--navy-bg)] text-[var(--text-primary)] transition-colors duration-300 flex flex-col selection:bg-urbo-teal/30">
      <UrboPreloader />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Opportunity />
        <Solution />
        <MetricsProof />
        
        {/* Deferred Secondary Modules with reserved layout height to prevent CLS */}
        <React.Suspense fallback={<div className="min-h-[500px] w-full" aria-hidden="true" />}>
          <CommunityFeed />
        </React.Suspense>
        
        <Audiences />
        
        <React.Suspense fallback={<div className="min-h-[640px] w-full" aria-hidden="true" />}>
          <Roadmap />
        </React.Suspense>
        
        <React.Suspense fallback={<div className="min-h-[400px] w-full" aria-hidden="true" />}>
          <FinalCta />
        </React.Suspense>
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <IntroProvider>
      <AppContent />
    </IntroProvider>
  );
};

export default App;
