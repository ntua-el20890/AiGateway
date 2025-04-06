import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;  

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages, model, parameters, apiKey } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant.',
    messages,
    // temperature: parameters.temperature,
    // maxTokens: parameters.maxTokens,
    // topP: parameters.topP,
  });

  return result.toDataStreamResponse();
}