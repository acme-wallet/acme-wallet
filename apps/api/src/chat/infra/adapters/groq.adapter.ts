import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import type { ChatStreamEvent } from '@repo/schemas';
import { ILlmProvider } from '../../application/ports/llm.provider';
import type { ChatStreamInput } from '../../interfaces/dto/chat-stream-input.dto';

type DeltaWithReasoning = {
  content?: string | null;
  reasoning?: string | null;
};

const DEFAULT_MODEL = 'qwen/qwen3-32b';

@Injectable()
export class GroqAdapter implements ILlmProvider {
  private readonly client: Groq;

  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async *stream(input: ChatStreamInput): AsyncGenerator<ChatStreamEvent> {
    const model = DEFAULT_MODEL;

    try {
      const chatStream = (await this.client.chat.completions.create({
        model,
        messages: [
          ...(input.systemPrompt
            ? [{ role: 'system' as const, content: input.systemPrompt }]
            : []),
          { role: 'user' as const, content: input.message },
        ],
        stream: true,
        reasoning_format: 'parsed',
      })) as AsyncIterable<{ choices: Array<{ delta: DeltaWithReasoning }> }>;

      for await (const chunk of chatStream) {
        const delta = chunk.choices[0]?.delta ?? {};

        if (delta.reasoning) {
          yield { type: 'reasoning_delta', delta: delta.reasoning };
        }

        if (delta.content) {
          yield { type: 'text_delta', delta: delta.content };
        }
      }

      yield { type: 'done' };
    } catch (error) {
      yield {
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Unknown error occurred during Groq chat streaming.',
      };
    }
  }
}
