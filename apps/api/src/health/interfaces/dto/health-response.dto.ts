import { createZodDto } from 'nestjs-zod';
import { HealthResponseSchema } from '@repo/schemas';

export class HealthResponseDto extends createZodDto(HealthResponseSchema) {}
