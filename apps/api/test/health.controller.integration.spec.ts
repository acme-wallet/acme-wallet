import { PrismaClient } from '@repo/db';
import { createTestingModule } from './helpers/prisma-test-container';
import { HealthModule } from 'src/health/health.module';
import { HealthController } from 'src/health/interfaces/http/health.controller';
import { vi } from 'vitest';
import { ServiceUnavailableException } from '@nestjs/common';

describe('HealthController (integration)', () => {
  let prismaClient: PrismaClient;
  let controller: HealthController;

  beforeAll(async () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL not set');
    }

    const { module, prismaClient: client } = await createTestingModule(
      databaseUrl,
      {
        imports: [HealthModule],
      },
    );

    prismaClient = client;
    controller = module.get(HealthController);
  });

  afterAll(async () => {
    await prismaClient?.$disconnect();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return health status as ok when all services are up', async () => {
    const result = await controller.check();

    expect(result.status).toBe('ok');
    expect(result.info).toBeDefined();

    expect(result.details).toHaveProperty('database');
    expect(result.details.database.status).toBe('up');

    expect(result.details).toHaveProperty('memory_heap');
    expect(result.details.memory_heap.status).toBe('up');

    expect(result.details).toHaveProperty('storage');

    expect(result.details.storage).toBeDefined();
  });

  it('should throw ServiceUnavailableException if a service is down', async () => {
    const { PrismaHealthIndicator, HealthCheckError } =
      await import('@nestjs/terminus');
    vi.spyOn(
      PrismaHealthIndicator.prototype,
      'pingCheck',
    ).mockRejectedValueOnce(
      new HealthCheckError('Connection refused', {
        database: { status: 'down' },
      }),
    );

    await expect(controller.check()).rejects.toThrow(
      ServiceUnavailableException,
    );
  });
});
