# Use Case Step

## Onde alterar

- `apps/api/src/<context_plural>/application/use-cases/<action>.use-case.ts`
- `apps/api/src/<context_plural>/application/use-cases/<action>.use-case.spec.ts`
- `apps/api/src/<context_plural>/<context_plural>.module.ts`

## Padrão

- `@Injectable()`
- API pública única: `execute(input)`
- `Input/Output` vindos de `@repo/schemas`
- Dependência por contrato (`I<EntityName>Repository`)

## TDD (vertical)

1. RED: comportamento principal do `execute`.
2. GREEN: implementação mínima.
3. RED: branch de erro/regra de domínio.
4. GREEN: completar.
5. REFACTOR: clareza e redução de duplicação.

## Testes

- Stack: `vitest` + `vitest-mock-extended`
- Cobertura mínima:
- chama repositório com input correto
- retorna output esperado
- lança exceção de domínio quando aplicável
