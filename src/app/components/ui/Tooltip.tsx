// src/app/beta/components/ui/Tooltip.tsx
import { useState, useEffect, cloneElement, type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/app/lib/utils';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: React.ReactNode;
  children: ReactElement<any>; 
  position?: TooltipPosition;
  arrow?: boolean;
  gap?: number;
  className?: string;
}

export default function Tooltip({
  content,
  children,
  position = 'top',
  arrow = true,
  gap = 8,
  className,
}: TooltipProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = rect.top + window.scrollY - gap;
        left = rect.left + window.scrollX + rect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + window.scrollY + gap;
        left = rect.left + window.scrollX + rect.width / 2;
        break;
      case 'left':
        top = rect.top + window.scrollY + rect.height / 2;
        left = rect.left + window.scrollX - gap;
        break;
      case 'right':
        top = rect.top + window.scrollY + rect.height / 2;
        left = rect.right + window.scrollX + gap;
        break;
    }

    setCoords({ top, left });
    setIsVisible(true);
  };

  const handleMouseLeave = () => setIsVisible(false);

  const triggerElement = cloneElement(children, {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleMouseEnter,
    onBlur: handleMouseLeave,
  });

  const positionTransforms = {
    top: '-translate-x-1/2 -translate-y-full',
    bottom: '-translate-x-1/2',
    left: '-translate-x-full -translate-y-1/2',
    right: '-translate-y-1/2',
  };

  const arrowPositions = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 border-r border-b',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-l border-t',
    left: 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 border-t border-r',
    right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45 border-b border-l',
  };

  return (
    <>
      {triggerElement}
      {mounted && isVisible && content &&
        createPortal(
          <div
            role="tooltip"
            aria-live="polite"
            style={{ top: coords.top, left: coords.left }}
            className={cn(
              'fixed z-99999 pointer-events-none select-none animate-tooltipIn',
              'px-2 py-1 text-[13px] font-medium tracking-tight whitespace-nowrap rounded-md border shadow-md transition-opacity duration-150',
              'bg-(--bg) text-(--fg-strong) border-(--border)/80',
              positionTransforms[position],
              className
            )}
          >
            <span className="relative z-10">{content}</span>

            {arrow && (
              <div
                className={cn(
                  'absolute w-1.5 h-1.5 pointer-events-none z-0',
                  'bg-(--bg) border-(--border)/80',
                  arrowPositions[position]
                )}
              />
            )}
          </div>,
          document.body
        )}
    </>
  );
}