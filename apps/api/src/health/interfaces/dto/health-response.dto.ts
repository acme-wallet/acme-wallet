/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({
    example: 'ok',
    enum: ['error', 'ok', 'shutting_down'],
    description: 'The overall status of the application',
  })
  status: 'error' | 'ok' | 'shutting_down';

  @ApiProperty({
    required: false,
    example: {
      database: { status: 'up' },
      memory_heap: { status: 'up' },
      storage: { status: 'up' },
    },
    description:
      'The info object containing information of each health indicator',
  })
  info?: Record<string, any>;

  @ApiProperty({
    required: false,
    example: {},
    description:
      'The error object containing information of each failing health indicator',
  })
  error?: Record<string, any>;

  @ApiProperty({
    example: {
      database: { status: 'up' },
      memory_heap: { status: 'up' },
      storage: { status: 'up' },
    },
    description:
      'The details object containing information of every health indicator',
  })
  details: Record<string, { status: 'up' | 'down' }>;
}
