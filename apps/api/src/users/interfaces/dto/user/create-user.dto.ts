import { createZodDto } from 'nestjs-zod';
import { CreateUserResponseSchema, CreateUserSchema } from '@repo/schemas';

export class CreateUserRequest extends createZodDto(CreateUserSchema) {}
export class CreateUserResponse extends createZodDto(
  CreateUserResponseSchema,
) {}

export type CreateUserInputDto = CreateUserRequest;
export type CreateUserOutputDto = CreateUserResponse;
