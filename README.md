# ACME WALLET

## Requisitos

- Node.js (versao LTS recomendada)
- pnpm (o projeto usa pnpm)
- Postgres (ou uma URL de conexao valida para DATABASE_URL)

## Instalacao

Na raiz do projeto:

```bash
pnpm install
```

## Variaveis de ambiente

Crie um arquivo `.env` em:

- `packages/database/`
- `apps/api/`

Conteudo minimo:

```bash
DATABASE_URL={YOUR_DATABASE_URL}
```

## Executar a aplicacao

```bash
pnpm dev
```

## Testes

```bash
pnpm test
```

## Prisma Studio

```bash
pnpm db:studio
```
