import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
});

export const CreateUserResponseSchema = z.object({
   id: z.string()
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type CreateUserOutput = z.infer<typeof CreateUserResponseSchema>;
