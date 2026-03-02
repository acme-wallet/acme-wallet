import { Module } from '@nestjs/common';
import { ILlmPort } from './application/ports/llm.port';
import { ChatStreamUseCase } from './application/use-cases/chat-stream.use-case';
import { GroqAdapter } from './infra/adapters/groq.adapter';
import { ChatController } from './interfaces/http/chat.controller';

@Module({
  controllers: [ChatController],
  providers: [
    ChatStreamUseCase,
    {
      provide: ILlmPort,
      useClass: GroqAdapter,
    },
  ],
})
export class ChatModule {}
