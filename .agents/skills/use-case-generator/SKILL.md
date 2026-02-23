# USE CASE GENERATOR

---
name: create-use-case
description: Aplicar quando criar um novo use case, baseado nas regras de injeção de dependência do DDD
---

## O QUE ESSA SKILL FAZ

- **Use Cases**: Uma classe com princípio da responsabilidade única, com um método `execute()`
- **Controller**: Controlador HTTP que chama o use case
- **Repository**: Implementação concreta do repositório do domínio
- **Testes de Unidade**: Para use case, controller e repository

## QUANDO USAR ESSA SKILL

Use quando quando você precisar:
- Adicionar uma nova operação de negócio a um contexto existente
- Implementar event-driven 
- Adicionar operações de CRUD em uma entidade

Exemplos:
- "Crie o ListUser use case para retornar todos os usuários cadastrados"
- "Crie o CriarProduto com validações de requisição"
- "Crie o GetUserByName para buscar um usuário pelo nome"

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

## CONTROLLER PATTERN
```javascript
import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import ActionEntityUseCase from 'src/context/application/use-cases/action-entity.use-case';
import { ActionEntityDto } from '../dto/context/action-entity.dto';

@Controller('entity')
export class EntityController {
  constructor(private readonly actionEntityUseCase: ActionEntityUseCase) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  create(@Body() body: ActionEntityDto) {
    const input = {
      field1: body.field1,
      field2: body.field2,
    }
    return this.actionEntityUseCase.execute(input);
  }

}

```

### REPOSITORY PATTERN
```typescript
import { Injectable } from "@nestjs/common";
import { Entity } from "src/contexts/context/domain/entities/entity.entity";
import { IEntityRepository } from "src/contexts/context/domain/repositories/entity.repository";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class EntityPrismaRepository implements IEntityRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async create(entity: Entity): Promise<{ id: string; }> {
        const output = await this.prismaService.prisma.entity.create({
            data: {
                id: entity.id,
                field1: entity.field1,
                field2: entity.field2,
            },
        });

        return {
            id: output.id,
        };
    }
}
```

## Regras de Injeção de Dependência

**Use Cases** e **Repositories**: Injetado na declaração do módulo `src/{domain}/{domain}.module.ts
`
```typescript
import { Module } from '@nestjs/common';
import ActionEntityUseCase from './application/use-cases/action-entity.use-case';
import { IEntityRepository } from "src/contexts/context/domain/repositories/entity.repository";
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
- Utilizar o TDD para criação do UseCase
- Caso a função no contrado não exista, crie
- Caso a função no controller não exista, crie
- Crie testes de unidade para o controller, repository e use case
- Os testes podem ser bem simples, seguindo as seguintes diretivas:

1. USE CASE
1.1 deve utilizar o pattern mock para acessar um repositório

2. CONTROLLER
2.1 deve se preocupar em validar as requisições HTTP
2.2 deve se preocupar em retornar os status codes corretos
2.3 deve se preocupar em retornar os objetos corretos
2.4 sem validações complexas de exceções e validações

3. REPOSITORY
3.1 utilizar o pattern mock para acessar um banco de dados

- Adicionar `Injectable()` decorator
- Única função `execute()` pública
- Defina Input/Output interfaces
- Retorne objetos puros, não entidades

**VOCÊ NÃO DEVE:**
- Esquecer `Injectable()` decorator
- Esquecer de criar ao menos um teste de unidade para o controller, repository e use case
- Misturar validações entre controller e repository, por ex: validar ingestão de dados no controller
- Inserir regras de negócios no use case (pertence às entidades)
- Retornar entidades do domínio diretamente

## TESTES

- Framework: Jest + `@nestjs/testing` + `jest-mock-extended`
- Localizacao: ao lado do arquivo testado, com sufixo `*.spec.ts`
- Nomenclatura: sempre usar `use-case` em pastas e arquivos
- Escopo minimo: 1 teste por classe (use case, controller, repository)
- Foco do teste:
  - Use case: valida chamada do repositorio mock e retorno do output
  - Controller: valida DTO/pipe e status code esperado
  - Repository: valida chamada do client mock (Prisma ou equivalente)

## EXEMPLOS DE TESTE

### Use case
```typescript
import CreateEntityUseCase from "./create-entity.use-case";
import { IEntityRepository } from "src/{domain}/domain/repositories/entity.repository";
import { mock, MockProxy } from "jest-mock-extended";

