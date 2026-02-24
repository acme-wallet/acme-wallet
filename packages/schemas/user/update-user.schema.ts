import { z } from 'zod';

export const UpdateUserSchema = z.object({
    id: z.uuid('ID inválido'),
    name: z.string().min(3, 'Mínimo 3 caracteres').optional(),
    email: z.email('E-mail inválido').optional(),
});

export const UpdateUserResponseSchema = z.object({
    id: z.uuid(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UpdateUserOutput = z.infer<typeof UpdateUserResponseSchema>;
