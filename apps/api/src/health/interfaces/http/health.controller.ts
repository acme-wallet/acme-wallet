import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../../../prisma/prisma.service';
import { HealthResponseDto } from '../dto/health-response.dto';
import { Env } from '../../../common/configs/env.schema';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaHealthIndicator,
    private db: PrismaService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private configService: ConfigService<Env, true>,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOkResponse({
    description: 'The health check result.',
    type: HealthResponseDto,
  })
  check(): Promise<HealthResponseDto> {
    const memoryHeapThreshold = this.configService.get(
      'MEMORY_HEAP_THRESHOLD_BYTES',
      { infer: true },
    );
    const diskStorageThreshold = this.configService.get(
      'DISK_STORAGE_THRESHOLD_PERCENT',
      { infer: true },
    );

    return this.health.check([
      () => this.prisma.pingCheck('database', this.db.prisma),
      () => this.memory.checkHeap('memory_heap', memoryHeapThreshold),
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: diskStorageThreshold,
        }),
    ]);
  }
}