describe("Create Entity Use Case", () => {
  let entityRepository: MockProxy<IEntityRepository>;
  let sut: CreateEntityUseCase;

  beforeEach(() => {
    entityRepository = mock<IEntityRepository>();
    sut = new CreateEntityUseCase(entityRepository);
  });

  it("creates a new entity and returns id", async () => {
    entityRepository.create.mockResolvedValue({ id: "123" });

    const input = { name: "Ana", email: "ana@acme.com" };
    const output = await sut.execute(input);

    expect(output).toHaveProperty("id");
    expect(entityRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Ana", email: "ana@acme.com" })
    );
  });
});
```

### Controller
```typescript
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { MockProxy, mock } from "jest-mock-extended";
import { IEntityRepository } from "src/{domain}/domain/repositories/entity.repository";
import { EntityModule } from "src/{domain}/{domain}.module";

describe("EntityController (HTTP)", () => {
  let app: INestApplication;
  let entityRepository: MockProxy<IEntityRepository>;

  beforeAll(async () => {
    entityRepository = mock<IEntityRepository>();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EntityModule],
    })
      .overrideProvider(IEntityRepository)
      .useValue(entityRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /entities - creates entity", async () => {
    const payload = { name: "Ana", email: "ana@acme.com" };

    const response = await request(app.getHttpServer())
      .post("/entities")
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({ id: expect.any(String) })
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
```

### Repository
```typescript
import { Test } from "@nestjs/testing";
import { PrismaClient } from "@repo/db";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "src/prisma/prisma.service";
import { EntityPrismaRepository } from "src/{domain}/infra/repositories/entity-prisma.repository";

describe("EntityPrismaRepository", () => {
  let repo: EntityPrismaRepository;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const moduleRef = await Test.createTestingModule({
      providers: [
        EntityPrismaRepository,
        {
          provide: PrismaService,
          useValue: { prisma: prismaMock },
        },
      ],
    }).compile();

    repo = moduleRef.get(EntityPrismaRepository);
  });

  it("saves entity and returns id", async () => {
    const input = { name: "Ana", email: "ana@acme.com" };

    prismaMock.entity.create.mockResolvedValue({
      id: "e1",
      name: input.name,
      email: input.email,
      createdAt: new Date(),
    });

    const output = await repo.create(input as any);

    expect(prismaMock.entity.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ name: input.name, email: input.email }),
    });
    expect(output).toEqual({ id: "e1" });
  });
});
```


## Arquivos a serem gerados

```
/src/{Domain}/application/
├── use-cases/
│   ├── create-{entity}.use-case.ts
│   ├── create-{entity}.use-case.spec.ts
│   ├── find-{entity}.use-case.ts
│   ├── find-{entity}.use-case.spec.ts
│   ├── find-all-{entity}.use-case.ts
│   ├── find-all-{entity}.use-case.spec.ts
│   ├── update-{entity}.use-case.ts
│   ├── update-{entity}.use-case.spec.ts
│   ├── delete-{entity}.use-case.ts
│   └── delete-{entity}.use-case.spec.ts
└── index.ts

/src/{Domain}/interfaces/http/
└── {domain}.controller.spec.ts

/src/{Domain}/infra/repositories/
└── {entity}-prisma.repository.spec.ts
```

## Checklist de validação

After generation, verify:
- [ ] Todos os use case tem `@injectable()`
- [ ] Todos os use case tem um método público `execute()`
- [ ] Foi gerado o teste de unidade para todos contextos criados: use case, repository e controller
- [ ] Testes em `*.spec.ts` ao lado do arquivo testado
- [ ] Stack de teste: Jest + `@nestjs/testing` + `jest-mock-extended`
- [ ] Use cases injected by class
- [ ] Input/output interfaces definidos
- [ ] Returns plain objects
