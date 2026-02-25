import { Injectable, NotImplementedException } from '@nestjs/common';
import type { ChatStreamEvent } from '@repo/schemas';
import { ILlmProvider } from '../../application/ports/llm.provider';

@Injectable()
export class OllamaAdapter implements ILlmProvider {
  stream(): AsyncGenerator<ChatStreamEvent> {
    throw new NotImplementedException(
      'OllamaAdapter is not yet implemented. Configure an Ollama endpoint and implement the stream method.',
    );
  }
}
