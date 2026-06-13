import { useStore } from '@nanostores/react';
import { 
  batchItemsMap, 
  batchOrder 
} from '@/app/stores';

import Status from '@/app/components/ui/Status';

export default function StatusBar() {
  const items = useStore(batchItemsMap);
  const order = useStore(batchOrder);

  const total = order.length;
  const pending = order.filter(id => items[id]?.status === 'idle').length;
  const processing = order.filter(id => items[id]?.status === 'generating').length;
  const success = order.filter(id => items[id]?.status === 'success').length;
  const failed = order.filter(id => items[id]?.status === 'failed').length;

  if (total === 0) return null;

  return (
    <div className="w-full flex flex-wrap items-center gap-x-5 gap-y-2 py-2 px-3 border border-(--border-subtle) bg-(--bg-surface) rounded-md select-none animate-fadeIn">
      
      <Status 
        title="Total Assets" 
        subtitle={String(total)} 
        variant="neutral" 
        size="sm" 
      />

      <div className="hidden sm:block h-3.5 w-px bg-(--border)" />

      <Status 
        title="Pending" 
        subtitle={String(pending)} 
        variant={pending > 0 ? 'warning' : 'neutral'} 
        size="sm" 
      />

      <Status 
        title="Processing" 
        subtitle={String(processing)} 
        variant="info" 
        dotType={processing > 0 ? 'pulse' : 'filled'}
        dotColor={processing > 0 ? 'bg-(--accent) shadow-[0_0_8px_var(--accent)]' : undefined}
        size="sm" 
      />

      <Status 
        title="Success" 
        subtitle={String(success)} 
        variant="success" 
        size="sm" 
      />

      <Status 
        title="Failed" 
        subtitle={String(failed)} 
        variant={failed > 0 ? 'error' : 'neutral'} 
        size="sm" 
      />

    </div>
  );
}