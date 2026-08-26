// frontend/src/components/ui/Button.tsx
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants = {
      default: 'bg-zinc-100 hover:bg-white text-zinc-950 shadow-sm hover:shadow font-semibold',
      secondary: 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60',
      outline: 'border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/60 hover:text-white text-zinc-300 backdrop-blur-sm',
      ghost: 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50',
      destructive: 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25',
      glass: 'bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 backdrop-blur-md hover:border-white/20',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
      md: 'h-9 px-4 text-sm rounded-xl gap-2',
      lg: 'h-11 px-6 text-base rounded-xl gap-2.5',
      icon: 'h-9 w-9 p-0 rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
