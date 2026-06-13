//src/app/stores/index.ts

import { atom, map } from 'nanostores';
import type { ReactNode } from 'react';
import {
  ENGINE_OPTIONS, 
  FALLBACK_PRIORITY,
  PROMPTS_BY_PLATFORM,
  STORAGE_KEYS,
  getDefaultModelForProvider, 
  resizeImage,
  type ProviderId, 
} from '@/lib/engine';

function persistentAtom<T>(key: string, defaultValue: T) {
  if (typeof window === 'undefined') return atom<T>(defaultValue);
  const stored = localStorage.getItem(key);
  const initial = stored ? (JSON.parse(stored) as T) : defaultValue;
  const store = atom<T>(initial);
  store.subscribe((v) => localStorage.setItem(key, JSON.stringify(v)));
  return store;
}

const initialModels: Record<ProviderId, string> = {} as any;
ENGINE_OPTIONS.forEach(opt => initialModels[opt.id] = opt.models[0]?.id || '');

export const selectedProviderStore = persistentAtom<ProviderId>(STORAGE_KEYS.PROVIDER, 'groq');
export const providerModelsStore = persistentAtom<Record<ProviderId, string>>(STORAGE_KEYS.PROVIDER_MODELS, initialModels);
export const groqKeyStore = persistentAtom<string>(STORAGE_KEYS.API_KEY_GROQ, '');
export const mistralKeyStore = persistentAtom<string>(STORAGE_KEYS.API_KEY_MISTRAL, '');
export const openrouterKeyStore = persistentAtom<string>(STORAGE_KEYS.API_KEY_OPENROUTER, '');
export const cloudflareKeyStore = persistentAtom<string>(STORAGE_KEYS.API_KEY_CLOUDFLARE, '');
export const googleKeyStore = persistentAtom<string>(STORAGE_KEYS.API_KEY_GOOGLE, '');
export const customApiKeyStore = persistentAtom<string>(STORAGE_KEYS.API_KEY_CUSTOM, '');
export const cloudflareAccountIdStore = persistentAtom<string>(STORAGE_KEYS.CLOUDFLARE_ACCOUNT_ID, '');
export const customEndpointStore = persistentAtom<string>(STORAGE_KEYS.CUSTOM_ENDPOINT, '');
export const customModelNameStore = persistentAtom<string>(STORAGE_KEYS.CUSTOM_MODEL_NAME, '');
export const maxTitleLengthStore = persistentAtom<number>(STORAGE_KEYS.MAX_TITLE_LENGTH, 200);
export const maxKeywordsStore = persistentAtom<number>(STORAGE_KEYS.MAX_KEYWORDS, 50);
export const enhancedKeywordsStore = persistentAtom<boolean>(STORAGE_KEYS.ENHANCED_KEYWORDS, true);
export const batchDelayStore = persistentAtom<number>(STORAGE_KEYS.BATCH_DELAY, 3);
export const customPromptStore = persistentAtom<string>(STORAGE_KEYS.CUSTOM_PROMPT, '');
export const platformStore = persistentAtom<string>(STORAGE_KEYS.PLATFORM, 'default');
export const fallbackQueueStore = persistentAtom<ProviderId[]>(STORAGE_KEYS.FALLBACK_QUEUE, []);

export const selectedModelStore = {
  get: () => {
    const provider = selectedProviderStore.get();
    const models = providerModelsStore.get();
    return models[provider] || getDefaultModelForProvider(provider);
  },
  set: (modelId: string) => {
    const provider = selectedProviderStore.get();
    const current = providerModelsStore.get();
    providerModelsStore.set({ ...current, [provider]: modelId });
  },
};

export type BatchStatus = 'idle' | 'generating' | 'success' | 'failed';

export interface BatchItem { 
  id: string; 
  file: File; 
  filename: string; 
  status: BatchStatus; 
  metadata?: any; 
  error?: string; 
  currentProvider?: string;
  fallbackUsed?: boolean;
}

export interface ToastItem {
  id: string;
  message: string;
  variant: 'success' | 'error' | 'info' | 'warning' | 'loading' | 'custom';
  duration?: number;
}

export const batchItemsMap = map<Record<string, BatchItem>>({});
export const batchOrder = atom<string[]>([]);

export function addBatchItems(files: File[]) {
  const newItems: Record<string, BatchItem> = {};
  const newIds: string[] = [];
  files.forEach(f => {
    const id = Math.random().toString(36).substring(2, 9);
    newItems[id] = { id, file: f, filename: f.name, status: 'idle' };
    newIds.push(id);
  });
  batchItemsMap.set({ ...batchItemsMap.get(), ...newItems });
  batchOrder.set([...batchOrder.get(), ...newIds]);
}

export function updateBatchItem(id: string, updates: Partial<BatchItem>) {
  const current = batchItemsMap.get()[id];
  if (current) batchItemsMap.setKey(id, { ...current, ...updates });
}

