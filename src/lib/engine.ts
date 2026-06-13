// src/app/lib/engine.ts

export type ProviderId = 'groq' | 'mistral' | 'openrouter' | 'cloudflare' | 'google' | 'custom';

export interface ModelConfig {
  id: string;
  label: string;
  pricePerMillion?: number;
}

export interface EngineOption {
  id: ProviderId;
  label: string;
  models: ModelConfig[];
  keyPrefix: string;
  apiUrl: string;
  docs: string;
  isFree: boolean;
  isCustom: boolean;
  needsAccountId?: boolean;
}

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
      { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini (Vision)', pricePerMillion: 0.15 },
      { id: 'llava/llava-13b', label: 'LLaVA 13B', pricePerMillion: 0.2 },
      { id: 'qwen/qwen-vl-plus', label: 'Qwen VL Plus', pricePerMillion: 3.0 },
    ],
    keyPrefix: 'sk-',
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
    id: 'google',
    label: 'Google',
    models: [
      { id: 'gemini-3.5-flash', label: 'gemini-3.5-flash', pricePerMillion: 0 },
      { id: 'gemini-3.5-pro', label: 'gemini-3.5-pro', pricePerMillion: 0 },
      { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash Lite', pricePerMillion: 0 }
    ],
    keyPrefix: 'AQ.',
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
    docs: 'https://aistudio.google.com/app/apikey',
    isFree: false,
    isCustom: false,
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
  google: 'gemini-2.0-flash',
  custom: '',
};

export type StatusOption = { value: string; label: string };
export const STATUS_OPTIONS: StatusOption[] = [
  { value: 'all', label: 'All' },
  { value: 'success', label: 'Success' },
  { value: 'pending', label: 'Pending' },
  { value: 'error', label: 'Error' },
];

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

export const MAX_TITLE_LENGTH = 200;
export const MAX_KEYWORDS_COUNT = 50;
export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_IMAGE_WIDTH = 1024;
export const DEFAULT_CATEGORY: CategoryKey = '3';

export const STORAGE_KEYS = {
  PROVIDER: 'adogen_provider',
  MODEL: 'adogen_model',
  API_KEY_GROQ: 'adogen_apiKey_groq',
  API_KEY_MISTRAL: 'adogen_apiKey_mistral',
  API_KEY_OPENROUTER: 'adogen_apiKey_openrouter',
  API_KEY_CLOUDFLARE: 'adogen_apiKey_cloudflare',
  API_KEY_GOOGLE: 'adogen_apiKey_google',     // new
  API_KEY_CUSTOM: 'adogen_apiKey_custom',
  CLOUDFLARE_ACCOUNT_ID: 'adogen_cloudflare_account_id',
  MAX_TITLE_LENGTH: 'adogen_max_title_length',
  MAX_KEYWORDS: 'adogen_max_keywords',
  ENHANCED_KEYWORDS: 'adogen_enhanced_keywords',
  CUSTOM_PROMPT: 'adogen_custom_prompt',
  BATCH_DELAY: 'adogen_batch_delay',
  PLATFORM: 'adogen_platform',
  CUSTOM_ENDPOINT: 'adogen_custom_endpoint',
  CUSTOM_MODEL_NAME: 'adogen_custom_model_name',
  FALLBACK_QUEUE: 'adogen_fallback_queue',
  PROVIDER_MODELS: 'adogen_provider_models',
};


export const FALLBACK_PRIORITY: ProviderId[] = ['groq', 'mistral', 'openrouter', 'google', 'cloudflare'];

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

