# Controller Step

## Onde alterar

- Controller: `apps/api/src/<context>/interfaces/http/*.controller.ts`
- DTOs: `apps/api/src/<context>/interfaces/dto/**`
- Módulo: `apps/api/src/<context>/<context>.module.ts`

## Padrão

- DTO request/response com `createZodDto(...)` usando `@repo/schemas`
- Controller apenas faz map HTTP -> input do use case
- Chamada para `useCase.execute(...)`
- `ParseUUIDPipe` para `:id` quando aplicável

## TDD (vertical)

1. RED: teste do endpoint principal (status + body).
2. GREEN: endpoint mínimo.
3. RED: payload inválido (400) e cenários relevantes.
4. GREEN.
5. REFACTOR: simplificar mapeamento.

## Testes

- Arquivo: `*.controller.spec.ts`
- Stack: `@nestjs/testing` + `vitest` + `supertest`
- Mocks de use case com `vitest-mock-extended`
- Cobertura mínima:
- status de sucesso correto
- shape de resposta correto
- payload inválido retorna 400
