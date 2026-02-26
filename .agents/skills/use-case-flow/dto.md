# DTO Step

## Onde alterar

- `apps/api/src/<context_plural>/interfaces/dto/*.dto.ts`
- Controller que consome os DTOs: `apps/api/src/<context_plural>/interfaces/http/*.controller.ts`

## Padrão

- DTOs baseados em schema com `createZodDto(...)`
- Importar schemas de `@repo/schemas`
- Exportar aliases para uso da camada de aplicação:
- `export type <Action>InputDto = <Action>Request`
- `export type <Action>OutputDto = <Action>Response`
- Para casos sem response body, expor `type <Action>OutputDto = void`
- Separar request e response (`*.request.dto.ts` e `*.response.dto.ts`) quando fizer sentido
- DTOs não devem conter regra de negócio

## Caso comum: `id` no `param`, não no `body`

- Em operações como `PUT /users/:id`, o `id` pertence ao path param e não deve vir no body.
- Nesses casos, o `Request` pode omitir `id` do schema (`Schema.omit({ id: true })`) para validar apenas o corpo.
- O `InputDto` do use case pode reintroduzir `id` via composição de tipo, pois a aplicação precisa dele:
- `export type UpdateUserInputDto = UpdateUserRequest & { id: string }`
- No controller, juntar `param` + `body` antes de chamar o use case (`{ ...body, id }`).
- Isso mantém o contrato HTTP correto e, ao mesmo tempo, preserva a entrada completa da camada de aplicação.

## Exemplo

```ts
import { createZodDto } from 'nestjs-zod';
import {
  CreateUserSchema,
  CreateUserResponseSchema,
} from '@repo/schemas';

export class CreateUserRequest extends createZodDto(CreateUserSchema) {}
export class CreateUserResponse extends createZodDto(CreateUserResponseSchema) {}

export type CreateUserInputDto = CreateUserRequest;
export type CreateUserOutputDto = CreateUserResponse;
```

### Exemplo com `id` no `param`

```ts
import { createZodDto } from 'nestjs-zod';
import { UpdateUserSchema, UpdateUserResponseSchema } from '@repo/schemas';

export class UpdateUserRequest extends createZodDto(
  UpdateUserSchema.omit({ id: true }),
) {}
export class UpdateUserResponse extends createZodDto(UpdateUserResponseSchema) {}

export type UpdateUserInputDto = UpdateUserRequest & { id: string };
export type UpdateUserOutputDto = UpdateUserResponse;
```
