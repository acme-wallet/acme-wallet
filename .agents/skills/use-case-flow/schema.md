# Schema Step

## Onde alterar

- `packages/schemas/<context>/<action>.schema.ts`
- `packages/schemas/index.ts`

## Padrão

```ts
import { z } from 'zod';

export const ActionSchema = z.object({
  id: z.uuid('ID inválido'),
});

export const ActionResponseSchema = z.object({
  id: z.uuid(),
});

export type ActionInput = z.infer<typeof ActionSchema>;
export type ActionOutput = z.infer<typeof ActionResponseSchema>;
```

