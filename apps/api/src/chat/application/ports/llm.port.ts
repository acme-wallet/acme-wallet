import type { ChatStreamEvent } from '@repo/schemas';
import { ChatStreamInput } from 'src/chat/interfaces/dto/chat-stream-input.dto';

export abstract class ILlmPort {
  abstract stream(input: ChatStreamInput): AsyncGenerator<ChatStreamEvent>;
}
