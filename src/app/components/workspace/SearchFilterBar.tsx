import { useStore } from '@nanostores/react';
import { useState, useRef, useEffect } from 'react';
import { 
  searchQueryStore, 
  statusFilterStore, 
  clearAllBatchItems, 
  addToast, 
  batchOrder 
} from '@/app/stores';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import Tooltip from '@/app/components/ui/Tooltip';
import Icon from '../ui/Icon';

type StatusValue = 'all' | 'idle' | 'generating' | 'success' | 'failed';

const statusOptions: { value: StatusValue; label: string }[] = [
  { value: 'all', label: 'All Operations' },
  { value: 'idle', label: 'Pending Queue' },
  { value: 'generating', label: 'Processing Grid' },
  { value: 'success', label: 'Completed Jobs' },
  { value: 'failed', label: 'Failed Matrices' },
];

export default function SearchFilterBar() {
  const searchQuery = useStore(searchQueryStore);
  const statusFilter = useStore(statusFilterStore) as StatusValue;
  const order = useStore(batchOrder);
  const hasItems = order.length > 0;

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const handleClearAll = () => {
    if (window.confirm('Purge all computational operational items and structural metadata dumps?')) {
      clearAllBatchItems();
      addToast('Staging buffer cleared successfully', 'info');
    }
  };

  const handleStatusChange = (value: StatusValue) => {
    statusFilterStore.set(value);
    setIsFilterOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentStatusLabel = statusOptions.find(opt => opt.value === statusFilter)?.label || 'Filters';

  return (
    <div 
      className={`w-full flex items-center justify-between gap-3 py-1.5 select-none transition-opacity duration-300 ${
        hasItems ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className='flex-1 max-w-xs sm:max-w-sm'>
        <Input
          type="text"
          placeholder="Search by filename..."
          value={searchQuery}
          onChange={(e) => searchQueryStore.set(e.target.value)}
          size="md"
          className="font-medium"
          prefix={
            <svg className="w-3.5 h-3.5 text-(--fg-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="relative" ref={filterRef}>
          <Tooltip content={currentStatusLabel} position="left">
            <Button
              variant="outline"
              iconOnly
              size="md"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              aria-label="Filter working stream array by engine status"
              className="text-(--fg-muted) hover:text-(--fg-strong) hover:bg-(--bg-muted) rounded-md"
            >
              <Icon name='filter' className="w-4 h-4" />
            </Button>
          </Tooltip>
          
          {isFilterOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-(--bg) border border-(--border) rounded-md shadow-xl z-30 overflow-hidden animate-fadeIn space-y-1">
              {statusOptions.map(opt => (
                <button
                  key={opt.value}
                  className={`w-full text-left px-3 py-1.5 font-medium text-xs transition-colors block
                    ${statusFilter === opt.value 
                      ? 'text-(--accent) bg-(--bg-muted)/50 font-semibold' 
                      : 'text-(--fg) hover:bg-(--bg-muted)/70'
                    }`}
                  onClick={() => handleStatusChange(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <Tooltip content="Purge staging stack" position="left">
          <Button
            variant="outline"
            size="md"
            iconOnly
            onClick={handleClearAll}
            aria-label="Purge data pipeline staging array completely"
            className="border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-md"
          >
            <Icon name='clear' className="w-4 h-4" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}