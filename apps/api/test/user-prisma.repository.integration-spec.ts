import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { PrismaClient } from '@repo/db';
import { UserPrismaRepository } from 'src/users/infra/repositories/user-prisma.repository';
import { User } from 'src/users/domain/entities/user.entity';
import {
    startPostgresContainer,
    runPrismaMigrations,
    createTestingModule,
} from './helpers/prisma-test-container';

describe('UserPrismaRepository (integration)', () => {
    let container: StartedPostgreSqlContainer;
    let prismaClient: PrismaClient;
    let repo: UserPrismaRepository;

    beforeAll(async () => {
        container = await startPostgresContainer();
        const databaseUrl = container.getConnectionUri();

        runPrismaMigrations(databaseUrl);

        const { module, prismaClient: client } = await createTestingModule(databaseUrl, {
            providers: [UserPrismaRepository],
        });

        prismaClient = client;
        repo = module.get(UserPrismaRepository);


        // Verify we're connected to the container
        const result = await prismaClient.$queryRaw`SELECT version()`;
        console.log('Connected to:', result);  // Shows PostgreSQL version
    });

    afterAll(async () => {
        await prismaClient?.$disconnect();
        await container?.stop();
    });

    afterEach(async () => {
        // Clean up data between tests
        await prismaClient.user.deleteMany();
    });

    it('should create a user in the database', async () => {
        const user = new User('Alice', 'alice@acme.com');

        const result = await repo.create(user);

        expect(result).toHaveProperty('id');
        expect(result.id).toBeDefined();

        // Verify the record exists in the real database
        const dbUser = await prismaClient.user.findUnique({
            where: { id: result.id },
        });

        expect(dbUser).not.toBeNull();
        expect(dbUser!.name).toBe('Alice');
        expect(dbUser!.email).toBe('alice@acme.com');
    });

    it('should reject duplicate emails', async () => {
        const user1 = new User('Bob', 'bob@acme.com');
        const user2 = new User('Bobby', 'bob@acme.com');

        await repo.create(user1);

        await expect(repo.create(user2)).rejects.toThrow();
    });
});