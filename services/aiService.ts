import { ModelParameters, ChatMessage } from '@/types';
import { getModelEndpoint, providerEndpoints, ModelProvider, getModelApiRoute } from '@/config/modelConfig';

// This would normally be stored in a secure back-end
const DEVELOPER_PROVIDED_API_KEYS: Record<string, string> = {
  // Models with developer-provided API keys
  "claude-3-sonnet": "developer-key", // Example only - this would be a real key in production
  // Add other models with developer-provided keys
};

// Function to send a message to the AI model with streaming support
export const sendMessageToAI = async (
  messages: ChatMessage[], // Full conversation history
  model: string,
  parameters: ModelParameters,
  apiKey?: string,
  onChunk?: (chunk: string) => void
): Promise<string> => {
  // Get model endpoint configuration
  const endpoint = getModelEndpoint(model);
  if (!endpoint) {
    console.error(`No endpoint configuration found for model: ${model}`);
    return simulateResponse(`Error: No endpoint configuration for ${model}`, model, onChunk, messages);
  }
  
  // Get the user provided key or developer key
  const key = apiKey || DEVELOPER_PROVIDED_API_KEYS[model];
  
  console.log(`Sending ${messages.length} messages to ${model} with parameters:`, parameters);
  
  // Route to the appropriate handler based on provider
  switch (endpoint.provider) {
    case 'openai':
      return sendToOpenAI(messages, model, parameters, key, endpoint, onChunk);
    case 'anthropic':
      return sendToAnthropic(messages, model, parameters, key, endpoint, onChunk);
    case 'google':
      return sendToGoogle(messages, model, parameters, key, endpoint, onChunk);
    case 'local-ollama':
      return sendToOllama(messages, model, parameters, endpoint, onChunk);
    case 'local-llama':
      return sendToLocalLlama(messages, model, parameters, endpoint, onChunk);
    default:
      console.warn(`No specific handler for provider ${endpoint.provider}, using generic handler`);
      return simulateResponse("No provider implementation available", model, onChunk, messages);
  }
};

// Function to refresh an AI response with the same conversation history
export const refreshAIResponse = async (
  messages: ChatMessage[], // Full conversation history for context
  model: string,
  parameters: ModelParameters,
  apiKey?: string,
  onChunk?: (chunk: string) => void
): Promise<string> => {
  console.log(`Refreshing response with ${messages.length} messages using ${model}`);
  
  // Use the same sendMessageToAI function but with the "refresh" flag
  return sendMessageToAI(
    messages,
    model,
    parameters,
    apiKey,
    onChunk
  );
};

// Check if a model requires an API key from the user
export const modelRequiresUserApiKey = (modelName: string): boolean => {
  // Get endpoint configuration
  const endpoint = getModelEndpoint(modelName);
  
  // If no endpoint configuration or it's a local model, no API key is needed
  if (!endpoint || endpoint.provider.includes('local')) {
    return false;
  }
  
  // If we have a developer-provided key for this model, it doesn't need a user key
  return !DEVELOPER_PROVIDED_API_KEYS[modelName] && endpoint.requiresApiKey;
};

// OpenAI API handler with streaming support
const sendToOpenAI = async (
  messages: ChatMessage[],
  model: string,
  parameters: ModelParameters,
  apiKey: string,
  endpoint: { baseUrl: string, apiPath: string, provider: ModelProvider },
  onChunk?: (chunk: string) => void
): Promise<string> => {
  // Check if we have a valid API key
  if (!apiKey) {
    console.error('No API key provided for OpenAI');
    return simulateResponse(`Error: API key required for ${model}`, model, onChunk, messages);
  }
  
  console.log(`Sending to OpenAI's ${model} with key: ${apiKey ? apiKey.substring(0, 3) + '...' : 'none'}`);
  
  // Format messages for OpenAI API
  const formattedMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  console.log("Formatted messages for OpenAI:", formattedMessages);
  
  // For real implementation, you would make an actual API call with streaming
  // In a real app, this would use the Vercel AI SDK pattern
  
  return simulateResponse("This is a simulated OpenAI response", model, onChunk, messages);
};

// Anthropic API handler with streaming
const sendToAnthropic = async (
  messages: ChatMessage[],
  model: string,
  parameters: ModelParameters,
  apiKey: string,
  endpoint: { baseUrl: string, apiPath: string, provider: ModelProvider },
  onChunk?: (chunk: string) => void
): Promise<string> => {
  console.log(`Sending to Anthropic's ${model} with key: ${apiKey ? apiKey.substring(0, 3) + '...' : 'none'}`);
  
  // Format messages for Anthropic API (which has a different format)
  const anthropicMessages = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.content
  }));
  
  console.log("Formatted messages for Anthropic:", anthropicMessages);
  
  return simulateResponse("This is a simulated Anthropic response", model, onChunk, messages);
};

