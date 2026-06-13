import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
type StatusSize = 'sm' | 'md' | 'lg';
type DotType = 'filled' | 'pulse';

interface StatusProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  variant?: StatusVariant;
  size?: StatusSize;
  dotType?: DotType;
  dotPosition?: 'left' | 'right' | 'top';
  dotColor?: string;
}

const Status = forwardRef<HTMLDivElement, StatusProps>(
  ({ title, subtitle, variant = 'neutral', size = 'sm', dotType = 'filled', dotPosition = 'left', dotColor, className, ...props }, ref) => {
    const variantColors = {
      success: 'bg-(--success)',
      warning: 'bg-(--warning)',
      error: 'bg-(--error)',
      info: 'bg-(--accent)',
      neutral: 'bg-(--fg-dim)',
    };

    const sizeMap = {
      sm: { dot: 'w-1.5 h-1.5', text: 'text-xs', subtitle: 'text-xs' },
      md: { dot: 'w-2 h-2', text: 'text-sm', subtitle: 'text-sm' },
      lg: { dot: 'w-2.5 h-2.5', text: 'text-base', subtitle: 'text-base' },
    };

    const dotBg = dotColor || variantColors[variant];
    const pulseClass = dotType === 'pulse' ? 'animate-pulse scale-105' : '';

    const dotElement = (
      <span className={cn('inline-block rounded-full shrink-0 shadow-sm', sizeMap[size].dot, dotBg, pulseClass)} />
    );

    return (
      <div 
        ref={ref} 
        className={cn(
          'inline-flex items-center gap-2 select-none font-medium tracking-tight', 
          dotPosition === 'top' && 'flex-col items-center gap-1',
          className
        )} 
        {...props}
      >
        {(dotPosition === 'left' || dotPosition === 'top') && dotElement}
        <div className="flex items-center gap-1.5">
          <span className={cn('font-semibold text-(--fg-strong)', sizeMap[size].text)}>{title}</span>
          {subtitle && <span className={cn('text-(--fg-muted)', sizeMap[size].subtitle)}>({subtitle})</span>}
        </div>
        {dotPosition === 'right' && dotElement}
      </div>
    );
  }
);

Status.displayName = 'Status';
export default Status;