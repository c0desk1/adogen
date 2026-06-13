import { useStore } from '@nanostores/react';
import { useState, useEffect } from 'react';

import {
  selectedProviderStore,
  providerModelsStore,
  groqKeyStore,
  mistralKeyStore,
  openrouterKeyStore,
  googleKeyStore,
  cloudflareKeyStore,
  cloudflareAccountIdStore,
  customApiKeyStore,
  customEndpointStore,
  customModelNameStore,
  maxTitleLengthStore,
  maxKeywordsStore,
  enhancedKeywordsStore,
  batchDelayStore,
  customPromptStore,
  platformStore,
  updateFallbackQueue,
  addToast,
} from '@/app/stores';

import { 
  ENGINE_OPTIONS, 
  getDefaultModelForProvider,
  type ProviderId 
} from '@/lib/engine';

import Select from '@/app/components/ui/Select';
import Input from '@/app/components/ui/Input';
import Slider from '@/app/components/ui/Slider';
import Toggle from '@/app/components/ui/Toggle';
import Textarea from '@/app/components/ui/Textarea';
import Button from '@/app/components/ui/Button';
import Banner from '@/app/components/ui/Banner';
import Icon from '@/app/components/ui/Icon';

export default function SettingsPanel() {
  const provider = useStore(selectedProviderStore);
  const providerModels = useStore(providerModelsStore);
  const groqKey = useStore(groqKeyStore);
  const mistralKey = useStore(mistralKeyStore);
  const openrouterKey = useStore(openrouterKeyStore);
  const googleKey = useStore(googleKeyStore);
  const cloudflareKey = useStore(cloudflareKeyStore);
  const cloudflareAccountId = useStore(cloudflareAccountIdStore);
  const customApiKey = useStore(customApiKeyStore);
  const customEndpoint = useStore(customEndpointStore);
  const customModelName = useStore(customModelNameStore);
  const maxTitle = useStore(maxTitleLengthStore);
  const maxKeywords = useStore(maxKeywordsStore);
  const enhancedKeywords = useStore(enhancedKeywordsStore);
  const batchDelay = useStore(batchDelayStore);
  const customPrompt = useStore(customPromptStore);
  const platform = useStore(platformStore);

  const [showApiKey, setShowApiKey] = useState(false);
  const [useCustomPrompt, setUseCustomPrompt] = useState(customPrompt.trim() !== '');

  const currentProvider = ENGINE_OPTIONS.find(p => p.id === provider);
  const models = currentProvider?.models || [];
  const isCustom = currentProvider?.isCustom === true;
  const needsAccountId = currentProvider?.needsAccountId === true;
  const isFree = currentProvider?.isFree === true;

  const currentModel = providerModels[provider] || getDefaultModelForProvider(provider);
  const [localModel, setLocalModel] = useState(currentModel);

  useEffect(() => {
    setLocalModel(providerModels[provider] || getDefaultModelForProvider(provider));
  }, [provider, providerModels]);

  const getCurrentApiKeyValue = () => {
    switch (provider) {
      case 'groq': return groqKey;
      case 'mistral': return mistralKey;
      case 'openrouter': return openrouterKey;
      case 'google': return googleKey;
      case 'cloudflare': return cloudflareKey;
      case 'custom': return customApiKey;
      default: return '';
    }
  };

  const setCurrentApiKey = (val: string) => {
    switch (provider) {
      case 'groq': groqKeyStore.set(val); break;
      case 'mistral': mistralKeyStore.set(val); break;
      case 'openrouter': openrouterKeyStore.set(val); break;
      case 'google': googleKeyStore.set(val); break;
      case 'cloudflare': cloudflareKeyStore.set(val); break;
      case 'custom': customApiKeyStore.set(val); break;
    }
  };
  const currentApiKey = getCurrentApiKeyValue();

  const handleProviderChange = (val: string) => {
    selectedProviderStore.set(val as ProviderId);
  };

  const handleModelChange = (val: string) => {
    setLocalModel(val);
    const updated = { ...providerModels, [provider]: val };
    providerModelsStore.set(updated);
  };

  const handlePlatformChange = (val: string) => {
    platformStore.set(val);
  };

  const handleSave = () => {
    updateFallbackQueue();
    addToast('Configuration matrices successfully serialized', 'success');
  };

  const apiKeyPlaceholder = currentProvider?.keyPrefix
    ? `Input active key (${currentProvider.keyPrefix}...)`
    : 'Enter private API key token';

  return (
    <div className="h-full flex flex-col pb-(--pb-safe-bottom) select-none">
      <div className="sticky top-0 right-0 z-10 bg-(--bg) px-4 py-3 flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase font-semibold tracking-wider text-(--fg-strong)">
          Parameters
        </h3>
        <Button variant="primary" size="sm" onClick={handleSave} className="font-semibold text-xs">
          Save
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-5 py-4">
        <div className="px-4 space-y-4">
          <h4 className="text-[10px] font-mono uppercase font-bold tracking-widest text-(--fg-muted)">
            AI Configuration
          </h4>
          <div className="space-y-3.5">
            <Select
              label="Active Cloud Provider"
              options={ENGINE_OPTIONS.map(p => ({ value: p.id, label: p.label }))}
              value={provider}
              onChange={handleProviderChange}
              size="md"
            />
            
            {!isCustom && models.length > 0 && (
              <Select
                label="Primary Vision Model"
                options={models.map(m => ({ value: m.id, label: m.label }))}
                value={localModel}
                onChange={handleModelChange}
                size="md"
              />
            )}

            {isCustom && (
              <div className="space-y-3 animate-fadeIn">
                <Input
                  label="Custom Inference Endpoint URL"
                  size="md"
                  value={customEndpoint}
                  onChange={e => customEndpointStore.set(e.target.value)}
                  placeholder="https://host.com/v1/chat/completions"
                  prefix={<Icon name="endpoint" className="w-3.5 h-3.5" />}
                />
                <Input
                  label="Target Model Identifier"
                  size="md"
                  value={customModelName}
                  onChange={e => customModelNameStore.set(e.target.value)}
                  placeholder="e.g., custom-llama-vision-model"
                  prefix={<Icon name="endpoint" className="w-3.5 h-3.5" />}
                />
              </div>
            )}

            {!isFree && (
              <Input
                label="Secure Access API Key"
                type={showApiKey ? 'text' : 'password'}
                value={currentApiKey}
                onChange={e => setCurrentApiKey(e.target.value)}
                placeholder={apiKeyPlaceholder}
                size="md"
                prefix={<Icon name="key" className="w-3.5 h-3.5" />}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="inline-flex h-full w-8 items-center justify-center text-(--fg-muted) hover:text-(--fg-strong) focus:outline-none transition-colors"
                    aria-label={showApiKey ? 'Hide authentication key' : 'Display authentication key'}
                  >
                    <Icon name={showApiKey ? 'eye-off' : 'eye'} className="w-3.5 h-3.5" />
                  </button>
                }
              />
            )}

            {needsAccountId && (
              <Input
                label="Cloudflare Account Identifier"
                value={cloudflareAccountId}
                onChange={e => cloudflareAccountIdStore.set(e.target.value)}
                placeholder="Enter Cloudflare hex hash ID"
                prefix={<Icon name="token" className="w-3.5 h-3.5" />}
                size="md"
              />
            )}

            {isFree && (
              <Banner variant="info" className="mt-2">
                This computation network is running on a localized/free grid. No token handshake keys are required.
              </Banner>
            )}
          </div>
        </div>
        <hr className="border-t border-(--border-subtle) mx-4" />
        <div className="px-4 space-y-4">
          <h4 className="text-[10px] font-mono uppercase font-bold tracking-widest text-(--fg-muted)">
            Formats
          </h4>
          <div className="space-y-4">
            <Select
              label="Microstock Target Optimization"
              options={[
                { value: 'default', label: 'General / Non-Specific Market' },
                { value: 'shutterstock', label: 'Shutterstock Core Engine' },
                { value: 'adobe', label: 'Adobe Stock Metadata Rules' },
                { value: 'istock', label: 'iStock Photo Matrix' },
                { value: 'freepik', label: 'Freepik Vector/Asset Hub' },
              ]}
              value={platform}
              onChange={handlePlatformChange}
              size="md"
            />
            
            {platform === 'adobe' && (
              <Banner variant="warning" className="animate-fadeIn">
                Adobe Stock indexing parameters demand categorical classification IDs. The AI pipeline will evaluate and assign a valid integer automatically.
              </Banner>
            )}

            <div className="space-y-4 pt-1">
              <Slider
                label="Maximum Title Cutoff"
                value={maxTitle}
                onChange={e => maxTitleLengthStore.set(parseInt(e.target.value, 10))}
                min={30}
                max={200}
                step={10}
                leftLabel="30ch"
                rightLabel="200ch"
              />
              
              <Slider
                label="Keyword Extraction Threshold"
                value={maxKeywords}
                onChange={e => maxKeywordsStore.set(parseInt(e.target.value, 10))}
                min={5}
                max={50}
                step={5}
                leftLabel="5 tags"
                rightLabel="50 tags"
              />
              
              <Slider
                label="Queue Throttle Interval Delay"
                value={batchDelay}
                onChange={e => batchDelayStore.set(parseFloat(e.target.value))}
                min={0}
                max={5}
                step={0.5}
                leftLabel="0.0s"
                rightLabel="5.0s"
              />
              
              <div className="flex items-center justify-between border border-(--border-subtle) bg-(--bg-surface) p-3 rounded-md">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-(--fg-strong)">Enhanced Keywords</span>
                  <span className="text-[11px] text-(--fg-muted)">Use long-tail SEO phrases</span>
                </div>
                <Toggle
                  checked={enhancedKeywords}
                  onChange={
                    (val) => enhancedKeywordsStore.set(val)
                  }
                  labelPosition="left"
                />
    		      </div>

              <div className="flex items-center justify-between border border-(--border-subtle) bg-(--bg-surface) p-3 rounded-md mt-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-(--fg-strong)">Prompt Override</span>
                  <span className="text-[11px] text-(--fg-muted)">Inject developer base prompt instructions</span>
                </div>
                <Toggle
                  checked={useCustomPrompt}
                  onChange={(val) => {
                    setUseCustomPrompt(val);
                    if (!val) customPromptStore.set('');
                  }}
                  labelPosition="left"
                />
              </div>

              {useCustomPrompt && (
                <div className="animate-fadeIn pt-1">
                  <Textarea
                    value={customPrompt}
                    onChange={e => customPromptStore.set(e.target.value)}
                    rows={4}
                    placeholder="Enter explicit custom prompt matrices instructions for systemic metadata extraction control..."
                    className="font-medium text-xs leading-normal"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}