export function removeBatchItem(id: string) {
  const items = { ...batchItemsMap.get() };
  delete items[id];
  batchItemsMap.set(items);
  batchOrder.set(batchOrder.get().filter(i => i !== id));
}

export function clearAllBatchItems() { batchItemsMap.set({}); batchOrder.set([]); }

export async function callBackendApi(file: File, engine: ProviderId, model: string, apiKey: string) {
  const base64 = await resizeImage(file, 800);
  const platform = platformStore.get() || 'default';
  const promptGenerator = PROMPTS_BY_PLATFORM[platform] || PROMPTS_BY_PLATFORM.default;
  
  const dynamicPrompt = promptGenerator(
    maxTitleLengthStore.get(),
    maxKeywordsStore.get(),
    enhancedKeywordsStore.get()
  );

  const response = await fetch('/api/adogen', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageBase64: base64,
      filename: file.name,
      engine,
      model,
      apiKey,
      cloudflareAccountId: cloudflareAccountIdStore.get(),
      customEndpoint: customEndpointStore.get(),
      customModel: customModelNameStore.get(),
      maxTitle: maxTitleLengthStore.get(),
      maxKeywords: maxKeywordsStore.get(),
      enhancedKeywords: enhancedKeywordsStore.get(),
      customPrompt: customPromptStore.get() || dynamicPrompt,
      platform: platform,
    })
  });

  if (!response.ok) throw new Error(await response.text());
  return await response.json();
}

export async function triggerGeneration(targetId?: string) {
  const selectedProvider = selectedProviderStore.get();
  
  const keyStores: any = { 
    groq: groqKeyStore, 
    mistral: mistralKeyStore, 
    openrouter: openrouterKeyStore, 
    google: googleKeyStore, 
    cloudflare: cloudflareKeyStore, 
    custom: customApiKeyStore 
  };
  
  const potentialProviders = [selectedProvider, ...FALLBACK_PRIORITY];
  const providersToTry = Array.from(new Set(potentialProviders)).filter(p => {
    if (p === 'custom') return false;
    if (p === 'cloudflare') return true;
    const hasKey = keyStores[p]?.get();
    return hasKey && hasKey.length > 0;
  });

  const delayMs = batchDelayStore.get() * 1000;
  const targets = targetId ? [targetId] : batchOrder.get().filter(id => batchItemsMap.get()[id]?.status === 'idle');
  
  if (targets.length === 0) return;

  for (const id of targets) {
    let success = false;
    let lastError = "";

    for (const provider of providersToTry) {
      const apiKey = keyStores[provider]?.get() || '';
      const model = providerModelsStore.get()[provider as ProviderId] || getDefaultModelForProvider(provider as ProviderId);
      
      try {
        updateBatchItem(id, { status: 'generating', currentProvider: provider });
        console.log(`%c[Attempting] ${provider} with model ${model}`, "color: #3b82f6");
        
        const item = batchItemsMap.get()[id];
        const metadata = await callBackendApi(item.file, provider as ProviderId, model, apiKey);
        
        updateBatchItem(id, { status: 'success', metadata, currentProvider: provider });
        success = true;
        break;
      } catch (e: any) { 
        lastError = e.message;
        console.warn(`%c[Failed] ${provider}: ${lastError}`, "color: #ef4444");
      }
    }

    if (!success) {
      updateBatchItem(id, { status: 'failed', error: lastError });
    }
    
    if (delayMs > 0 && targets.indexOf(id) !== targets.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}


export function updateFallbackQueue() {
    const allKeys: Record<string, string> = { groq: groqKeyStore.get(), mistral: mistralKeyStore.get(), openrouter: openrouterKeyStore.get(), google: googleKeyStore.get(), cloudflare: cloudflareKeyStore.get() };
    const available = FALLBACK_PRIORITY.filter(p => allKeys[p] && allKeys[p].length > 0);
    fallbackQueueStore.set(available);
}

export const toasts = atom<any[]>([]);
export const addToast = (message: string, variant: 'success' | 'error' | 'info' = 'info') => {
  const id = Math.random().toString(36).substr(2, 9);
  toasts.set([...toasts.get(), { id, message, variant }]);
  setTimeout(() => removeToast(id), 4000);
};
export const removeToast = (id: string) => toasts.set(toasts.get().filter(t => t.id !== id));
export const drawerStore = atom<{isOpen: boolean; content: ReactNode | null}>({ isOpen: false, content: null });
export const openDrawer = (content: ReactNode) => drawerStore.set({ isOpen: true, content });
export const closeDrawer = () => drawerStore.set({ isOpen: false, content: null });
export const sidebarCollapsedStore = persistentAtom<boolean>('adogen-sidebar-collapsed', false);
export const searchQueryStore = atom<string>('');
export const statusFilterStore = atom<string>('all');