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
  private readonly memoryHeapThreshold: number;
  private readonly diskStorageThreshold: number;

  constructor(
    private health: HealthCheckService,
    private prisma: PrismaHealthIndicator,
    private db: PrismaService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private configService: ConfigService<Env, true>,
  ) {
    this.memoryHeapThreshold = this.configService.get(
      'MEMORY_HEAP_THRESHOLD_BYTES',
      { infer: true },
    );
    this.diskStorageThreshold = this.configService.get(
      'DISK_STORAGE_THRESHOLD_PERCENT',
      { infer: true },
    );
  }

  @Get()
  @HealthCheck()
  @ApiOkResponse({
    description: 'The health check result.',
    type: HealthResponseDto,
  })
  check(): Promise<HealthResponseDto> {
    return this.health.check([
      () => this.prisma.pingCheck('database', this.db.prisma),
      () => this.memory.checkHeap('memory_heap', this.memoryHeapThreshold),
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: this.diskStorageThreshold,
        }),
    ]);
  }
}
