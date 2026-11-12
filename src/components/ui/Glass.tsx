import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useGlassHover } from '@/motion/useGlassHover';

/* ==========================================================================
   GLASS MATERIAL INTERFACES
   ========================================================================== */

export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'elevated' | 'nav' | 'subtle' | 'amber' | 'radioactive' | 'optical';
  interactive?: boolean;
  specular?: boolean;
  refraction?: boolean;
  glow?: 'teal' | 'amber' | 'radioactive' | 'none';
  children: React.ReactNode;
}

export const GlassSurface: React.FC<GlassSurfaceProps> = ({
  variant = 'surface',
  interactive = false,
  specular = true,
  refraction = false,
  glow = 'none',
  className,
  children,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useGlassHover(cardRef, { disabled: !interactive });

  const variantStyles = {
    surface: 'liquid-glass-surface',
    elevated: 'liquid-glass-elevated',
    nav: 'liquid-glass-nav',
    subtle: 'liquid-glass-subtle',
    amber: 'liquid-glass-amber',
    radioactive: 'liquid-glass-radioactive',
    optical: 'optical-glass-surface',
  }[variant];

  const glowStyles = {
    teal: 'shadow-[0_0_40px_-10px_rgba(0,201,167,0.25)]',
    amber: 'shadow-[0_0_35px_-10px_rgba(244,196,48,0.25)]',
    radioactive: 'shadow-[0_0_45px_-8px_rgba(166,255,0,0.3)]',
    none: '',
  }[glow];

  return (
    <div
      ref={cardRef}
      className={cn(
        variantStyles,
        interactive && 'liquid-glass-interactive cursor-pointer',
        specular && 'specular-highlight',
        refraction && 'glass-refraction',
        glowStyles,
        'rounded-3xl relative',
        className
      )}
      {...props}
    >
      {/* Dynamic Specular Reflection Sheet */}
      {specular && <GlassReflection />}
      {children}
    </div>
  );
};

/* ==========================================================================
   DARK GLASS SURFACE (Specially tuned for Dark Glassmorphism)
   ========================================================================== */
export interface DarkGlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  fluorescentAccent?: boolean;
  children: React.ReactNode;
}

export const DarkGlassSurface: React.FC<DarkGlassSurfaceProps> = ({
  interactive = true,
  fluorescentAccent = false,
  className,
  children,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useGlassHover(ref, { disabled: !interactive });

  return (
    <div
      ref={ref}
      className={cn(
        'liquid-glass-elevated rounded-3xl relative overflow-hidden',
        fluorescentAccent && 'border-radioactive-bright/40 shadow-[0_0_35px_-8px_rgba(166,255,0,0.25)]',
        interactive && 'liquid-glass-interactive',
        className
      )}
      {...props}
    >
      <GlassReflection />
      {fluorescentAccent && (
        <span className="absolute top-0 right-0 w-28 h-[1px] bg-gradient-to-l from-radioactive-bright to-transparent opacity-80" />
      )}
      {children}
    </div>
  );
};

/* ==========================================================================
   OPTICAL GLASS (High refractive realism with edge bevel)
   ========================================================================== */
export interface OpticalGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
}

export const OpticalGlass: React.FC<OpticalGlassProps> = ({
  interactive = true,
  className,
  children,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useGlassHover(ref, { disabled: !interactive, lift: 6 });

  return (
    <div
      ref={ref}
      className={cn(
        'optical-glass-surface rounded-3xl relative overflow-hidden backdrop-blur-3xl shadow-glass-volumetric',
        interactive && 'liquid-glass-interactive',
        className
      )}
      {...props}
    >
      <div className="optical-bevel-ring pointer-events-none absolute inset-0 rounded-[inherit] border border-white/25" />
      <GlassReflection />
      {children}
    </div>
  );
};

/* ==========================================================================
   GLASS REFLECTION (Specularity that follows cursor)
   ========================================================================== */
export const GlassReflection: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <>
      {/* Edge light highlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 dark:via-white/35 to-transparent z-10"
      />
      {/* Dynamic mouse highlight */}
      <span
        aria-hidden="true"
        className={cn('glass-cursor-glow pointer-events-none absolute inset-0 z-0', className)}
      />
    </>
  );
};

