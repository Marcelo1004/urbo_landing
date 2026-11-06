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
      container: 'bg-teal-500/10 dark:bg-urbo-teal/10 border-teal-500/25 dark:border-urbo-teal/25 text-teal-700 dark:text-urbo-teal2',
      dot: 'bg-teal-600 dark:bg-urbo-teal2',
    },
    amber: {
      container: 'bg-amber-500/10 dark:bg-urbo-amber/10 border-amber-500/30 dark:border-urbo-amber/30 text-amber-700 dark:text-urbo-amber',
      dot: 'bg-amber-500 dark:bg-urbo-amber',
    },
    neutral: {
      container: 'bg-slate-200/60 dark:bg-white/5 border-slate-300/80 dark:border-white/10 text-slate-700 dark:text-slate-300',
      dot: 'bg-slate-600 dark:bg-slate-300',
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
