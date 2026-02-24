import { z } from 'zod';

export const DeleteUserSchema = z.object({
    id: z.uuid('ID inválido'),
});

export const DeleteUserResponseSchema = z.void();

export type DeleteUserInput = z.infer<typeof DeleteUserSchema>;
export type DeleteUserOutput = void;
