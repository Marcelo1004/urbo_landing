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
import { useMotionSystem } from '@/motion/useMotionSystem';

export const App: React.FC = () => {
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
    <div className="min-h-screen bg-urbo-navy text-white flex flex-col">
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

export default App;
