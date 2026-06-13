import { 
  useState,
  useRef, 
  useEffect, 
  useCallback 
} from 'react';

import { useStore } from '@nanostores/react';
import { 
  addBatchItems, 
  addToast, 
  batchOrder 
} from '@/app/stores';
import { 
  validateImageSize, 
  MAX_IMAGE_SIZE_MB 
} from '@/lib/engine';

import Spinner from '@/app/components/ui/Spinner';
import Icon from '@/app/components/ui/Icon';

export default function Dropzone() {
  const order = useStore(batchOrder);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const hasItems = order.length > 0;

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      addToast('No valid image files detected', 'info');
      return;
    }

    setIsProcessing(true);
    const startTime = Date.now();
    const validFiles: File[] = [];

    for (const file of fileArray) {
      if (!validateImageSize(file, MAX_IMAGE_SIZE_MB)) {
        addToast(`${file.name} exceeds ${MAX_IMAGE_SIZE_MB}MB safety limit`, 'error');
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length) {
      addBatchItems(validFiles);
      addToast(`Successfully staged ${validFiles.length} image(s)`, 'success');
    }

    const elapsed = Date.now() - startTime;
    const minDisplayTime = 300;
    if (elapsed < minDisplayTime) {
      await new Promise(resolve => setTimeout(resolve, minDisplayTime - elapsed));
    }

    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  // --- Global Window Drag & Drop Capturer (Ghost Mode) ---
  useEffect(() => {
    const handleWindowDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types.includes('Files')) {
        setIsDragging(true);
      }
    };

    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault(); // Diwajibkan oleh spesifikasi HTML5 agar event drop terpicu
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (e.clientX === 0 && e.clientY === 0) {
        setIsDragging(false);
      }
    };

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer?.files.length) {
        processFiles(e.dataTransfer.files);
      }
    };

    window.addEventListener('dragenter', handleWindowDragEnter);
    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragenter', handleWindowDragEnter);
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, [processFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processFiles(e.target.files);
  };

  if (hasItems) {
    if (!isDragging) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-950/15 dark:bg-black/30 backdrop-blur-xs pointer-events-none select-none animate-fadeIn">
        <div className="w-full max-w-xl p-8 border-2 border-dashed border-(--accent) bg-(--bg) rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-3 text-center scale-98 animate-tooltipIn">
          <Icon name="upload" className="w-10 h-10 text-(--accent) animate-bounce" />
          <p className="text-sm font-semibold text-(--fg-strong)">Drop items anywhere to attach into your batch array</p>
          <p className="text-xs text-(--fg-muted)">Automatic resolution compression rule engine is armed</p>
        </div>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => !isProcessing && fileInputRef.current?.click()}
      onKeyDown={(e) => e.key === 'Enter' && !isProcessing && fileInputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 cursor-pointer select-none flex flex-col items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-(--accent-ring)
        ${isDragging ? 'border-(--accent) bg-(--accent-soft)' : 'border-(--border) bg-(--bg-surface) hover:bg-(--bg-muted)/40'}
        ${isProcessing ? 'opacity-60 pointer-events-none' : ''}`}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        multiple 
        onChange={handleFileInput} 
        disabled={isProcessing} 
      />
      
      <div className="flex flex-col items-center gap-3 max-w-sm">
        {isProcessing ? (
          <div className="flex flex-col items-center gap-2 animate-fadeIn">
            <Spinner size="lg" />
            <p className="text-xs font-mono font-medium text-(--fg-muted)">Allocating stream vectors...</p>
          </div>
        ) : (
          <>
            <Icon name='upload' className='text-(--fg-dim) w-6 h-6' />
            <div className="space-y-1">
              <p className="text-md font-semibold text-(--fg-strong)">Drag & drop production images or click to explore</p>
              <p className="text-sm text-(--fg-muted) leading-normal">
                Supports verified formats (JPEG, PNG, WebP up to {MAX_IMAGE_SIZE_MB}MB individual cap limits)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}