/* ==========================================================================
   GLASS CARD (Editorial container with padding & hierarchy)
   ========================================================================== */
export interface GlassCardProps extends GlassSurfaceProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  header,
  footer,
  className,
  children,
  ...props
}) => {
  return (
    <GlassSurface className={cn('p-6 sm:p-8 flex flex-col justify-between', className)} {...props}>
      {header && <div className="mb-4">{header}</div>}
      <div className="flex-1">{children}</div>
      {footer && <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-white/10">{footer}</div>}
    </GlassSurface>
  );
};

/* ==========================================================================
   GLASS BADGE
   ========================================================================== */
export interface GlassBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'teal' | 'amber' | 'radioactive' | 'neutral';
  dot?: boolean;
  pulse?: boolean;
  children: React.ReactNode;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  variant = 'teal',
  dot = true,
  pulse = false,
  className,
  children,
  ...props
}) => {
  const badgeConfig = {
    teal: {
      container: 'bg-teal-500/10 dark:bg-urbo-teal/10 border-teal-500/25 dark:border-urbo-teal/30 text-teal-700 dark:text-urbo-teal2 shadow-[0_0_15px_-4px_rgba(0,201,167,0.3)]',
      dot: 'bg-teal-600 dark:bg-urbo-teal2',
    },
    amber: {
      container: 'bg-amber-500/10 dark:bg-urbo-amber/10 border-amber-500/30 dark:border-urbo-amber/35 text-amber-700 dark:text-urbo-amber shadow-[0_0_15px_-4px_rgba(244,196,48,0.3)]',
      dot: 'bg-amber-500 dark:bg-urbo-amber',
    },
    radioactive: {
      container: 'bg-lime-500/10 dark:bg-radioactive/10 border-lime-500/35 dark:border-radioactive-bright/40 text-lime-700 dark:text-radioactive-bright shadow-[0_0_20px_-4px_rgba(166,255,0,0.4)]',
      dot: 'bg-lime-600 dark:bg-radioactive-bright',
    },
    neutral: {
      container: 'bg-slate-200/60 dark:bg-white/5 border-slate-300/80 dark:border-white/10 text-slate-700 dark:text-slate-300',
      dot: 'bg-slate-600 dark:bg-slate-300',
    },
  }[variant];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-medium tracking-wide backdrop-blur-md select-none',
        badgeConfig.container,
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-2 w-2 flex-shrink-0">
          {pulse && (
            <span
              className={cn(
                'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                badgeConfig.dot
              )}
            />
          )}
          <span className={cn('relative inline-flex rounded-full h-2 w-2', badgeConfig.dot)} />
        </span>
      )}
      <span>{children}</span>
    </div>
  );
};

/* ==========================================================================
   GLASS BUTTON
   ========================================================================== */
export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'amber' | 'radioactive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium font-mono transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-urbo-teal active:scale-[0.98] select-none';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-urbo-teal text-slate-950 font-bold hover:bg-urbo-teal2 shadow-[0_0_20px_rgba(0,201,167,0.3)] hover:shadow-[0_0_30px_rgba(0,229,190,0.5)]',
    secondary:
      'liquid-glass-subtle text-slate-900 dark:text-white hover:text-urbo-teal2 border-slate-300/60 dark:border-white/10 hover:border-urbo-teal/40',
    amber:
      'bg-urbo-amber text-slate-950 font-bold hover:bg-amber-300 shadow-[0_0_20px_rgba(244,196,48,0.3)]',
    radioactive:
      'bg-radioactive-bright text-slate-950 font-extrabold hover:bg-lime-300 shadow-[0_0_25px_rgba(166,255,0,0.5)]',
    ghost:
      'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5',
  }[variant];

  return (
    <button
      className={cn(baseStyles, sizeStyles, variantStyles, className)}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
