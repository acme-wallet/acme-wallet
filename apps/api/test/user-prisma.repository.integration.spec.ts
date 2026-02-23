import { PrismaClient } from '@repo/db';
import { UserPrismaRepository } from 'src/users/infra/repositories/user-prisma.repository';
import { User } from 'src/users/domain/entities/user.entity';
import { createTestingModule } from './helpers/prisma-test-container';

describe('UserPrismaRepository (integration)', () => {
  let prismaClient: PrismaClient;
  let repo: UserPrismaRepository;

  beforeAll(async () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL not set');
    }

    const { module, prismaClient: client } = await createTestingModule(
      databaseUrl,
      {
        providers: [UserPrismaRepository],
      },
    );

    prismaClient = client;
    repo = module.get(UserPrismaRepository);
  });

  afterAll(async () => {
    await prismaClient?.$disconnect();
  });

  afterEach(async () => {
    await prismaClient.user.deleteMany();
  });

  it('should create a user in the database', async () => {
    const user = User.create('Alice', 'alice@acme.com');

    await repo.create(user);

    const dbUser = await prismaClient.user.findUnique({
      where: { email: 'alice@acme.com' },
    });

    expect(dbUser).not.toBeNull();
    expect(dbUser!.id).toBeDefined();
    expect(dbUser!.name).toBe('Alice');
    expect(dbUser!.email).toBe('alice@acme.com');
  });

  it('should reject duplicate emails', async () => {
    const user1 = User.create('Bob', 'bob@acme.com');
    const user2 = User.create('Bobby', 'bob@acme.com');

    await repo.create(user1);

    await expect(repo.create(user2)).rejects.toThrow();
  });
});
