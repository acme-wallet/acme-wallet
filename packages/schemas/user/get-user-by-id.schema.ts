import { z } from 'zod';

export const GetUserByIdSchema = z.object({
    id: z.uuid('ID inválido'),
});

export const GetUserByIdResponseSchema = z.object({
    id: z.uuid(),
    name: z.string().min(3),
    email: z.email(),
    createdAt: z.string().datetime(),
});

export type GetUserByIdInput = z.infer<typeof GetUserByIdSchema>;
export type GetUserByIdOutput = z.infer<typeof GetUserByIdResponseSchema>;
