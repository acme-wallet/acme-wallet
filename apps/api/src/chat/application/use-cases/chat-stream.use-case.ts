import { Injectable } from '@nestjs/common';
import type { ChatStreamEvent } from '@repo/schemas';
import { ChatStreamInput } from 'src/chat/interfaces/dto/chat-stream-input.dto';
import { ILlmProvider } from '../ports/llm.provider';

@Injectable()
export class ChatStreamUseCase {
  constructor(private readonly llmProvider: ILlmProvider) {}

  execute(input: ChatStreamInput): AsyncGenerator<ChatStreamEvent> {
    return this.llmProvider.stream(input);
  }
}
