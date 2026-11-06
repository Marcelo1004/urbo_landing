import React from 'react';
import { cn } from '@/lib/utils';

export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'elevated' | 'nav' | 'subtle' | 'amber';
  interactive?: boolean;
  specular?: boolean;
  glow?: 'teal' | 'amber' | 'none';
  children: React.ReactNode;
}

export const GlassSurface: React.FC<GlassSurfaceProps> = ({
  variant = 'surface',
  interactive = false,
  specular = true,
  glow = 'none',
  className,
  children,
  ...props
}) => {
  const variantStyles = {
    surface: 'liquid-glass-surface',
    elevated: 'liquid-glass-elevated',
    nav: 'liquid-glass-nav',
    subtle: 'liquid-glass-subtle',
    amber: 'liquid-glass-amber',
  }[variant];

  const glowStyles = {
    teal: 'shadow-[0_0_40px_-10px_rgba(0,201,167,0.25)]',
    amber: 'shadow-[0_0_35px_-10px_rgba(244,196,48,0.25)]',
    none: '',
  }[glow];

  return (
    <div
      className={cn(
        variantStyles,
        interactive && 'liquid-glass-interactive',
        specular && 'specular-highlight',
        glowStyles,
        'rounded-3xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface GlassBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'teal' | 'amber' | 'neutral';
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
      container: 'bg-urbo-teal/10 border-urbo-teal/25 text-urbo-teal2',
      dot: 'bg-urbo-teal2',
    },
    amber: {
      container: 'bg-urbo-amber/10 border-urbo-amber/30 text-urbo-amber',
      dot: 'bg-urbo-amber',
    },
    neutral: {
      container: 'bg-white/5 border-white/10 text-slate-300',
      dot: 'bg-slate-300',
    },
  }[variant];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-medium tracking-wide backdrop-blur-md',
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
      {children}
    </div>
  );
};

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'amber' | 'ghost';
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
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-6 py-3 text-sm gap-2',
    lg: 'px-8 py-4 text-base gap-2.5',
  }[size];

  const variantStyles = {
    primary: 'apple-pill-primary',
    secondary: 'apple-pill-secondary',
    amber:
      'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-slate-950 font-bold rounded-full shadow-[0_8px_24px_-6px_rgba(244,196,48,0.4)] hover:brightness-105 transition-all',
    ghost:
      'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white rounded-full transition-all border border-transparent hover:border-white/10',
  }[variant];

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium tracking-wide cursor-pointer transition-all duration-200 select-none active:scale-95',
        sizeStyles,
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
      {icon && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
};

