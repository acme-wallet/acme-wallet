import { createZodDto } from 'nestjs-zod';
import { DeleteUserSchema } from '@repo/schemas';

export class DeleteUserRequest extends createZodDto(DeleteUserSchema) {}

export type DeleteUserInputDto = DeleteUserRequest;
export type DeleteUserOutputDto = void;
