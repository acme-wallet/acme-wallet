# Repository Step

## Onde alterar

- Contrato: `apps/api/src/<context>/domain/repositories/*.repository.ts`
- Implementação: `apps/api/src/<context>/infra/repositories/*-prisma.repository.ts`
- Módulo: `apps/api/src/<context>/<context>.module.ts`

## Padrão

- Contrato abstrato (`abstract class I...Repository`)
- Implementação com `@Injectable()` e `PrismaService`
- Mapping para entidade com `Entity.restore(...)` quando aplicável

## TDD (vertical)

1. RED: teste da operação pedida (ex: `findByName`).
2. GREEN: implementação mínima dessa operação no Prisma.
3. RED: teste de um comportamento complementar da mesma operação (ex: retorno vazio, filtro parcial, erro esperado).
4. GREEN: ajustar apenas o necessário para passar.
5. REFACTOR: extrair mapeamento repetido sem ampliar escopo.

## Testes

- Arquivo: `*-prisma.repository.spec.ts`
- Stack: `@nestjs/testing` + `vitest` + `vitest-mock-extended`
- Cobertura mínima:
- query Prisma esperada para a operação pedida
- mapeamento de retorno para entidade (se houver retorno de entidade)
- cenário de borda da mesma operação (`null`, vazio ou erro), quando aplicável
