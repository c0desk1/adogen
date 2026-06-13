import { useStore } from '@nanostores/react';
import { useRef } from 'react';
import {
  selectedProviderStore,
  batchItemsMap,
  batchOrder,
  addToast,
  openDrawer,
  addBatchItems,
  triggerGeneration,
  sidebarCollapsedStore,
} from '@/app/stores';
import { MAX_IMAGE_SIZE_MB, validateImageSize, exportBatchToCSV } from '@/lib/engine';
import Button from '@/app/components/ui/Button';
import SettingsPanel from './SettingsPanel';
import Icon from '@/app/components/ui/Icon';
import Status from '@/app/components/ui/Status';
import { cn } from '@/lib/utils';

export default function Toolbar() {
  const provider = useStore(selectedProviderStore);
  const items = useStore(batchItemsMap);
  const order = useStore(batchOrder);
  const collapsed = useStore(sidebarCollapsedStore);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeItem = order.find(id => items[id]?.status === 'generating');
  const activeProvider = activeItem ? items[activeItem].currentProvider : null;
  const isGenerating = !!activeItem;

  const hasItems = order.length > 0;
  const pendingIds = order.filter(id => items[id]?.status === 'idle');
  const successItems = order.filter(id => items[id]?.status === 'success');

  const getStatusProps = () => {
    if (isGenerating && activeProvider) {
      const isFallback = activeProvider !== provider;
      return {
        title: isFallback ? 'Trying using' : 'Generating using',
        subtitle: activeProvider.toUpperCase(),
        variant: isFallback ? ('warning' as const) : ('info' as const),
        dotType: 'pulse' as const,
      };
    }
    if (hasItems && pendingIds.length === 0 && successItems.length > 0) {
      return { title: 'Complete', variant: 'success' as const, dotType: 'filled' as const };
    }
    return { title: 'Ready', variant: 'neutral' as const, dotType: 'filled' as const };
  };

  const statusProps = getStatusProps();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files?.length) return;
    const validFiles = Array.from(e.target.files).filter(f => validateImageSize(f, MAX_IMAGE_SIZE_MB));
    if (validFiles.length) {
      addBatchItems(validFiles);
      addToast(`${validFiles.length} files added`, 'success');
    } else {
      addToast('No valid files added (Check size limits)', 'error');
    }
    e.target.value = '';
  };

  const handleGenerateBatch = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (pendingIds.length === 0) return;
    await triggerGeneration();
  };

  const toggleSidebar = () => {
    const current = document.documentElement.getAttribute('data-sidebar');
    const newState = current === 'collapsed' ? 'expanded' : 'collapsed';
    
    document.documentElement.setAttribute('data-sidebar', newState);
    document.cookie = `sidebar_state=${newState}; path=/; max-age=604800; SameSite=Lax`;
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 border-b border-(--border-subtle) bg-(--bg)">
      <div className="flex items-center gap-3">
        <Button 
          id='sidebar-trigger' 
          size='md' 
          variant='ghost'
          iconOnly
          onClick={toggleSidebar}
        >
          <Icon name="sidebar-right" className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
        
        <Status 
          title={statusProps.title}
          subtitle={statusProps.subtitle}
          variant={statusProps.variant}
          dotType={statusProps.dotType}
          size="md"
        />
      </div>

      <div className="flex items-center gap-2">
        <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={handleFileChange} />
        
        {successItems.length > 0 && (
          <Button 
            type="button" 
            variant="outline" 
            size="md" 
            onClick={(e) => { e.preventDefault(); exportBatchToCSV(successItems.map(id => ({ filename: items[id].filename, title: items[id].metadata?.title || '', keywords: items[id].metadata?.keywords || '', category: items[id].metadata?.category || '' }))); addToast('Export started', 'success'); }} disabled={isGenerating} 
            className="hidden md:flex"
            prefix={<Icon name="export" className="w-4 h-4" />}
          >
            Export
          </Button>
        )}
        {successItems.length > 0 && (
          <Button 
            type="button" 
            iconOnly 
            variant="outline" 
            size="md" 
            onClick={(e) => { e.preventDefault(); exportBatchToCSV(successItems.map(id => ({ filename: items[id].filename, title: items[id].metadata?.title || '', keywords: items[id].metadata?.keywords || '', category: items[id].metadata?.category || '' }))); addToast('Export started', 'success'); }} disabled={isGenerating} 
            className="flex md:hidden"
          >
            <Icon name="export" className="w-4 h-4" />
          </Button>
        )}
        {hasItems && (
          <Button 
            type="button" 
            variant="outline" 
            size="md" 
            onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }} disabled={isGenerating} 
            className="hidden md:flex"
            prefix={<Icon name="add" className="w-4 h-4" />}
          >
            Add
          </Button>
        )}
        {hasItems && (
          <Button type="button" iconOnly variant="outline" size="md" onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }} disabled={isGenerating} className="flex md:hidden">
            <Icon name="add" className="w-4 h-4" />
          </Button>
        )}
        {hasItems && (
          <Button 
            type="button" 
            variant="primary" 
            size="md" 
            onClick={handleGenerateBatch} 
            loading={isGenerating} 
            disabled={isGenerating || pendingIds.length === 0}
            className="hidden md:flex"
            prefix={<Icon name="generate" className="w-4 h-4" />}
          >
            Generate ({pendingIds.length})
          </Button>
        )}
        {hasItems && (
          <Button 
            type="button" 
            variant="primary" 
            size="md"
			      iconOnly 
            onClick={handleGenerateBatch} 
            loading={isGenerating} 
            disabled={isGenerating || pendingIds.length === 0}
            className="flex md:hidden"
          >
            <Icon name="generate" className="w-4 h-4" />
          </Button>
        )}
        <Button type="button" variant="outline" size="md" iconOnly disabled={isGenerating} onClick={(e) => { e.preventDefault(); openDrawer(<SettingsPanel />); }} className="flex md:hidden">
          <Icon name="settings" className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}