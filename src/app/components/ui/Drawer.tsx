// src/app/beta/components/ui/Drawer.tsx
import { useStore } from '@nanostores/react';
import { useEffect, useRef, useState } from 'react';
import { drawerStore, closeDrawer } from '@/app/stores';
import { cn } from '@/app/lib/utils';

export default function Drawer() {
  const { isOpen, content } = useStore(drawerStore);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const currentDeltaYRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTranslateY(0);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.drawer-drag-handle')) return;

    setIsDragging(true);
    startYRef.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startYRef.current;

    if (deltaY > 0) {
      setTranslateY(deltaY);
      currentDeltaYRef.current = deltaY;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (currentDeltaYRef.current > 120) {
      closeDrawer();
    } else {
      setTranslateY(0);
    }
    currentDeltaYRef.current = 0;
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && closeDrawer()}
      className="fixed inset-0 z-99999 bg-black/40 backdrop-blur-xs flex items-end justify-center md:hidden animate-fadeIn"
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ 
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className={cn(
          "w-full max-h-[70vh] bg-(--bg) rounded-t-2xl flex flex-col shadow-2xl relative select-none touch-none border-t border-(--border-subtle)"
        )}
      >
        <div className="drawer-drag-handle w-full py-4 flex flex-col items-center cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 bg-(--border-subtle) rounded-full mb-1" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-(--fg-muted)">
            Configuration
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 content-viewport-safe touch-auto pointer-events-auto">
          {content}
        </div>
      </div>
    </div>
  );
}