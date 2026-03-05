import { Module } from '@nestjs/common';
import { ILlmPort } from './application/ports/llm.port';
import { ChatStreamUseCase } from './application/use-cases/chat-stream.use-case';
import { LlmAdapterFactory } from './infra/factories/llm-adapter.factory';
import { ChatController } from './interfaces/http/chat.controller';

@Module({
  controllers: [ChatController],
  providers: [
    ChatStreamUseCase,
    LlmAdapterFactory,
    {
      provide: ILlmPort,
      useFactory: (factory: LlmAdapterFactory) => factory.create(),
      inject: [LlmAdapterFactory],
    },
  ],
})
export class ChatModule {}
