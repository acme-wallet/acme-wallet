# Schema Step

## Onde alterar

- `packages/schemas/<entity_name>/<action>.schema.ts`
- `packages/schemas/index.ts`

## Padrão

```ts
import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
});

export const CreateUserResponseSchema = z.object({
  id: z.uuid(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type CreateUserOutput = z.infer<typeof CreateUserResponseSchema>;
```

