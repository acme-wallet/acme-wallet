
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import path from 'path';
import { PrismaClient } from '@repo/db';
import { PrismaPg } from '@prisma/adapter-pg';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService, PRISMA_CLIENT } from 'src/prisma/prisma.service';

const DATABASE_PACKAGE_DIR = path.resolve(__dirname, '../../../../packages/database');

/** * Starts a PostgreSQL container via Testcontainers. */
export async function startPostgresContainer(): Promise<StartedPostgreSqlContainer> { const container = await new PostgreSqlContainer('postgres:16-alpine').withDatabase('test_db').withUsername('test').withPassword('test').start(); return container; }

/** * Runs Prisma migrations against the given database URL. */
export function runPrismaMigrations(databaseUrl: string): void { execSync('npx prisma migrate deploy', { cwd: DATABASE_PACKAGE_DIR, env: { ...process.env, DATABASE_URL: databaseUrl }, stdio: 'pipe', }); }

/** * Creates a PrismaClient configured to connect to the given database URL * using the PrismaPg driver adapter. */
export function createTestPrismaClient(databaseUrl: string): PrismaClient { const adapter = new PrismaPg({ connectionString: databaseUrl }); return new PrismaClient({ adapter }); }

/** * Creates a NestJS TestingModule with PrismaService overridden to use * a PrismaClient connected to the given database URL. */
export async function createTestingModule(databaseUrl: string, metadata: { imports?: any[]; providers?: any[] } = {},): Promise<{ module: TestingModule; prismaClient: PrismaClient }> {
    const prismaClient = createTestPrismaClient(databaseUrl); const module = await Test.createTestingModule({ imports: metadata.imports ?? [], providers: [...(metadata.providers ?? []), PrismaService, { provide: PRISMA_CLIENT, useValue: prismaClient, },], }).compile();
    return { module, prismaClient };
}