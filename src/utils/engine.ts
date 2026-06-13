//src/lib/engine.ts

export type statusOptions = {
  value: string;
  label: string;
}

export const ENGINE_OPTIONS = [
  {
    id: "groq",
    label: "Groq",
    models: [
      { id: "meta-llama/llama-4-scout-17b-16e-instruct", label: "Llama 4 Scout (Fast)", pricePerMillion: 0.15 },
      { id: "llama-3.1-70b-versatile", label: "Llama 3.1 70B", pricePerMillion: 0.59 },
      { id: "mixtral-8x7b-32768", label: "Mixtral 8x7B", pricePerMillion: 0.27 },
    ],
    keyPrefix: "gsk_",
    apiUrl: "https://api.groq.com/openai/v1/chat/completions",
    docs: "https://console.groq.com/keys",
    isFree: false,
    isCustom: false,
  },
  {
    id: "mistral",
    label: "Mistral AI",
    models: [
      { id: "mistral-medium-2508", label: "Mistral Medium (Accurate)", pricePerMillion: 2.75 },
      { id: "mistral-large-2407", label: "Mistral Large", pricePerMillion: 8.0 },
      { id: "pixtral-12b-2409", label: "Pixtral 12B (Multimodal)", pricePerMillion: 1.0 },
    ],
    keyPrefix: "",
    apiUrl: "https://api.mistral.ai/v1/chat/completions",
    docs: "https://console.mistral.ai/api-keys/",
    isFree: false,
    isCustom: false,
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    models: [
      { id: "llava/llava-13b", label: "LLaVA 13B", pricePerMillion: 0.2 },
      { id: "qwen/qwen-vl-plus", label: "Qwen VL Plus", pricePerMillion: 3.0 },
      { id: "openai/gpt-4o-mini", label: "GPT-4o Mini (Vision)", pricePerMillion: 0.15 },
    ],
    keyPrefix: "",
    apiUrl: "https://openrouter.ai/api/v1/chat/completions",
    docs: "https://openrouter.ai/keys",
    isFree: false,
    isCustom: false,
  },
  {
    id: "cloudflare",
    label: "Cloudflare Workers AI",
    models: [
      { id: "@cf/llava-hf/llava-1.5-7b-hf", label: "LLaVA 1.5 7B (Vision)" },
      { id: "@cf/microsoft/phi-3.5-vision-instruct", label: "Phi 3.5 Vision" },
    ],
    keyPrefix: "",
    apiUrl: "",
    docs: "https://developers.cloudflare.com/workers-ai/",
    isFree: false,
    isCustom: false,
    needsAccountId: true,
  },
  {
    id: "custom",
    label: "Custom Endpoint",
    models: [],
    keyPrefix: "",
    apiUrl: "",
    docs: "",
    isFree: false,
    isCustom: true,
  },
] as const;

export const DEFAULT_MODEL: Record<string, string> = {
  groq: "meta-llama/llama-4-scout-17b-16e-instruct",
  mistral: "mistral-medium-2508",
};

export const STATUS_OPTIONS =
  [
    { value: 'all', label: 'All' },
    { value: 'success', label: 'Success' },
    { value: 'pending', label: 'Pending' },
    { value: 'error', label: 'Error' },
] as statusOptions[];