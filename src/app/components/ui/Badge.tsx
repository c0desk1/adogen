// src/app/components/ui/Badge.tsx
import { forwardRef } from 'react';
import { cn } from '@/app/lib/utils';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';
type BadgeRounded = 'md' | 'full' | 'none';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: BadgeRounded;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', rounded = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'border-(--bg-muted) text-(--fg) border border-(--border)',
      primary: 'border border-(--accent) text-(--accent-fg)',
      success: 'border border-(--border-subtle) text-(--success)',
      warning: 'border border-(--border-subtle) text-(--warning)',
      error: 'border border-(--border-subtle) text-(--error)',
      outline: 'bg-transparent border border-(--border) text-(--fg)',
    };

    const sizes = {
      sm: 'px-1.5 py-0.5 text-xs',
      md: 'px-2 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };

    const roundedClasses = {
      md: 'rounded-md',
      full: 'rounded-full',
      none: 'rounded-none',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 font-medium',
          variants[variant],
          sizes[size],
          roundedClasses[rounded],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';
export default Badge;