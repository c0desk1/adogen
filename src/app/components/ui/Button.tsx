// src/app/beta/components/ui/Button.tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import Spinner from './Spinner';

type ButtonVariant = 'accent' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonShape = 'circle' | 'square';
type ButtonRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'prefix' | 'suffix'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconOnly?: boolean;
  shape?: ButtonShape;
  rounded?: ButtonRounded;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const sizeClasses = {
  sm: {
    base: 'h-7 text-xs px-2.5 gap-1.5',
    iconOnly: 'w-7 h-7 text-xs px-0',
  },
  md: {
    base: 'h-9 text-sm px-3.5 gap-2',
    iconOnly: 'w-9 h-9 text-sm px-0',
  },
  lg: {
    base: 'h-11 text-base px-5 gap-2.5',
    iconOnly: 'w-11 h-11 text-base px-0',
  },
};

const variantClasses: Record<ButtonVariant, string> = {
  accent: 'bg-(--accent) text-(--accent-fg) hover:opacity-90 active:scale-[0.98] shadow-xs',
  primary: 'bg-(--fg-strong) text-(--bg) hover:opacity-90 active:scale-[0.98] shadow-xs',
  secondary: 'bg-(--bg-surface) text-(--fg-strong) border border-(--border) hover:bg-(--bg-muted) active:scale-[0.98] shadow-2xs',
  outline: 'bg-transparent text-(--fg-strong) border border-(--border) hover:bg-(--bg-muted) active:scale-[0.98]',
  ghost: 'bg-transparent text-(--fg-muted) hover:text-(--fg-strong) hover:bg-(--bg-muted)',
  destructive: 'bg-(--error) text-white hover:bg-opacity-90 active:scale-[0.98] shadow-xs',
  link: 'bg-transparent text-(--accent) hover:underline underline-offset-4',
};

const roundedClasses: Record<ButtonRounded, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      rounded = 'md',
      loading = false,
      iconOnly = false,
      shape = 'square',
      prefix,
      suffix,
      disabled,
      ...props
    },
    ref
  ) => {
    
    const classes = cn(
      'inline-flex items-center justify-center font-semibold select-none transition-all duration-150 outline-none cursor-pointer',
      'focus-visible:ring-2 focus-visible:ring-(--accent-ring)',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:scale-100 disabled:active:scale-100',
      
      iconOnly ? sizeClasses[size].iconOnly : sizeClasses[size].base,
      variantClasses[variant],
      
      iconOnly && shape === 'circle' ? 'rounded-full' : roundedClasses[rounded],
      className
    );

    return (
      <button ref={ref} className={classes} disabled={disabled || loading} {...props}>
        {loading ? (
          <Spinner size="sm" className="shrink-0 text-current" />
        ) : (
          <>
            {prefix && <span className="inline-flex shrink-0 items-center justify-center">{prefix}</span>}
            {!iconOnly && children}
            {iconOnly && children}
            {suffix && <span className="inline-flex shrink-0 items-center justify-center">{suffix}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;