import { createZodDto } from 'nestjs-zod';
import { UpdateUserSchema, UpdateUserResponseSchema } from '@repo/schemas';

export class UpdateUserRequest extends createZodDto(
  UpdateUserSchema.omit({ id: true }),
) {}
export class UpdateUserResponse extends createZodDto(
  UpdateUserResponseSchema,
) {}
