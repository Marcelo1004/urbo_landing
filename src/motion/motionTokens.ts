export const MOTION_TOKENS = {
  duration: {
    instant: 0.15,
    fast: 0.35,
    normal: 0.65,
    slow: 0.95,
    cinematic: 1.35,
    ambient: 4.5,
  },
  ease: {
    smooth: 'power2.out',
    snappy: 'power3.out',
    editorial: 'power4.out',
    elastic: 'elastic.out(1, 0.75)',
    back: 'back.out(1.5)',
    inOut: 'power2.inOut',
    ambient: 'sine.inOut',
  },
  stagger: {
    rapid: 0.04,
    tight: 0.08,
    comfortable: 0.14,
    spacious: 0.22,
  },
  distance: {
    micro: 8,
    sm: 16,
    md: 32,
    lg: 56,
    hero: 70,
  },
} as const;
