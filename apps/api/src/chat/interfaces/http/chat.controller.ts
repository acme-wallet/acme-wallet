import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ChatStreamInput } from '../../interfaces/dto/chat-stream-input.dto';
import { ChatStreamUseCase } from '../../application/use-cases/chat-stream.use-case';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatStreamUseCase: ChatStreamUseCase) {}

  @Post('stream')
  @HttpCode(200)
  async stream(@Body() dto: ChatStreamInput, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const generator = this.chatStreamUseCase.execute(dto);

    for await (const event of generator) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);

      if (event.type === 'done' || event.type === 'error') {
        break;
      }
    }

    res.end();
  }
}
