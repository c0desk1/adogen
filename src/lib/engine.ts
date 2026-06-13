// src/lib/engine.ts
// ============================================================================
//  TYPES & CONSTANTS FOR AI ENGINE, METADATA, STORAGE, ETC.
// ============================================================================

// ----------------------------------------------------------------------------
//  ENGINE PROVIDERS & MODELS
// ----------------------------------------------------------------------------
export type ProviderId = 'groq' | 'mistral' | 'openrouter' | 'cloudflare' | 'custom';

export type ModelConfig = {
  id: string;
  label: string;
  pricePerMillion?: number;
};

export type EngineOption = {
  id: ProviderId;
  label: string;
  models: ModelConfig[];
  keyPrefix: string;
  apiUrl: string;
  docs: string;
  isFree: boolean;
  isCustom: boolean;
  needsAccountId?: boolean;
};

export const ENGINE_OPTIONS: EngineOption[] = [
  {
    id: 'groq',
    label: 'Groq',
    models: [
      { id: 'meta-llama/llama-4-scout-17b-16e-instruct', label: 'Llama 4 Scout (Fast)', pricePerMillion: 0.15 },
      { id: 'llama-3.1-70b-versatile', label: 'Llama 3.1 70B', pricePerMillion: 0.59 },
      { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B', pricePerMillion: 0.27 },
    ],
    keyPrefix: 'gsk_',
    apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
    docs: 'https://console.groq.com/keys',
    isFree: false,
    isCustom: false,
  },
  {
    id: 'mistral',
    label: 'Mistral AI',
    models: [
      { id: 'mistral-medium-2508', label: 'Mistral Medium (Accurate)', pricePerMillion: 2.75 },
      { id: 'mistral-large-2407', label: 'Mistral Large', pricePerMillion: 8.0 },
      { id: 'pixtral-12b-2409', label: 'Pixtral 12B (Multimodal)', pricePerMillion: 1.0 },
    ],
    keyPrefix: '',
    apiUrl: 'https://api.mistral.ai/v1/chat/completions',
    docs: 'https://console.mistral.ai/api-keys/',
    isFree: false,
    isCustom: false,
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    models: [
      { id: 'llava/llava-13b', label: 'LLaVA 13B', pricePerMillion: 0.2 },
      { id: 'qwen/qwen-vl-plus', label: 'Qwen VL Plus', pricePerMillion: 3.0 },
      { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini (Vision)', pricePerMillion: 0.15 },
    ],
    keyPrefix: '',
    apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
    docs: 'https://openrouter.ai/keys',
    isFree: false,
    isCustom: false,
  },
  {
    id: 'cloudflare',
    label: 'Cloudflare Workers AI',
    models: [
      { id: '@cf/llava-hf/llava-1.5-7b-hf', label: 'LLaVA 1.5 7B (Vision)' },
      { id: '@cf/microsoft/phi-3.5-vision-instruct', label: 'Phi 3.5 Vision' },
    ],
    keyPrefix: '',
    apiUrl: '',
    docs: 'https://developers.cloudflare.com/workers-ai/',
    isFree: false,
    isCustom: false,
    needsAccountId: true,
  },
  {
    id: 'custom',
    label: 'Custom Endpoint',
    models: [],
    keyPrefix: '',
    apiUrl: '',
    docs: '',
    isFree: false,
    isCustom: true,
  },
] as const;

export const DEFAULT_MODEL: Record<ProviderId, string> = {
  groq: 'meta-llama/llama-4-scout-17b-16e-instruct',
  mistral: 'mistral-medium-2508',
  openrouter: 'llava/llava-13b',
  cloudflare: '@cf/llava-hf/llava-1.5-7b-hf',
  custom: '',
};

// ----------------------------------------------------------------------------
//  STATUS OPTIONS (for batch filtering)
// ----------------------------------------------------------------------------
export type StatusOption = { value: string; label: string };
export const STATUS_OPTIONS: StatusOption[] = [
  { value: 'all', label: 'All' },
  { value: 'success', label: 'Success' },
  { value: 'pending', label: 'Pending' },
  { value: 'error', label: 'Error' },
];

// ----------------------------------------------------------------------------
//  ADOBE STOCK CATEGORIES (ID -> Label)
// ----------------------------------------------------------------------------
export const STOCK_CATEGORIES: Record<string, string> = {
  '1': 'Animals',
  '2': 'Buildings',
  '3': 'Business',
  '4': 'Drinks',
  '5': 'Environment',
  '6': 'States of Mind',
  '7': 'Food',
  '8': 'Graphic Resources',
  '9': 'Hobbies',
  '10': 'Industry',
  '11': 'Landscapes',
  '12': 'Lifestyle',
  '13': 'People',
  '14': 'Plants',
  '15': 'Culture',
  '16': 'Science',
  '17': 'Social Issues',
  '18': 'Sports',
  '19': 'Technology',
  '20': 'Transport',
  '21': 'Travel',
};

export type CategoryKey = keyof typeof STOCK_CATEGORIES;
export type CategoryLabel = typeof STOCK_CATEGORIES[CategoryKey];

// ----------------------------------------------------------------------------
//  METADATA LIMITS & DEFAULTS
// ----------------------------------------------------------------------------
export const MAX_TITLE_LENGTH = 200;
export const MAX_KEYWORDS_COUNT = 50;
export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_IMAGE_WIDTH = 1024;
export const DEFAULT_CATEGORY: CategoryKey = '3';

// ----------------------------------------------------------------------------
//  STORAGE KEYS (for localStorage)
// ----------------------------------------------------------------------------
export const STORAGE_KEYS = {
  PROVIDER: 'adogen_provider',
  MODEL: 'adogen_model',
  API_KEY_GROQ: 'adogen_apiKey_groq',
  API_KEY_MISTRAL: 'adogen_apiKey_mistral',
  API_KEY_OPENROUTER: 'adogen_apiKey_openrouter',
  API_KEY_CLOUDFLARE: 'adogen_apiKey_cloudflare',
  API_KEY_CUSTOM: 'adogen_apiKey_custom',
  CLOUDFLARE_ACCOUNT_ID: 'adogen_cloudflare_account_id',
  MAX_TITLE_LENGTH: 'adogen_max_title_length',
  MAX_KEYWORDS: 'adogen_max_keywords',
  CUSTOM_PROMPT: 'adogen_custom_prompt',
  BATCH_DELAY: 'adogen_batch_delay',
  PLATFORM: 'adogen_platform',
  CUSTOM_ENDPOINT: 'adogen_custom_endpoint',
  CUSTOM_MODEL_NAME: 'adogen_custom_model_name',
  FALLBACK_QUEUE: 'adogen_fallback_queue',
};

// ----------------------------------------------------------------------------
//  FALLBACK PRIORITY & HELPERS
// ----------------------------------------------------------------------------
export const FALLBACK_PRIORITY: ProviderId[] = ['groq', 'mistral', 'openrouter', 'cloudflare'];

export function getDefaultModelForProvider(providerId: ProviderId): string {
  const provider = ENGINE_OPTIONS.find(p => p.id === providerId);
  if (provider && provider.models.length > 0) {
    return provider.models[0].id;
  }
  return DEFAULT_MODEL[providerId] || '';
}

export function requiresAccountId(providerId: ProviderId): boolean {
  return ENGINE_OPTIONS.find(p => p.id === providerId)?.needsAccountId === true;
}

export function isFreeProvider(providerId: ProviderId): boolean {
  return ENGINE_OPTIONS.find(p => p.id === providerId)?.isFree === true;
}

export function isCustomProvider(providerId: ProviderId): boolean {
  return ENGINE_OPTIONS.find(p => p.id === providerId)?.isCustom === true;
}