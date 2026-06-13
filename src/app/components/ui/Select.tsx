import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { cn } from '@/app/lib/utils';
import Label from './Label';
import Icon from './Icon';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

type SelectSize = 'sm' | 'md' | 'lg';

interface SelectProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  size?: SelectSize;
  className?: string;
}

const sizeClasses = {
  sm: { button: 'px-2 py-1 text-xs h-7', icon: 'w-3 h-3', option: 'py-1.5 px-2 text-xs' },
  md: { button: 'px-3 py-2 text-sm h-9', icon: 'w-3.5 h-3.5', option: 'py-2 px-3 text-sm' },
  lg: { button: 'px-4 py-2.5 text-base h-11', icon: 'w-4 h-4', option: 'py-2.5 px-4 text-base' },
};

export default function Select({
  options,
  value,
  onChange,
  label,
  error,
  placeholder = 'Select...',
  disabled = false,
  required = false,
  size = 'md',
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const generatedId = useId();

  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption?.label || placeholder;

  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const toggle = () => {
    if (!disabled) setIsOpen(prev => !prev);
  };

  const selectOption = (optionValue: string) => {
    if (disabled) return;
    onChange?.(optionValue);
    close();
    buttonRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(0);
        } else {
          setHighlightedIndex(prev => (prev + 1) % options.length);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(options.length - 1);
        } else {
          setHighlightedIndex(prev => (prev - 1 + options.length) % options.length);
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(0);
        } else if (highlightedIndex >= 0) {
          selectOption(options[highlightedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        close();
        buttonRef.current?.focus();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [close]);

  useEffect(() => {
    if (isOpen && listboxRef.current && highlightedIndex >= 0) {
      const item = listboxRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  const listboxId = `${generatedId}-listbox`;

  return (
    <div className={cn('flex flex-col gap-1.5 w-full relative', className)} ref={containerRef}>
      {label && <Label htmlFor={listboxId} required={required} className='mb-2'>{label}</Label>}
      <div className="relative w-full">
        <button
          ref={buttonRef}
          type="button"
          id={listboxId}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-disabled={disabled}
          disabled={disabled}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full rounded-md border bg-transparent shadow-sm transition-all duration-150',
            'flex items-center justify-between font-medium text-left',
            'focus:outline-none focus:ring-2 focus:ring-(--accent-ring) focus:border-(--accent-fg)',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            error
              ? 'border-(--error) focus:border-(--error) focus:ring-(--error)'
              : 'border-(--border) hover:bg-(--bg-muted)/60',
            sizeClasses[size].button,
          )}
        >
          <span className={cn(selectedOption ? 'text-(--fg-strong)' : 'text-(--fg-muted)', 'truncate pr-4')}>
            {displayValue}
          </span>
          <Icon name='select' className={cn(sizeClasses[size].icon, 'text-(--fg-muted) shrink-0 transition-transform duration-150', isOpen ? 'rotate-180' : '')} />
        </button>
        {isOpen && (
          <ul
            ref={listboxRef}
            role="listbox"
            aria-labelledby={listboxId}
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-(--border) bg-(--bg) py-1 shadow-xl focus:outline-none animate-fadeIn"
          >
            {options.map((opt, idx) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={value === opt.value}
                aria-disabled={opt.disabled}
                className={cn(
                  'relative cursor-pointer select-none transition-colors font-medium',
                  value === opt.value ? 'bg-(--bg-muted) text-(--accent) font-semibold' : 'text-(--fg)',
                  opt.disabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-(--bg-muted)/70',
                  highlightedIndex === idx && 'bg-(--bg-muted)/40',
                  sizeClasses[size].option,
                )}
                onClick={() => !opt.disabled && selectOption(opt.value)}
                onMouseEnter={() => setHighlightedIndex(idx)}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="text-xs text-(--error) tracking-tight">{error}</p>}
    </div>
  );
}