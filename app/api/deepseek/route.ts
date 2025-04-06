import { deepseek as deepseekFunction } from '@ai-sdk/deepseek';

import { createDeepSeek } from '@ai-sdk/deepseek';
import { streamObject, streamText } from 'ai';

const deepseekInstance = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
});

function errorHandler(error: any): string {
    return `An error occurred: ${error.message || 'Unknown error'}`;
}

export async function POST(req: Request) {
    const { messages, model, parameters, apiKey } = await req.json();
    
    const result = streamText({
        model: deepseekInstance(model),
        prompt: messages, 
    });
    
    return result.toDataStreamResponse({
        getErrorMessage: errorHandler,
    });
}