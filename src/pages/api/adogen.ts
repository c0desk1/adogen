// src/pages/api/generate.ts
import type { APIRoute } from 'astro';
import { z } from 'astro/zod';
import { MAX_TITLE_LENGTH, MAX_KEYWORDS_COUNT, parseMetadataResponse, STOCK_CATEGORIES, DEFAULT_METADATA_PROMPT } from '@/app/lib/engine';

const RequestSchema = z.object({
  imageBase64: z.string(),
  filename: z.string(),
  engine: z.enum(['groq', 'mistral', 'openrouter', 'google', 'cloudflare', 'custom']),
  model: z.string(),
  apiKey: z.string().optional(),
  cloudflareAccountId: z.string().optional(),
  customEndpoint: z.string().optional(),
  customModel: z.string().optional(),
  maxTitle: z.number().default(MAX_TITLE_LENGTH),
  maxKeywords: z.number().default(MAX_KEYWORDS_COUNT),
  enhancedKeywords: z.boolean().default(false),
  customPrompt: z.string().optional(),
  platform: z.string().default('default'),
});

async function callGroq(apiKey: string, model: string, prompt: string, imageBase64: string) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: [{ type: 'text', text: prompt }, { type: 'image_url', image_url: { url: imageBase64 } }] }],
      temperature: 0.1,
    }),
  });
  const data = await response.json() as any;
  console.error('Groq response:', data)
  if (!response.ok) throw new Error(data.error?.message || 'Groq API error');
  return data.choices[0].message.content;
}

async function callMistral(apiKey: string, model: string, prompt: string, imageBase64: string) {
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: [{ type: 'text', text: prompt }, { type: 'image_url', image_url: { url: imageBase64 } }] }],
      temperature: 0.1,
    }),
  });
  const data = await response.json() as any;
  console.error('Mistral response:', data)
  if (!response.ok) throw new Error(data.error?.message || 'Mistral API error');
  return data.choices[0].message.content;
}

async function callOpenRouter(apiKey: string, model: string, prompt: string, imageBase64: string) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: [{ type: 'text', text: prompt }, { type: 'image_url', image_url: { url: imageBase64 } }] }],
      temperature: 0.1,
    }),
  });
  const data = await response.json() as any;
  console.error('Openrouter response:', data)
  if (!response.ok) throw new Error(data.error?.message || 'OpenRouter API error');
  return data.choices[0].message.content;
}

async function callGoogle(apiKey: string, model: string, prompt: string, imageBase64: string) {
  const base64Data = imageBase64.split(',')[1];
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: 'image/jpeg', data: base64Data } }] }],
    }),
  });
  const data = await response.json() as any;
  console.error('Google response:', data)
  if (!response.ok) throw new Error(data.error?.message || 'Google Gemini error');
  return data.candidates[0].content.parts[0].text;
}

async function callCloudflare(apiToken: string, accountId: string, model: string, prompt: string, imageBase64: string) {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, image: imageBase64 }),
  });
  const data = await response.json() as any;
  console.error('Cloudflare response:', data)
  if (!response.ok) throw new Error(data.errors?.[0]?.message || 'Cloudflare error');
  return data.result.response;
}

async function callCustom(endpoint: string, apiKey: string, model: string, prompt: string, imageBase64: string) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: [{ type: 'text', text: prompt }, { type: 'image_url', image_url: { url: imageBase64 } }] }],
    }),
  });
  const data = await response.json() as any;
  if (!response.ok) throw new Error(data.error?.message || 'Custom endpoint error');
  return data.choices[0].message.content;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid request', details: parsed.error }), { status: 400 });
    }
    
    const { 
      imageBase64, engine, model, apiKey, cloudflareAccountId, 
      customEndpoint, customModel, maxTitle, maxKeywords, enhancedKeywords,
      customPrompt
    } = parsed.data;

    let systemPrompt = `Act as a metadata machine. You must output EXACTLY in the format below. Do not add any conversational text.

TITLE: [Max ${maxTitle} chars. If exceeds, truncate.]
DESCRIPTION: [2-3 sentences. If content is unclear, output 'N/A']
KEYWORD: [${maxKeywords} keywords max, comma separated. If fewer, output available only.]
CATEGORY: [ONLY the ID number from the list. If ID is unknown, output '3']

LIST FOR CATEGORY ID:
${Object.entries(STOCK_CATEGORIES).map(([id, name]) => `${id}:${name}`).join(', ')}

${enhancedKeywords ? "CRITICAL: Keywords must be industry-specific and SEO optimized." : "Use direct and relevant keywords."}

STRICT FORMAT:
TITLE: ...
DESCRIPTION: ...
KEYWORD: ...
CATEGORY: ...`;

    if (customPrompt) systemPrompt += `\nAdditional instructions: ${customPrompt}`;

    let rawResponse = '';
    switch (engine) {
      case 'groq':
        if (!apiKey) throw new Error('API key required for Groq');
        rawResponse = await callGroq(apiKey, model, systemPrompt, imageBase64);
        break;
      case 'mistral':
        if (!apiKey) throw new Error('API key required for Mistral');
        rawResponse = await callMistral(apiKey, model, systemPrompt, imageBase64);
        break;
      case 'openrouter':
        if (!apiKey) throw new Error('API key required for OpenRouter');
        rawResponse = await callOpenRouter(apiKey, model, systemPrompt, imageBase64);
        break;
      case 'google':
        if (!apiKey) throw new Error('API key required for Google Gemini');
        rawResponse = await callGoogle(apiKey, model, systemPrompt, imageBase64);
        break;
      case 'cloudflare':
        if (!apiKey || !cloudflareAccountId) throw new Error('API token and Account ID required for Cloudflare');
        rawResponse = await callCloudflare(apiKey, cloudflareAccountId, model, systemPrompt, imageBase64);
        break;
      case 'custom':
        if (!customEndpoint) throw new Error('Custom endpoint required');
        rawResponse = await callCustom(customEndpoint, apiKey || '', customModel || model, systemPrompt, imageBase64);
        break;
      default:
        throw new Error(`Unsupported engine: ${engine}`);
    }
    
    console.log("--- RAW RESPONSE DARI AI ---");
    console.log(rawResponse);
    console.log("--- END OF RAW RESPONSE ---");

    const parsedMeta = parseMetadataResponse(rawResponse);
    
    parsedMeta.title = parsedMeta.title.substring(0, maxTitle);
    parsedMeta.keywords = parsedMeta.keywords.split(',').map(k => k.trim()).filter(Boolean).slice(0, maxKeywords).join(', ');

    return new Response(JSON.stringify(parsedMeta), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), { status: 500 });
  }
};
