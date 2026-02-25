import { createZodDto } from 'nestjs-zod';
import { ChatStreamSchema } from '@repo/schemas';

export class ChatStreamInput extends createZodDto(ChatStreamSchema) {}
