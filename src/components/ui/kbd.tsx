'use client';

import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { kbdVariants } from './kbd-variants';

export { kbdVariants } from './kbd-variants';

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof kbdVariants> {
  keys?: string[];
  onClick?: () => void;
}

function Kbd({
  className,
  variant,
  size,
  keys,
  children,
  onClick,
  ref,
  ...props
}: KbdProps & { ref?: React.Ref<HTMLElement> }) {
  // If keys array is provided, render multiple kbd elements
  if (keys && keys.length > 0) {
    return (
      <span
        className="inline-flex items-center gap-1"
        ref={ref as React.Ref<HTMLSpanElement>}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onClick?.();
        }}
        role="button"
        tabIndex={onClick ? 0 : undefined}
      >
        {keys.map((key, index) => (
          <React.Fragment key={index}>
            <kbd
              className={cn(kbdVariants({ variant, size }), className)}
              {...props}
            >
              {key}
            </kbd>
            {index < keys.length - 1 && (
              <span className="text-muted-foreground text-xs px-1">+</span>
            )}
          </React.Fragment>
        ))}
      </span>
    );
  }

  // Single kbd element
  return (
    <kbd
      className={cn(kbdVariants({ variant, size }), className)}
      ref={ref}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </kbd>
  );
}

Kbd.displayName = 'Kbd';

export { Kbd };
