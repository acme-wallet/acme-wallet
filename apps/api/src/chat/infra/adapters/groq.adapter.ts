import { Injectable } from '@nestjs/common';
import type { ChatStreamEvent } from '@repo/schemas';
import Groq from 'groq-sdk';
import { ILlmProvider } from '../../application/ports/llm.provider';
import type { ChatStreamInput } from '../../interfaces/dto/chat-stream-input.dto';

type DeltaWithReasoning = {
  content?: string | null;
  reasoning?: string | null;
};

@Injectable()
export class GroqAdapter implements ILlmProvider {
  private readonly client: Groq;
  private readonly DEFAULT_MODEL = 'qwen/qwen3-32b';

  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async *stream(input: ChatStreamInput): AsyncGenerator<ChatStreamEvent> {
    try {
      const chatStream = (await this.client.chat.completions.create({
        model: this.DEFAULT_MODEL,
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
