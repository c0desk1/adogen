import { useStore } from '@nanostores/react';
import { useEffect } from 'react';
import { toasts, removeToast, type ToastItem } from '@/app/stores';
import { cn } from '@/lib/utils';
import Icon from './Icon';
import Spinner from './Spinner';

export default function Toast() {
  const currentToasts = useStore(toasts);
  if (currentToasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-9999 flex flex-col gap-3 pointer-events-none items-end">
      {currentToasts.map((toast) => (
        <ToastCard key={toast.id} item={toast} />
      ))}
    </div>
  );
}

function ToastCard({ item }: { item: ToastItem }) {
  const { id, message, variant = 'info', duration = 4000 } = item;

  useEffect(() => {
    if (variant === 'loading') return;
    const timer = setTimeout(() => removeToast(id), duration);
    return () => clearTimeout(timer);
  }, [id, variant, duration]);

  const variants = {
    info: 'border-blue-500/30 text-blue-400',
    success: 'border-emerald-500/30 text-emerald-400',
    warning: 'border-amber-500/30 text-amber-400',
    error: 'border-rose-500/30 text-rose-400',
    loading: 'border-zinc-500/30 text-zinc-400',
    custom: 'border-zinc-500/30 text-(--fg)',
  };

  return (
    <div
      className={cn(
        'relative w-80 p-4 border rounded-lg backdrop-blur-xl',
        'bg-zinc-950/80 shadow-[0_0_20px_rgba(0,0,0,0.3)]',
        'pointer-events-auto animate-in slide-in-from-right-4 duration-300',
        variants[variant]
      )}
    >
      <div 
        className="absolute bottom-0 left-0 h-px bg-current opacity-50 animate-toast-progress" 
        style={{ animationDuration: `${duration}ms` }} 
      />
      <button 
        onClick={() => removeToast(id)}
        className={cn(
          "absolute -top-2 -right-2 p-1 rounded-full border bg-zinc-950",
          "hover:scale-110 transition-transform",
          variants[variant]
        )}
      >
        <Icon name="close" className="w-2.5 h-2.5" />
      </button>

      <div className="flex items-start gap-3">
        <div className="relative shrink-0 mt-0.5">
          {variant !== 'loading' && <span className="absolute inset-0 top-0 right-0 animate-ping-subtle rounded-full bg-current opacity-20" />}
          <div className="relative">
            {variant === 'loading' ? <Spinner size="sm" /> : <Icon name={variant === 'success' ? 'check' : 'info' as any} className="w-4 h-4" />}
          </div>
        </div>

        <p className="flex-1 text-xs font-mono tracking-tight leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
