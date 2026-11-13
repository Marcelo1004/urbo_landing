export const motion = {
  duration: {
    micro: 0.18,
    fast: 0.32,
    normal: 0.55,
    reveal: 0.75,
  },
  ease: {
    enter: 'power3.out',
    exit: 'power2.inOut',
    transition: 'power2.inOut',
    subtle: 'power2.out',
  },
  distance: {
    micro: 8,
    sm: 16,
    md: 24,
    lg: 32,
  },
} as const;

export const MOTION_TOKENS = {
  duration: {
    instant: 0.18,
    fast: 0.32,
    normal: 0.55,
    slow: 0.75,
    cinematic: 0.95,
    ambient: 4.5,
  },
  ease: {
    smooth: 'power2.out',
    snappy: 'power3.out',
    editorial: 'power3.out',
    enter: 'power3.out',
    exit: 'power2.inOut',
    transition: 'power2.inOut',
    elastic: 'power2.out',
    back: 'power3.out',
    inOut: 'power2.inOut',
    ambient: 'sine.inOut',
  },
  stagger: {
    rapid: 0.04,
    tight: 0.06,
    comfortable: 0.1,
    spacious: 0.16,
  },
  distance: {
    micro: 8,
    sm: 16,
    md: 24,
    lg: 32,
    hero: 36,
  },
} as const;
