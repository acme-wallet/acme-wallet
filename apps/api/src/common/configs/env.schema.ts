import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  URL_FRONTEND: z.string().url(),
  MEMORY_HEAP_THRESHOLD_BYTES: z.coerce.number().default(300 * 1024 * 1024),
  DISK_STORAGE_THRESHOLD_PERCENT: z.coerce.number().default(0.8),
  DATABASE_URL: z.string().url(),
  GROQ_API_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;
