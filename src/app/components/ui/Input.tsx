import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';
import Label from './Label';

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix' | 'size'> {
  label?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  size?: InputSize;
  required?: boolean;
}

const sizeClasses = {
  sm: {
    input: 'h-7 text-xs rounded-md px-2.5',
    slotWidth: 'w-7',
    paddingLeft: 'pl-7',
    paddingRight: 'pr-7',
  },
  md: {
    input: 'h-9 text-sm rounded-md px-3',
    slotWidth: 'w-9',
    paddingLeft: 'pl-9',
    paddingRight: 'pr-9',
  },
  lg: {
    input: 'h-11 text-base rounded-lg px-4',
    slotWidth: 'w-11',
    paddingLeft: 'pl-11',
    paddingRight: 'pr-11',
  },
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, prefix, suffix, size = 'md', required, ...props }, ref) => {
    const defaultId = useId();
    const inputId = id || defaultId;
    const sizeConfig = sizeClasses[size];

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <Label htmlFor={inputId} required={required} className='mb-2'>{label}</Label>}
        <div className="relative flex items-center w-full shadow-2xs rounded-md">
          {prefix && (
            <div className={cn(
              'absolute inset-y-0 left-0 flex items-center justify-center pointer-events-none text-(--fg-muted)',
              sizeConfig.slotWidth
            )}>
              {prefix}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'flex w-full bg-transparent border border-(--border) text-(--fg-strong) font-medium transition-all duration-150',
              'placeholder:text-(--fg-subtle) hover:bg-(--bg-muted)/30',
              'focus:outline-none focus:ring-2 focus:ring-(--accent-ring) focus:border-(--accent-fg)',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-(--bg-muted)/20',
              sizeConfig.input,
              prefix && sizeConfig.paddingLeft,
              suffix && sizeConfig.paddingRight,
              error && 'border-(--error) focus:ring-(--error)/20 focus:border-(--error)',
              className
            )}
            {...props}
          />

          {suffix && (
            <div className={cn(
              'absolute inset-y-0 right-0 flex items-center justify-center',
              sizeConfig.slotWidth
            )}>
              {suffix}
            </div>
          )}
          
        </div>
        {error && <p className="text-xs text-(--error) tracking-tight font-medium animate-fadeIn">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;