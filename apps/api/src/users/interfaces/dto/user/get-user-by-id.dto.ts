import { createZodDto } from 'nestjs-zod';
import { GetUserByIdSchema } from '@repo/schemas';

export class GetUserByIdRequest extends createZodDto(GetUserByIdSchema) {}
