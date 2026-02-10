# USE CASE GENERATOR

---
name: create-use-case
description: Aplicar quando criar um novo use case, baseado nas regras de injeção de dependência do DDD
---

## O QUE ESSA SKILL FAZ

- **Use Cases**: Uma classe com princípio da responsabilidade única, com um método `execute()`

## QUANDO USAR ESSA SKILL

Use quando quando você precisar:
- Adicionar uma nova operação de negócio a um contexto existente
- Implementar event-driven 
- Adicionar operações de CRUD em uma entidade

Exemplos:
- "Crie o ListUser use case para retornar todos os usuários cadastrados"
- "Crie o CriarProduto com validações de requisição"

## USE CASE PATTERN

```typescript
import { MyEntity } from "src/contexts/context.entity";
import { IEntityRepository } from "src/contexts/context/domain.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class ActionEntityUseCase {
    constructor(private readonly entityRepo: IEntityRepository) {}

    async execute(input: Input): Promise<Output> {
        const output = new MyEntity(input.field1, input.field2);

        await this.entityRepo.create(output);

        return {
            id: output.id,
        }
    }
}

type Input = {
    field1: string;
    field2: string;
}

type Output = {
    id: string;
}
```

## Regras de Injeção de Dependência

**Use Cases** e **Repositories**: Injetado na declaração do módulo `src/{domain}/{domain}.module.ts
`
```typescript
import { Module } from '@nestjs/common';
import ActionEntityUseCase from './application/use-cases/ActionEntityUseCase.use-case';
import { IEntityRepository } from "src/contexts/context/domain.repository";
import { DomainController } from './interfaces/http/domain.controller';
import { DomainPrismaRepository } from './infra/repositories/domain-prisma.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [DomainController],
  providers: [
    ActionEntityUseCase,
    PrismaService,
    {
      provide: IEntityRepository,
      useClass: DomainPrismaRepository,
    }
  ],
})

export class DomainModule {}
```

## Regras Críticas

**VOCÊ DEVE:**
- Adicionar `Injectable()` decorator
- Única função `execte()` pública
- Defina Input/Output interfaces
- Retorne objetos puros, não entidades

**VOCÊ NÃO DEVE:**
- Esquecer `Injectable()` decorator
- Inserir regras de negócios no use case (pertence às entidades)
- Retornar entidades do domínio diretamente


## Arquivos a serem gerados

```
/src/{Domain}/application/
├── usecases/
│   ├── create-{entity}.usecase.ts
│   ├── find-{entity}.usecase.ts
│   ├── find-all-{entity}.usecase.ts
│   ├── update-{entity}.usecase.ts
│   └── delete-{entity}.usecase.ts
└── index.ts
```

## Checklist de validação

After generation, verify:
- [ ] Todos os use case tem `@injectable()`
- [ ] Use cases injected by class
- [ ] Único método de `execute()`
- [ ] Input/output interfaces definidos
- [ ] Returns plain objects
