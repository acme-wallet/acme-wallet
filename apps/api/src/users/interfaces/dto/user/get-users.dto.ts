import { GetUsersResponseSchema, GetUsersSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class GetUsersRequest extends createZodDto(GetUsersSchema) {}
export class GetUsersResponse extends createZodDto(GetUsersResponseSchema) {}
