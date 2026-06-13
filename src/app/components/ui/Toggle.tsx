import { forwardRef, useState, useCallback, useId } from 'react';
import { cn } from '@/lib/utils';

interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  labelPosition?: 'left' | 'right';
  onChange?: (checked: boolean) => void;
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, labelPosition = 'right', checked, defaultChecked, onChange, disabled, className, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;
    const switchId = useId();

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      if (!isControlled) setInternalChecked(newChecked);
      onChange?.(newChecked);
    }, [isControlled, onChange]);

    return (
      <label 
        htmlFor={switchId}
        className={cn(
          'inline-flex items-center gap-2.5 cursor-pointer select-none transition-opacity', 
          disabled && 'opacity-40 cursor-not-allowed', 
          className
        )}
      >
        {labelPosition === 'left' && label && (
          <span className="text-sm font-medium text-(--fg-strong)">{label}</span>
        )}
        <span className="relative inline-flex items-center w-9 h-5 shrink-0">
          <input 
            ref={ref} 
            id={switchId}
            type="checkbox" 
            className="sr-only peer" 
            checked={isChecked} 
            disabled={disabled} 
            onChange={handleChange} 
            {...props} 
          />
          <span className={cn(
            'block w-full h-full rounded-full border border-transparent transition-colors duration-200 bg-(--bg-muted) peer-focus:ring-2 peer-focus:ring-(--accent-ring)',
            isChecked && 'bg-(--accent)'
          )} />
          <span className={cn(
            'absolute left-0.5 top-0.5 w-4 h-4 bg-(--accent-fg) rounded-full shadow-sm border border-(--border)/20 transition-transform duration-200 ease-out pointer-events-none',
            isChecked && 'translate-x-4'
          )} />
        </span>
        {labelPosition === 'right' && label && (
          <span className="text-sm font-medium text-(--fg-strong)">{label}</span>
        )}
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';
export default Toggle;