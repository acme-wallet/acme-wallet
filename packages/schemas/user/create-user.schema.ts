import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.email('E-mail inválido'),
});

export type CreateUserType = z.infer<typeof CreateUserSchema>;
