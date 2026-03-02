import { ServiceUnavailableException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckResult, HttpHealthIndicator } from '@nestjs/terminus';
import { PrismaClient } from '@repo/db';
import { envSchema } from 'src/common/configs/env.schema';
import { HealthModule } from 'src/health/health.module';
import { HealthController } from 'src/health/interfaces/http/health.controller';
import { vi } from 'vitest';
import { createTestingModule } from './helpers/prisma-test-container';

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
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['../../.env', '../../.env.example'],
            validate: (config) => envSchema.parse(config),
          }),
          HealthModule,
        ],
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
    vi.spyOn(HttpHealthIndicator.prototype, 'pingCheck').mockResolvedValueOnce({
      llama_cpp: { status: 'up' },
    });

    const result: HealthCheckResult = await controller.check();

    expect(result.status).toBe('ok');
    expect(result.info).toBeDefined();

    expect(result.details).toHaveProperty('database');
    expect(result.details.database.status).toBe('up');

    expect(result.details).toHaveProperty('memory_heap');
    expect(result.details.memory_heap.status).toBe('up');

    expect(result.details).toHaveProperty('storage');
    expect(result.details.storage).toBeDefined();

    expect(result.details).toHaveProperty('llama_cpp');
    expect(result.details.llama_cpp.status).toBe('up');
  });

  it('should throw ServiceUnavailableException if a service is down', async () => {
    await expect(controller.check()).rejects.toThrow(
      ServiceUnavailableException,
    );
  });
});
