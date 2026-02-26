import { Injectable } from '@nestjs/common';
import type { ChatStreamEvent } from '@repo/schemas';
import { ChatStreamInput } from 'src/chat/interfaces/dto/chat-stream-input.dto';
import { IUseCase } from 'src/common/use-case.interface';
import { ILlmProvider } from '../ports/llm.provider';

@Injectable()
export class ChatStreamUseCase implements IUseCase<
  ChatStreamInput,
  AsyncGenerator<ChatStreamEvent>
> {
  constructor(private readonly llmProvider: ILlmProvider) {}

  execute(input: ChatStreamInput): AsyncGenerator<ChatStreamEvent> {
    return this.llmProvider.stream(input);
  }
}
