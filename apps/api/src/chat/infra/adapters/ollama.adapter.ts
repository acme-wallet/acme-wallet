import { Injectable, NotImplementedException } from '@nestjs/common';
import type { ChatStreamEvent } from '@repo/schemas';
import { ILlmPort } from '../../application/ports/llm.port';

@Injectable()
export class OllamaAdapter implements ILlmPort {
  stream(): AsyncGenerator<ChatStreamEvent> {
    throw new NotImplementedException(
      'OllamaAdapter is not yet implemented. Configure an Ollama endpoint and implement the stream method.',
    );
  }
}
