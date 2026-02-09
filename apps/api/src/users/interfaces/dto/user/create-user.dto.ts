// apps/api/src/.../create-user.dto.ts
import { createZodDto } from 'nestjs-zod';
import { CreateUserSchema } from '@repo/schemas';

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
