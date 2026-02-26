import { createZodDto } from 'nestjs-zod';
import { GetUserByIdResponseSchema, GetUserByIdSchema } from '@repo/schemas';

export class GetUserByIdRequest extends createZodDto(GetUserByIdSchema) {}
export class GetUserByIdResponse extends createZodDto(
  GetUserByIdResponseSchema,
) {}

export type GetUserByIdInputDto = GetUserByIdRequest;
export type GetUserByIdOutputDto = GetUserByIdResponse;
