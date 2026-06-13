import { forwardRef, useState, useCallback, useEffect, useId } from 'react';
import { cn } from '@/lib/utils';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftLabel?: string;
  rightLabel?: string;
  showValue?: boolean;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, leftLabel, rightLabel, showValue = true, value, onChange, min = 0, max = 100, step = 1, ...props }, ref) => {
    const sliderId = useId();
    const minNum = Number(min);
    const maxNum = Number(max);
    const [currentValue, setCurrentValue] = useState<number>(typeof value === 'number' ? value : minNum);

    useEffect(() => {
      if (typeof value === 'number') setCurrentValue(value);
    }, [value]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      setCurrentValue(newValue);
      onChange?.(e);
    }, [onChange]);

    const percent = ((currentValue - minNum) / (maxNum - minNum)) * 100;

    return (
      <div className="flex flex-col w-full gap-1.5 select-none">
        {label && (
          <label htmlFor={sliderId} className="text-xs font-semibold font-mono uppercase tracking-wider text-(--fg-muted)">
            {label}
          </label>
        )}
        <div className="flex items-center gap-2.5 h-6 relative">
          {leftLabel && <span className="text-xs font-medium font-mono text-(--fg-muted) shrink-0">{leftLabel}</span>}
          <div className="relative flex-1 flex items-center h-full">
            {/* Structural track container layout matching Geist standard */}
            <div className="h-1 rounded-full bg-(--bg-muted) w-full overflow-hidden relative pointer-events-none">
              <div 
                className="h-full bg-(--accent) transition-all duration-75" 
                style={{ width: `${percent}%` }}
              />
            </div>
            <input
              ref={ref}
              id={sliderId}
              type="range"
              min={minNum}
              max={maxNum}
              step={step}
              value={currentValue}
              onChange={handleChange}
              className={cn(
                'absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10',
                'disabled:cursor-not-allowed'
              )}
              {...props}
            />
            {/* Interactive custom thumb rendering */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border border-zinc-300 dark:border-zinc-700 shadow-md pointer-events-none transition-all duration-75"
              style={{ left: `calc(${percent}% - 7px)` }}
            />
          </div>
          {rightLabel && <span className="text-xs font-medium font-mono text-(--fg-muted) shrink-0">{rightLabel}</span>}
        </div>
        {showValue && (
          <div className="flex justify-between items-center text-[11px] font-mono font-medium text-(--fg-muted)">
            <span>Value</span>
            <span className="text-(--accent) font-semibold">{currentValue}</span>
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';
export default Slider;