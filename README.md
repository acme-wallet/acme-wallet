# ACME WALLET

## Requisitos

- Node.js (versão LTS recomendada)
- pnpm (o projeto usa pnpm como package manager)
- Docker & Docker Compose (para banco de dados e LLM local)
- GPU NVIDIA com drivers instalados (para aceleração do LLM via CUDA)

## Instalação

Na raiz do projeto:

```bash
pnpm install
```

## Variáveis de ambiente

Copie o arquivo de exemplo e preencha os valores:

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações.

## Executar com Docker Compose (banco + LLM local)

O `docker-compose.yml` sobe dois serviços:

| Serviço           | Descrição                                  | Porta  |
| ----------------- | ------------------------------------------ | ------ |
| `db`              | PostgreSQL 17                              | `5431` |
| `llamacpp-server` | llama.cpp Server (CUDA) com modelo via URL | `8080` |

```bash
docker compose up -d
```

> **Nota:** O modelo é baixado automaticamente na primeira inicialização a partir de `LLAMACPP_DEFAULT_MODEL_URL`. O download pode demorar dependendo do tamanho do modelo e da sua conexão.

### LLM Local — llama.cpp Server

O `llamacpp-server` expõe uma API compatível com OpenAI em `http://localhost:8080/v1`. Você pode interagir com ele diretamente:

```bash
# Acessar a interface web do llama.cpp
http://localhost:8080

# Verificar se o servidor está pronto
curl http://localhost:8080/health

# Enviar uma mensagem
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "",
    "messages": [{ "role": "user", "content": "Olá!" }],
    "stream": false
  }'
```

> O campo `model` pode ser vazio (`""`), pois o servidor usa o modelo carregado na inicialização.

## Executar a aplicação (dev)

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
