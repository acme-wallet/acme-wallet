<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> ad34af1 (fix(users): refactor CRUD endpoints)
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@repo/db';
import { DeepMockProxy, mockDeep } from 'vitest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/users/domain/entities/user.entity';
import { UserPrismaRepository } from 'src/users/infra/repositories/user-prisma.repository';

function prismaUserFromEntity(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

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

  it('should persist a user', async () => {
    const input = User.create('Ana', 'ana@acme.com');

    prismaMock.user.create.mockResolvedValue({
      ...prismaUserFromEntity(input),
    });

    await repo.create(input);

    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        id: input.id,
        name: input.name,
        email: input.email,
      },
    });
  });

  it('should find all users', async () => {
    const user = User.create('Ana', 'ana@acme.com');
    prismaMock.user.findMany.mockResolvedValue([prismaUserFromEntity(user)]);

    const result = await repo.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Ana');
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {
        name: {
          contains: undefined,
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

  it('should find users by name', async () => {
    const user = User.create('Ana', 'ana@acme.com');
    prismaMock.user.findMany.mockResolvedValue([prismaUserFromEntity(user)]);

    const result = await repo.findAll({ name: user.name });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe(user.name);
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {
        name: {
          contains: user.name,
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
    const user = User.create('Ana', 'ana@acme.com');
    prismaMock.user.findMany.mockResolvedValue([prismaUserFromEntity(user)]);

    const result = await repo.findAll({ email: user.email });

    expect(result).toHaveLength(1);
    expect(result[0].email).toBe(user.email);
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {
        name: {
          contains: undefined,
        },
        email: {
          contains: user.email,
        },
        id: {
          equals: undefined,
        },
      },
    });
  });

  it('should find users by id', async () => {
    const user = User.create('Ana', 'ana@acme.com');
    prismaMock.user.findMany.mockResolvedValue([prismaUserFromEntity(user)]);

    const result = await repo.findAll({ id: user.id });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(user.id);
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {
        name: {
          contains: undefined,
        },
        email: {
          contains: undefined,
        },
        id: {
          equals: user.id,
        },
      },
    });
  });
<<<<<<< HEAD
});
=======
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@repo/db';
import { DeepMockProxy, mockDeep } from 'vitest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/users/domain/entities/user.entity';
import { UserPrismaRepository } from 'src/users/infra/repositories/user-prisma.repository';

function prismaUserFromEntity(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

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

  it('should persist a user', async () => {
    const input = User.create('Ana', 'ana@acme.com');

    prismaMock.user.create.mockResolvedValue({
      ...prismaUserFromEntity(input),
    });

    await repo.create(input);

    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        id: input.id,
        name: input.name,
        email: input.email,
      },
    });
  });

  it('should find all users', async () => {
    const user = User.create('Ana', 'ana@acme.com');
    prismaMock.user.findMany.mockResolvedValue([prismaUserFromEntity(user)]);

    const result = await repo.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Ana');
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {
        name: {
          contains: undefined,
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

  it('should find users by name', async () => {
    const user = User.create('Ana', 'ana@acme.com');
    prismaMock.user.findMany.mockResolvedValue([prismaUserFromEntity(user)]);

    const result = await repo.findAll({ name: user.name });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe(user.name);
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {
        name: {
          contains: user.name,
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
    const user = User.create('Ana', 'ana@acme.com');
    prismaMock.user.findMany.mockResolvedValue([prismaUserFromEntity(user)]);

    const result = await repo.findAll({ email: user.email });

    expect(result).toHaveLength(1);
    expect(result[0].email).toBe(user.email);
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {
        name: {
          contains: undefined,
        },
        email: {
          contains: user.email,
        },
        id: {
          equals: undefined,
        },
      },
    });
  });

  it('should find users by id', async () => {
    const user = User.create('Ana', 'ana@acme.com');
    prismaMock.user.findMany.mockResolvedValue([prismaUserFromEntity(user)]);

    const result = await repo.findAll({ id: user.id });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(user.id);
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {
        name: {
          contains: undefined,
        },
        email: {
          contains: undefined,
        },
        id: {
          equals: user.id,
        },
      },
    });
  });
});
>>>>>>> f9afc0a (feat(tdd): add documentation for test-driven development principles and practices)
=======
});
>>>>>>> ad34af1 (fix(users): refactor CRUD endpoints)