// Google Gemini API handler with streaming
const sendToGoogle = async (
  messages: ChatMessage[],
  model: string,
  parameters: ModelParameters,
  apiKey: string,
  endpoint: { baseUrl: string, apiPath: string, provider: ModelProvider },
  onChunk?: (chunk: string) => void
): Promise<string> => {
  console.log(`Sending to Google's ${model} with key: ${apiKey ? apiKey.substring(0, 3) + '...' : 'none'}`);
  
  // Format messages for Google API
  const googleMessages = messages.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));
  
  console.log("Formatted messages for Google:", googleMessages);
  
  return simulateResponse("This is a simulated Google response", model, onChunk, messages);
};

// Ollama API handler with streaming
const sendToOllama = async (
  messages: ChatMessage[],
  model: string,
  parameters: ModelParameters,
  endpoint: { baseUrl: string, apiPath: string, provider: ModelProvider },
  onChunk?: (chunk: string) => void
): Promise<string> => {
  console.log(`Processing with Ollama ${model} model at ${endpoint.baseUrl}${endpoint.apiPath}`);
  
  try {
    // For development testing, if localhost isn't accessible, fall back to simulation
    if (window.location.hostname !== 'localhost') {
      console.warn('Not running on localhost, using simulated response for Ollama');
      return simulateResponse("This is a simulated Ollama response", model, onChunk, messages);
    }
    
    // Format the messages for Ollama
    // Ollama typically expects a single prompt string with conversation history
    let formattedPrompt = '';
    
    messages.forEach(msg => {
      // Skip empty messages which can cause confusion
      if (msg.content.trim() === '') return;
      
      formattedPrompt += `${msg.role === 'user' ? 'User: ' : 'Assistant: '}${msg.content}\n\n`;
    });
    
    // If the last message isn't from the assistant, add the prompt for the AI to continue
    if (messages.length > 0 && messages[messages.length - 1].role !== 'assistant') {
      formattedPrompt += 'Assistant:';
    }
    
    console.log("Sending formatted prompt to Ollama:", formattedPrompt);
    
    // Send the request to Ollama
    const response = await fetch(`${endpoint.baseUrl}${endpoint.apiPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        prompt: formattedPrompt,
        temperature: parameters.temperature,
        max_tokens: parameters.maxTokens || 2000,
        top_p: parameters.topP,
        stream: true
      })
    });
    
    if (!response.ok) {
      console.error(`Ollama API error: ${response.statusText}`);
      const errorMsg = `Error connecting to Ollama: ${response.statusText}. Make sure Ollama is running locally.`;
      if (onChunk) {
        onChunk(errorMsg);
      }
      return errorMsg;
    }

    // Set up streaming
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            const content = data.response || '';
            if (content && onChunk) {
              console.log("Streaming content chunk:", content);
              onChunk(content);
              fullResponse += content;
            }
            
            // Check if we're done
            if (data.done) break;
          } catch (error) {
            console.error('Error parsing Ollama response:', error);
          }
        }
      }
    }
    
    console.log("Full response from Ollama:", fullResponse);
    return fullResponse;
  } catch (error: any) {
    console.error('Error connecting to Ollama:', error);
    const errorMsg = `Error connecting to Ollama: ${error.message}. Make sure Ollama is running locally at ${endpoint.baseUrl}.`;
    if (onChunk) {
      onChunk(errorMsg);
    }
    return errorMsg;
  }
};

// Local Llama API handler with streaming
const sendToLocalLlama = async (
  messages: ChatMessage[],
  model: string,
  parameters: ModelParameters,
  endpoint: { baseUrl: string, apiPath: string, provider: ModelProvider },
  onChunk?: (chunk: string) => void
): Promise<string> => {
  console.log(`Processing with local ${model} model at ${endpoint.baseUrl}${endpoint.apiPath}`);
  return simulateResponse(`This is a simulated response from local ${model}`, model, onChunk, messages);
};

// Simulate a streaming response for demonstration purposes
const simulateResponse = (
  baseResponse: string, 
  model: string, 
  onChunk?: (chunk: string) => void,
  messages: ChatMessage[] = []
): Promise<string> => {
  return new Promise((resolve) => {
    // Generate a context-aware response based on previous messages
    let contextPrefix = '';
    if (messages.length > 1) {
      contextPrefix = `Based on our conversation, `;
    }
    
    const userQuestion = messages.length > 0 ? 
      messages[messages.length - 1].content : 
      "No message provided";
    
    const fullResponse = `${contextPrefix}${baseResponse} to your message: "${userQuestion}". In a real application, this would be the actual response from the AI model.`;
    let currentIndex = 0;
    let fullText = '';
    
    // If there's no streaming callback, just return the full response
    if (!onChunk) {
      setTimeout(() => resolve(fullResponse), 1000);
      return;
    }
    
    // Simulate streaming by sending chunks of the response
    const interval = setInterval(() => {
      if (currentIndex < fullResponse.length) {
        // Get next chunk (1-3 characters at a time to simulate realistic typing)
        const chunkSize = Math.floor(Math.random() * 3) + 1;
        const chunk = fullResponse.substring(currentIndex, currentIndex + chunkSize);
        currentIndex += chunk.length;
        
        // Send the chunk
        onChunk(chunk);
        fullText += chunk;
      } else {
        clearInterval(interval);
        resolve(fullText);
      }
    }, 50);
  });
};