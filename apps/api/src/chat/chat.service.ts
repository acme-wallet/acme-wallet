import { Injectable } from '@nestjs/common';
import { Agent, run } from '@openai/agents';
import type { ChatStreamEvent } from '@repo/schemas';

@Injectable()
export class ChatService {
  async *streamChat(
    message: string,
    systemPrompt?: string,
    model?: string,
  ): AsyncGenerator<ChatStreamEvent> {
    const agent = new Agent({
      name: 'Assistant',
      instructions: systemPrompt ?? 'You are a helpful assistant.',
      model: model ?? 'o4-mini',
    });

    try {
      const result = await run(agent, message, { stream: true });

      for await (const event of result) {
        if (event.type === 'raw_model_stream_event') {
          const data = event.data as {
            type: string;
            delta?: string;
          };

          if (data.type === 'output_text_delta' && data.delta) {
            yield { type: 'text_delta', delta: data.delta };
          } else if (
            (data.type === 'reasoning_summary_text_delta' ||
              data.type === 'response.reasoning_summary_text.delta') &&
            data.delta
          ) {
            yield { type: 'reasoning_delta', delta: data.delta };
          }
        }
      }

      await result.completed;
      yield { type: 'done' };
    } catch (error) {
      yield {
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Unknown error occurred during chat streaming.',
      };
    }
  }
}
