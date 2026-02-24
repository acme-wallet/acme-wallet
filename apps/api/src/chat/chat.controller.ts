import { Body, Controller, Post, Res, HttpCode } from '@nestjs/common';
import type { Response } from 'express';
import { ChatService } from './chat.service';

class ChatStreamDto {
  message!: string;
  systemPrompt?: string;
  model?: string;
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('stream')
  @HttpCode(200)
  async stream(@Body() dto: ChatStreamDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const generator = this.chatService.streamChat(
      dto.message,
      dto.systemPrompt,
      dto.model,
    );

    for await (const event of generator) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);

      if (event.type === 'done' || event.type === 'error') {
        break;
      }
    }

    res.end();
  }
}
