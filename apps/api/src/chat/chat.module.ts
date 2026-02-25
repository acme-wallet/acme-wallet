import { Module } from '@nestjs/common';
import { ChatController } from './interfaces/http/chat.controller';
import { ILlmProvider } from './application/ports/llm.provider';
import { ChatStreamUseCase } from './application/use-cases/chat-stream.use-case';
import { OpenAiAdapter } from './infra/adapters/openai.adapter';

@Module({
  controllers: [ChatController],
  providers: [
    ChatStreamUseCase,
    {
      provide: ILlmProvider,
      useClass: OpenAiAdapter,
    },
  ],
})
export class ChatModule {}
