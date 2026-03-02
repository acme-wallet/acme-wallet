import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ChatStreamEvent } from '@repo/schemas';
import OpenAI from 'openai';
import { Env } from 'src/common/configs/env.schema';
import { ILlmPort } from '../../application/ports/llm.port';
import type { ChatStreamInput } from '../../interfaces/dto/chat-stream-input.dto';

@Injectable()
export class LlamacppAdapter implements ILlmPort {
  private readonly logger = new Logger(LlamacppAdapter.name);
  private readonly client: OpenAI;

  constructor(private readonly configService: ConfigService<Env, true>) {
    const apiUrl = this.configService.get('LLAMACPP_API_URL', { infer: true });

    this.client = new OpenAI({
      baseURL: `${apiUrl}/v1`,
      apiKey: 'llama',
    });
  }

  async *stream(input: ChatStreamInput): AsyncGenerator<ChatStreamEvent> {
    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        ...(input.systemPrompt
          ? [{ role: 'system' as const, content: input.systemPrompt }]
          : []),
        { role: 'user' as const, content: input.message },
      ];

      const stream = await this.client.chat.completions.create({
        // The model is loaded by the llama.cpp server
        model: '',
        messages,
        stream: true,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta;

        if (delta?.content) {
          yield { type: 'text_delta', delta: delta.content };
        }

        if ('reasoning' in delta && delta.reasoning) {
          yield {
            type: 'reasoning_delta',
            delta: String((delta as { reasoning: unknown }).reasoning),
          };
        }
      }

      yield { type: 'done' };
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        if (error.status === 404) {
          throw new NotFoundException(
            `LLM endpoint not found: ${error.message}`,
          );
        } else if (error.status === 400) {
          throw new BadRequestException(
            `Bad request to LLM server: ${error.message}`,
          );
        } else if (error.status && error.status >= 500) {
          throw new ServiceUnavailableException(
            `LLM server unavailable: ${error.message}`,
          );
        }
        throw new InternalServerErrorException(
          `LLM server error! status: ${error.status} ${error.message}`,
        );
      }

      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error('Error streaming from Llamacpp', error);
      yield {
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Unknown error occurred during Llamacpp chat streaming.',
      };
    }
  }
}
