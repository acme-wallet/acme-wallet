import { z } from 'zod';

const HealthIndicatorSchema = z.record(
    z.string(),
    z.object({ status: z.enum(['up', 'down']) }),
);

export const HealthResponseSchema = z.object({
    status: z.enum(['error', 'ok', 'shutting_down']),
    info: z.record(z.string(), z.any()).optional(),
    error: z.record(z.string(), z.any()).optional(),
    details: HealthIndicatorSchema,
});

export type HealthResponseOutput = z.infer<typeof HealthResponseSchema>;
