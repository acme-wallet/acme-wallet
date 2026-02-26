# DTO Step

## Onde alterar

- `apps/api/src/<context_plural>/interfaces/dto/*.dto.ts`
- Controller que consome os DTOs: `apps/api/src/<context_plural>/interfaces/http/*.controller.ts`

## Padrão

- DTOs baseados em schema com `createZodDto(...)`
- Importar schemas de `@repo/schemas`
- Separar request e response (`*.request.dto.ts` e `*.response.dto.ts`) quando fizer sentido
- DTOs não devem conter regra de negócio

## Exemplo

```ts
import { createZodDto } from 'nestjs-zod';
import {
  CreateUserSchema,
  CreateUserResponseSchema,
} from '@repo/schemas';

export class CreateUserRequest extends createZodDto(CreateUserSchema) {}
export class CreateUserResponse extends createZodDto(CreateUserResponseSchema) {}
```
