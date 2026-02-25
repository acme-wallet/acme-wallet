import type { ChatStreamEvent } from '@repo/schemas';
import { ChatStreamInput } from 'src/chat/interfaces/dto/chat-stream-input.dto';

export abstract class ILlmProvider {
  abstract stream(input: ChatStreamInput): AsyncGenerator<ChatStreamEvent>;
}
