import { forwardRef } from 'react';
import { cn } from '@/app/lib/utils';
import Button from './Button';

type BannerVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral';

interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  variant?: BannerVariant;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Banner = forwardRef<HTMLDivElement, BannerProps>(
  ({ className, variant = 'info', message, dismissible = false, onDismiss, children, ...props }, ref) => {
    const variants = {
      info: 'bg-(--accent-soft) border-(--accent-border) text-(--accent-fg)',
      success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      warning: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
      error: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
      neutral: 'bg-(--bg-muted) border-(--border-subtle) text-(--fg-strong)',
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'flex items-start justify-between gap-3 p-3 text-xs font-medium border rounded-lg shadow-xs transition-all duration-150 animate-fadeIn',
          variants[variant],
          className
        )}
        {...props}
      >
        <div className="flex-1 leading-relaxed">
          {message ? message : children}
        </div>
        
        {dismissible && onDismiss && (
          <Button
            type="button"
            variant="ghost"
            iconOnly
            size="sm"
            onClick={onDismiss}
            aria-label="Dismiss message"
            className="h-5 w-5 -mt-0.5 -mr-1 rounded-md text-current opacity-60 hover:opacity-100 hover:bg-current/10"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        )}
      </div>
    );
  }
);

Banner.displayName = 'Banner';
export default Banner;