---
name: use-case-flow
description: Implementar fluxo completo de caso de uso no apps/api (Schema, DTO, UseCase, Repository e Controller) com TDD e testes unitários por camada.
---

# Use Case Flow

Use esta skill para criar ou evoluir uma operação completa no `apps/api`, seguindo o fluxo do projeto:

1. Schema
2. DTO
3. Use Case
4. Repository
5. Controller

Use em conjunto com `.agents/skills/tdd/SKILL.md`.

## Quando usar

- Novo endpoint/ação de negócio em um contexto existente
- Evolução de uma operação que afeta contrato, aplicação, persistência e HTTP
- Ajustes de fluxo com cobertura unitária por camada

## Onde está cada etapa

- Schema: [schema.md](schema.md)
- DTO: [dto.md](dto.md)
- Use Case: [use-case.md](use-case.md)
- Repository: [repository.md](repository.md)
- Controller: [controller.md](controller.md)

## Mapeamento do projeto

- Use cases: `apps/api/src/<context_plural>/application/use-cases/*.use-case.ts`
- Controllers: `apps/api/src/<context_plural>/interfaces/http/*.controller.ts`
- Repositories: `apps/api/src/<context_plural>/infra/repositories/*-prisma.repository.ts`
- Contratos de repositório: `apps/api/src/<context_plural>/domain/repositories/*.repository.ts`
- Schemas zod: `packages/schemas/<entity_name>/*.schema.ts`
- DTOs HTTP: `apps/api/src/<context_plural>/interfaces/dto/**`

## Regras globais

- Contratos de entrada/saída via `@repo/schemas`
- DTOs com `createZodDto(...)`
- Regra de negócio no domínio/use case, não no controller
- Repository sem validação HTTP
- Testes unitários ao lado dos arquivos (`*.spec.ts`)
- Stack: `vitest`, `@nestjs/testing`, `vitest-mock-extended`, `supertest`

## Checklist final

- [ ] Schema criado e exportado em `packages/schemas/index.ts`
- [ ] Use case com `@Injectable()` e método `execute()`
- [ ] Contrato do repositório alinhado com o use case
- [ ] Repositório Prisma implementado/ajustado
- [ ] Controller + DTOs conectados ao schema
- [ ] Módulo Nest atualizado (`providers` e binding `provide/useClass`)
- [ ] Teste unitário de schema
- [ ] Teste unitário de use case
- [ ] Teste unitário de repositório
- [ ] Teste unitário de controller
- [ ] Validação final executada com `pnpm build`
- [ ] Validação final executada com `pnpm test`
