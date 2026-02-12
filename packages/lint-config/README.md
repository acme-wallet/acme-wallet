# @acme/lint-config

Configurações compartilhadas de ESLint para o monorepo.

## Por que usar este pacote?

✅ **Centraliza dependências** - Não precisa instalar eslint, prettier, typescript-eslint em cada app  
✅ **Padroniza regras** - Garante que todos os apps seguem as mesmas regras base  
✅ **Facilita manutenção** - Alterar uma regra em um lugar aplica para todos  

## Instalação

```bash
pnpm add @acme/lint-config --workspace
```

## Uso

### Para aplicações NestJS/Node.js

```js
// eslint.config.mjs
import { nestjs } from '@acme/lint-config';

export default nestjs(import.meta.dirname);
```

### Para aplicações React/Vite

```js
// eslint.config.js
import { react } from '@acme/lint-config';

export default react;
```

## O que está compartilhado?

- **Regras base do ESLint** (`recommended`)
- **Configuração do Prettier** (endOfLine: auto)
- **Todas as dependências** (eslint, prettier, typescript-eslint, etc.)

Cada configuração adiciona suas regras específicas:

### NestJS
- TypeScript ESLint com type checking
- Suporte para Jest e Node.js
- Regras otimizadas para backend

### React
- TypeScript ESLint básico
- React Hooks e React Refresh
- Regras otimizadas para navegadores

## Customização

Você pode adicionar regras específicas do seu app:

```js
import { nestjs } from '@acme/lint-config';

export default [
  ...nestjs(import.meta.dirname),
  {
    rules: {
      // suas regras customizadas aqui
    }
  }
];
```
