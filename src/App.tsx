import React from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import { Hero } from '@/components/hero/Hero';
import { Opportunity } from '@/components/opportunity/Opportunity';
import { Solution } from '@/components/solution/Solution';
import { MetricsProof } from '@/components/metrics/MetricsProof';
import { CommunityFeed } from '@/components/community/CommunityFeed';
import { Audiences } from '@/components/audiences/Audiences';
import { Roadmap } from '@/components/roadmap/Roadmap';
import { FinalCta } from '@/components/cta/FinalCta';
import { Footer } from '@/components/footer/Footer';
import { UrboPreloader } from '@/components/ui/UrboPreloader';
import { IntroProvider } from '@/motion/useIntroSequence';
import { useMotionSystem } from '@/motion/useMotionSystem';

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
        <CommunityFeed />
        <Audiences />
        <Roadmap />
        <FinalCta />
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