export const resizeImage = (file: File, maxWidth = MAX_IMAGE_WIDTH): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const validateImageSize = (file: File, maxSizeMB = MAX_IMAGE_SIZE_MB): boolean => {
  const maxSizeInBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

export const exportBatchToCSV = (dataList: any[]) => {
  const clean = (str: string) =>
    str.replace(/\n/g, ' ').replace(/"/g, '""').trim();

  const headers = 'Filename,Title,Keywords,Category,Releases';
  const rows = dataList
    .map((item) => {
      const fName = clean(item.filename);
      const title = clean(item.title).substring(0, MAX_TITLE_LENGTH);
      const keywords = clean(item.keywords)
        .split(',')
        .map((k: string) => k.trim())
        .filter((k: string) => k !== '')
        .join(', ');
      const category = item.category || DEFAULT_CATEGORY;
      const releases = clean(item.releases || '');
      return `"${fName}","${title}","${keywords}",${category},"${releases}"`;
    })
    .join('\n');

  const blob = new Blob(['\ufeff' + headers + '\n' + rows], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `adogen_batch_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const DEFAULT_METADATA_PROMPT = (maxTitle: number, maxKeywords: number, enhanced: boolean) => `Act as a metadata machine. You must output EXACTLY in the format below. Do not add any conversational text.

TITLE: [Max ${maxTitle} chars. If exceeds, truncate.]
DESCRIPTION: [2-3 sentences. If content is unclear, output 'N/A']
KEYWORD: [${maxKeywords} keywords max, comma separated. If fewer, output available only.]
CATEGORY: [ONLY the ID number from the list. If ID is unknown, output '3']

LIST FOR CATEGORY ID:
${Object.entries(STOCK_CATEGORIES).map(([id, name]) => `${id}:${name}`).join(', ')}

${enhanced ? "CRITICAL: Keywords must be industry-specific and SEO optimized." : "Use direct and relevant keywords."}

STRICT FORMAT:
TITLE: ...
DESCRIPTION: ...
KEYWORD: ...
CATEGORY: ...`;

export const PROMPTS_BY_PLATFORM: Record<string, (maxTitle: number, maxKeywords: number, enhanced: boolean) => string> = {
  shutterstock: (maxTitle, maxKeywords, enhanced) => 
    `For Shutterstock: max title ${maxTitle} chars, keywords min 7 max ${maxKeywords}. ${DEFAULT_METADATA_PROMPT(maxTitle, maxKeywords, enhanced)}`,
  
  adobe: (maxTitle, maxKeywords, enhanced) => 
    `For Adobe Stock: max title ${maxTitle} chars, keywords min 7 max ${maxKeywords}. Avoid "best", "amazing". ${DEFAULT_METADATA_PROMPT(maxTitle, maxKeywords, enhanced)}`,
  
  istock: (maxTitle, maxKeywords, enhanced) => 
    `For iStock: max title ${maxTitle} chars, keywords min 10 max ${maxKeywords}. ${DEFAULT_METADATA_PROMPT(maxTitle, maxKeywords, enhanced)}`,
  
  freepik: (maxTitle, maxKeywords, enhanced) => 
    `For Freepik: title ${Math.max(50, maxTitle)} chars, keywords 15-${maxKeywords}. ${DEFAULT_METADATA_PROMPT(maxTitle, maxKeywords, enhanced)}`,
  
  default: (maxTitle, maxKeywords, enhanced) => 
    DEFAULT_METADATA_PROMPT(maxTitle, maxKeywords, enhanced),
};

export function parseMetadataResponse(text: string): {
  title: string;
  description: string;
  keywords: string;
  category?: string;
} {
  const titleMatch = text.match(/TITLE:\s*(.+)/i);
  const descMatch = text.match(/DESCRIPTION:\s*(.+)/i);
  const kwMatch = text.match(/KEYWORD:\s*(.+)/i);
  const catMatch = text.match(/CATEGORY:\s*(.+)/i);
  return {
    title: titleMatch ? titleMatch[1].trim() : '',
    description: descMatch ? descMatch[1].trim() : '',
    keywords: kwMatch ? kwMatch[1].trim() : '',
    category: catMatch ? catMatch[1].trim() : undefined,
  };
}

export function validateMetadata(
  metadata: { title: string; description: string; keywords: string; category?: string },
  maxTitleLength: number = MAX_TITLE_LENGTH,
  maxKeywords: number = MAX_KEYWORDS_COUNT,
  platform: string = 'default'
) {
  const errors: string[] = [];
  if (metadata.title.length > maxTitleLength) {
    errors.push(`Title exceeds ${maxTitleLength} characters`);
  }
  const keywordList = metadata.keywords.split(',').map(k => k.trim()).filter(Boolean);
  if (keywordList.length > maxKeywords) {
    errors.push(`Keywords exceed ${maxKeywords} items`);
  }
  if (keywordList.length < 15) {
    errors.push('Keywords must be at least 15 items');
  }
  if (platform === 'adobe') {
    if (!metadata.category) {
      errors.push('Category is required for Adobe Stock');
    } else if (!STOCK_CATEGORIES[metadata.category]) {
      errors.push(`Invalid category: ${metadata.category}`);
    }
  }
  return { isValid: errors.length === 0, errors };
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}