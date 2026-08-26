// frontend/src/components/ui/DashedLine.tsx
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface DashedLineProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const DashedLine: React.FC<DashedLineProps> = ({
  orientation = 'horizontal',
  className,
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          orientation === 'horizontal'
            ? 'w-full h-px border-b border-dashed border-zinc-800'
            : 'h-full w-px border-r border-dashed border-zinc-800',
          className
        )
      )}
    />
  );
};
