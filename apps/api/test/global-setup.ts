import {
  startPostgresContainer,
  runPrismaMigrations,
} from './helpers/prisma-test-container';

export async function setup() {
  const container = await startPostgresContainer();
  const databaseUrl = container.getConnectionUri();

  runPrismaMigrations(databaseUrl);

  process.env.DATABASE_URL = databaseUrl;

  return async () => {
    await container.stop();
  };
}
