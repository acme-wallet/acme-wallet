import { Test } from '@nestjs/testing';
import { PrismaClient } from '@repo/db';
import { DeepMockProxy, mockDeep } from 'vitest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/users/domain/entities/user.entity';
import { UserPrismaRepository } from 'src/users/infra/repositories/user-prisma.repository';

describe('UserPrismaRepository', () => {
  let repo: UserPrismaRepository;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserPrismaRepository,
        {
          provide: PrismaService,
          useValue: { prisma: prismaMock },
        },
      ],
    }).compile();

    repo = moduleRef.get(UserPrismaRepository);
  });

  it('saves a user and returns id', async () => {
    const input = new User('Ana', 'ana@acme.com');

    // Mocka o retorno do banco, após a criação
    prismaMock.user.create.mockResolvedValue({
      id: input.id,
      name: input.name,
      email: input.email,
      createdAt: new Date(),
    });

    const output = await repo.create(input);

    // Valida se os dados corretos foram passados para o banco
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        id: input.id,
        name: input.name,
        email: input.email,
      },
    });

    expect(output.id).toBe(input.id);
  });

  it('should find all users', async () => {
    const user = new User('Ana', 'ana@acme.com');
    prismaMock.user.findMany.mockResolvedValue([
      {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: new Date(),
      },
    ]);

    const result = await repo.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Ana');
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {
        name: {
          contains: undefined,
        },
      },
    });
  });

  it('should find users by name', async () => {
    const user = new User('Ana', 'ana@acme.com');
    prismaMock.user.findMany.mockResolvedValue([
      {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: new Date(),
      },
    ]);

    const result = await repo.findAll({ name: 'Ana' });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Ana');
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {
        name: {
          contains: 'Ana',
        },
        email: {
          contains: undefined,
        },
        id: {
          equals: undefined,
        },
      },
    });
  });

  it('should find users by email', async () => {
    const user = new User('Ana', 'ana@acme.com');
    prismaMock.user.findMany.mockResolvedValue([
      {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: new Date(),
      },
    ]);

    const result = await repo.findAll({ email: 'ana@acme.com' });

    expect(result).toHaveLength(1);
    expect(result[0].email).toBe('ana@acme.com');
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {
        name: {
          contains: undefined,
        },
        email: {
          contains: 'ana@acme.com',
        },
        id: {
          equals: undefined,
        },
      },
    });
  });

  it('should find users by id', async () => {
    const user = new User('Ana', 'ana@acme.com', '123');
    prismaMock.user.findMany.mockResolvedValue([
      {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: new Date(),
      },
    ]);

    const result = await repo.findAll({ id: '123' });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('123');
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {
        name: {
          contains: undefined,
        },
        email: {
          contains: undefined,
        },
        id: {
          equals: '123',
        },
      },
    });
  });
});
