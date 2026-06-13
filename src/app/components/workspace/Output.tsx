// src/app/beta/components/workspace/Output.tsx
import { useStore } from '@nanostores/react';
import { useEffect, useRef, useState } from 'react';

import {
  batchItemsMap,
  batchOrder,
  removeBatchItem,
  addToast,
  searchQueryStore,
  statusFilterStore,
  triggerGeneration,
} from '@/app/stores';

import { 
  STOCK_CATEGORIES
} from '@/lib/engine';

import Button from '@/app/components/ui/Button';
import Spinner from '@/app/components/ui/Spinner';
import Tooltip from '@/app/components/ui/Tooltip';
import Badge from '@/app/components/ui/Badge';
import Banner from '@/app/components/ui/Banner';
import Icon from '@/app/components/ui/Icon';

const copyToClipboard = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text);
    addToast(`${label} successfully copied to clipboard`, 'success');
  } catch {
    addToast(`Failed to allocate ${label} to clipboard stream`, 'error');
  }
};

export default function Output() {
  const items = useStore(batchItemsMap);
  const order = useStore(batchOrder);
  const searchQuery = useStore(searchQueryStore);
  const statusFilter = useStore(statusFilterStore);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const previewUrls = useRef<Map<string, string>>(new Map());

  const getPreviewUrl = (id: string, file: File): string => {
    if (previewUrls.current.has(id)) {
      return previewUrls.current.get(id)!;
    }
    const url = URL.createObjectURL(file);
    previewUrls.current.set(id, url);
    return url;
  };

  const revokePreviewUrl = (id: string) => {
    const url = previewUrls.current.get(id);
    if (url) {
      URL.revokeObjectURL(url);
      previewUrls.current.delete(id);
    }
  };

  useEffect(() => {
    return () => {
      previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrls.current.clear();
    };
  }, []);

  const handleRegenerate = async (id: string) => {
    try {
      await triggerGeneration(id);
    } catch (err) {
      addToast('Row processor optimization grid fault', 'error');
    }
  };

  const handleDeleteItem = (id: string) => {
    revokePreviewUrl(id);
    removeBatchItem(id);
    setConfirmDeleteId(null);
  };

  const filteredOrder = order.filter(id => {
    const item = items[id];
    if (!item) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (searchQuery && !item.filename.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-3.5 pb-6">
      {filteredOrder.map(id => {
        const item = items[id];
        if (!item) return null;
        
        const { status, metadata, error, filename } = item;
        const preview = getPreviewUrl(id, item.file);
        
        const isIdle = status === 'idle';
        const isGenerating = status === 'generating';
        const isSuccess = status === 'success';
        const isFailed = status === 'failed';

        let categoryDisplay = '';
        if (metadata?.category) {
          const categoryId = metadata.category;
          const categoryLabel = STOCK_CATEGORIES[categoryId] || metadata.category;
          categoryDisplay = `${categoryId} – ${categoryLabel}`;
        }

        return (
          <div 
            key={id} 
            className="group/card border border-(--border) rounded-lg bg-(--bg) shadow-xs transition-all duration-150"
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-(--border-subtle) bg-(--bg-muted)/20 select-none">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xs font-mono font-semibold text-(--fg-strong) truncate max-w-35 sm:max-w-md tracking-tight" title={filename}>
                  {filename}
                </span>
                <div className="shrink-0 flex items-center">
                  {isSuccess && <Badge variant="success" size="sm">Ready</Badge>}
                  {isFailed && <Badge variant="error" size="sm">Failed</Badge>}
                  {isGenerating && <Badge variant="warning" size="sm" className="animate-pulse">Processing</Badge>}
                  {isIdle && <Badge variant="default" size="sm">Queued</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {(isSuccess || isFailed || isGenerating) && (
                  <Tooltip content={isGenerating ? "Regenerating..." : "Regenerate item"} position="left">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      onClick={() => handleRegenerate(id)}
                      disabled={isGenerating}
                      aria-label="Re-optimize grid item"
                      className="text-(--fg-muted) hover:text-(--fg-strong) transition-colors"
                    >
                      {isGenerating ? (
                        <Spinner size="sm" />
                      ) : (
                        <Icon name='regenerate' className="w-4 h-4" />
                      )}
                    </Button>
                  </Tooltip>
                )}
                
                <Tooltip content="Purge from pipeline staging buffer" position="left">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    onClick={() => setConfirmDeleteId(id)}
                    disabled={isGenerating}
                    aria-label="Delete staged item"
                    className="text-(--fg-muted) hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <Icon name='delete' className="w-4 h-4" />
                  </Button>
                </Tooltip>
              </div>
            </div>
            <div className="p-4 flex flex-col sm:flex-row gap-4.5">
              
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-(--bg-muted) rounded-lg border border-(--border-subtle) overflow-hidden flex items-center justify-center shadow-xs select-none">
                <img src={preview} alt="" className="w-full h-full object-cover" loading="lazy" />
                {isGenerating && (
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center backdrop-blur-[0.5px]">
                    <div className="w-full h-[1.5px] bg-(--accent) shadow-[0_0_8px_var(--accent)] absolute top-0 left-0 animate-scan" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-3.5">
                {confirmDeleteId === id ? (
                  <div className="animate-fadeIn space-y-3 pt-1">
                    <Banner
                      variant="error"
                      message="Remove this specific asset from the current production workspace buffer?"
                      className="text-xs font-medium"
                    />
                    <div className="flex items-center gap-2 justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setConfirmDeleteId(null)} 
                        className="font-semibold"
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteItem(id)} 
                        className="font-semibold"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {(isIdle || isGenerating) && !isSuccess && (
                      <div className={`space-y-3.5 pt-0.5 select-none ${isGenerating ? 'animate-pulse' : ''}`}>
                        <div className="space-y-1.5">
                          <div className="h-3 w-24 bg-(--border-subtle) rounded" />
                          <div className="h-9 w-full bg-(--bg-muted)/40 border border-(--border-subtle) rounded-lg" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-3 w-16 bg-(--border-subtle) rounded" />
                          <div className="h-9 w-full bg-(--bg-muted)/40 border border-(--border-subtle) rounded-lg" />
                        </div>
                        <div className="flex items-center gap-4 pt-1 text-xs">
                          <div className="h-3.5 w-36 rounded bg-(--border-subtle)/70" />
                          <div className="h-3.5 w-24 rounded bg-(--border-subtle)/50" />
                        </div>
                      </div>
                    )}
                    {isSuccess && metadata && (
                      <div className="space-y-3 animate-fadeIn">
                        <div className="space-y-1 group/field relative">
                          <span className="block text-xs font-mono font-semibold uppercase tracking-wider text-(--fg-muted) mb-1 select-none">
                            Title
                          </span>
                          <div className="relative border border-(--border-subtle) bg-(--bg-surface) rounded-lg p-2.5 transition-all duration-150 focus-within:border-zinc-400 dark:focus-within:border-zinc-600">
                            <p className="text-sm font-medium text-(--fg-strong) leading-relaxed pr-8 select-text wrap-break-words">
                              {metadata.title}
                            </p>
                            <div className="absolute top-1.5 right-1.5 sm:opacity-0 group-hover/field:opacity-100 transition-opacity duration-150 select-none">
                              <Tooltip content="Copy title" position="left">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  iconOnly
                                  onClick={() => copyToClipboard(metadata.title, 'Title')}
                                  aria-label="Copy title payload text"
                                  className="shadow-xs text-(--fg-muted) hover:text-(--fg-strong)"
                                >
                                  <Icon name='copy' className='w-4 h-4' />
                                </Button>
                              </Tooltip>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1 group/field relative">
                          <span className="block text-xs font-mono font-semibold uppercase tracking-wider text-(--fg-muted) mb-1 select-none">
                            Keywords
                          </span>
                          <div className="relative border border-(--border-subtle) bg-(--bg-surface) rounded-lg p-2.5 transition-all duration-150 focus-within:border-zinc-400 dark:focus-within:border-zinc-600">
                            <p className="text-sm text-(--fg-muted) font-mono tracking-tight leading-relaxed pr-8 select-text wrap-break-words">
                              {metadata.keywords}
                            </p>
                            <div className="absolute top-1.5 right-1.5 sm:opacity-0 group-hover/field:opacity-100 transition-opacity duration-150 select-none">
                              <Tooltip content="Copy keywords" position="left">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  iconOnly
                                  onClick={() => copyToClipboard(metadata.keywords, 'Keywords')}
                                  aria-label="Copy keywords list payload"
                                  className="shadow-xs text-(--fg-muted) hover:text-(--fg-strong)"
                                >
                                  <Icon name='copy' className='w-4 h-4' />
                                </Button>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-0.5 text-xs select-none font-medium text-(--fg-muted)">
                          {metadata.category && (
                            <div className="flex items-center gap-1">
                              <span className="text-(--fg-dim)">Category:</span>
                              <span className="font-semibold text-(--fg-strong)">{categoryDisplay}</span>
                            </div>
                          )}
                          {item.currentProvider && (
                            <div className="flex items-center gap-1.5 sm:border-l sm:border-(--border-subtle) sm:pl-3.5">
                              <span className="text-(--fg-dim)">Inference Module:</span>
                              <span className="text-[10px] bg-(--bg-muted) border border-(--border-subtle) px-1.5 py-0.5 rounded font-bold text-(--fg-strong)">
                                {item.currentProvider}
                              </span>
                            </div>
                          )}
                        </div>
                        {item.fallbackUsed && (
                          <div className="pt-1">
                            <Banner 
                              variant="warning" 
                              message="Fallback Network Engaged: Traffic successfully routed to secondary engine array due to standard network baseline shift."
                              className="p-2 text-[11px] font-mono font-medium leading-relaxed rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {isFailed && error && (
                      <div className="pt-0.5 animate-fadeIn">
                        <Banner 
                          variant="error" 
                          message={`Matrix execution faulted: ${error}`}
                          className="p-2.5 text-[11px] font-mono font-medium leading-relaxed rounded-lg shadow-inner"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}