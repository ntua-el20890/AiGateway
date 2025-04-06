import { streamText } from "ai";
import { ollama as ollamaProvider } from "ollama-ai-provider";
import { createOllama } from "ollama-ai-provider";

const ollama = createOllama({
  // optional settings, e.g.
  baseURL: "http://localhost:11434/api/generate",
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, parameters, model, apiKey } = await req.json();
  try {
    const result = streamText({
      model: ollamaProvider(model),
      system: "You are a helpful assistant.",
      messages,
      temperature: parameters.temperature,
      maxTokens: parameters.maxTokens,
      topP: parameters.topP,
      frequencyPenalty: parameters.frequencyPenalty,
      presencePenalty: parameters.presencePenalty,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process chat message",
      }),
      { status: 500 }
    );
  }
}
