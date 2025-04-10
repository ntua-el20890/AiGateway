import { Model } from '@/types';

// Model providers and their base URLs
export type ModelProvider = 'openai' | 'anthropic' | 'google' | 'local-ollama' | 'local-llama' | 'deepseek';

export interface ModelEndpoint {
  provider: ModelProvider;
  baseUrl: string;
  apiPath: string;
  requiresApiKey: boolean;
  streamSupported: boolean;
  endpointRoute: string; // Added endpoint route for front-end API calls
}

// Provider specific configurations
export const providerEndpoints: Record<ModelProvider, ModelEndpoint> = {
  'openai': {
    provider: 'openai',
    baseUrl: 'https://api.openai.com',
    apiPath: '/v1/chat/completions',
    requiresApiKey: true,
    streamSupported: true,
    endpointRoute: '/api/openai-chat'
  },
  'anthropic': {
    provider: 'anthropic',
    baseUrl: 'https://api.anthropic.com',
    apiPath: '/v1/messages',
    requiresApiKey: true,
    streamSupported: true,
    endpointRoute: '/api/anthropic-chat'
  },
  'google': {
    provider: 'google',
    baseUrl: 'https://generativelanguage.googleapis.com',
    apiPath: '/v1beta/models/gemini-pro:generateContent',
    requiresApiKey: true,
    streamSupported: true,
    endpointRoute: '/api/google-chat'
  },
  'local-ollama': {
    provider: 'local-ollama',
    baseUrl: 'http://localhost:11434',
    apiPath: '/api/generate',
    requiresApiKey: false,
    streamSupported: true,
    endpointRoute: '/api/ollama-chat'
  },
  'local-llama': {
    provider: 'local-llama',
    baseUrl: 'http://localhost:8080',
    apiPath: '/completion',
    requiresApiKey: false,
    streamSupported: true,
    endpointRoute: '/api/llama-chat'
  },
'deepseek': {
    provider: 'deepseek',
    baseUrl: 'https://api.deepseek.com',
    apiPath: '/chat/completions',
    requiresApiKey: true,
    streamSupported: true,
    endpointRoute: '/api/deepseek'
}
};

// Extended model interface with provider information
export interface ExtendedModel extends Model {
  provider: ModelProvider;
  endpoint?: string;
  requiresApiKey: boolean;
  endpointRoute?: string; 
}

// Available models with their configurations
export const availableModels: ExtendedModel[] = [
  { 
    id: 'gpt-4o', 
    name: 'GPT-4o', 
    description: 'Most advanced model with vision capabilities', 
    supportsImages: true,
    contextLength: 128000,
    runsLocally: false,
    provider: 'openai',
    requiresApiKey: true
  },
  { 
    id: 'gpt-4o-mini', 
    name: 'GPT-4o Mini', 
    description: 'Fast and efficient for most tasks', 
    supportsImages: true,
    contextLength: 128000,
    runsLocally: false,
    provider: 'openai',
    requiresApiKey: true
  },
  { 
    id: 'claude-3-opus', 
    name: 'Claude 3 Opus', 
    description: 'High quality reasoning and coding assistance', 
    supportsImages: true,
    contextLength: 200000,
    runsLocally: false,
    provider: 'anthropic',
    requiresApiKey: true
  },
  { 
    id: 'claude-3-sonnet', 
    name: 'Claude 3 Sonnet', 
    description: 'Balanced model for general use cases', 
    supportsImages: true,
    contextLength: 180000,
    runsLocally: false,
    provider: 'anthropic',
    requiresApiKey: true
  },
  { 
    id: 'gemini-pro', 
    name: 'Gemini Pro', 
    description: 'Google\'s advanced model for various tasks', 
    supportsImages: true,
    contextLength: 32000,
    runsLocally: false,
    provider: 'google',
    requiresApiKey: true
  },
  { 
    id: 'llama-3-70b', 
    name: 'Llama 3 (70B)', 
    description: 'Open-source model with strong coding capabilities', 
    supportsImages: false,
    contextLength: 8000,
    runsLocally: true,
    provider: 'local-llama',
    requiresApiKey: false
  },
  { 
    id: 'gemma', 
    name: 'Gemma', 
    description: 'Lightweight model running locally on Ollama', 
    supportsImages: false,
    contextLength: 8000,
    runsLocally: true,
    provider: 'local-ollama',
    requiresApiKey: false
  }
];

// Get endpoint configuration for a specific model
export const getModelEndpoint = (modelId: string): ModelEndpoint | null => {
  const model = availableModels.find(m => m.id === modelId);
  if (!model) return null;
  
  return providerEndpoints[model.provider];
};

// Get the API route for a specific model
export const getModelApiRoute = (modelId: string): string => {
  const model = availableModels.find(m => m.id === modelId);
  if (!model) return '/api/chat'; // Default fallback
  
  if (model.endpointRoute) {
    return model.endpointRoute;
  }
  
  const endpoint = providerEndpoints[model.provider];
  return endpoint ? endpoint.endpointRoute : '/api/chat';
};

// // Check if a model requires an API key
// export const modelRequiresApiKey = (modelId: string): boolean => {
//   const model = availableModels.find(m => m.id === modelId);
//   if (!model) return true;
  
//   return model.requiresApiKey;
// };