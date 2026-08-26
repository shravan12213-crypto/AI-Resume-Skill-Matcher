// frontend/src/components/ui/Badge.tsx
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive' | 'accent' | 'matched' | 'missing';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide transition-colors select-none';

  const variants = {
    default: 'bg-zinc-800 text-zinc-200 border border-zinc-700/60',
    secondary: 'bg-zinc-900/80 text-zinc-400 border border-zinc-800',
    outline: 'border border-zinc-700/80 text-zinc-300 bg-transparent',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    destructive: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    accent: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20',
    matched: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    missing: 'bg-zinc-800/80 text-zinc-400 border border-dashed border-zinc-700',
  };

  return (
    <div className={twMerge(clsx(baseStyles, variants[variant], className))} {...props}>
      {children}
    </div>
  );
};
