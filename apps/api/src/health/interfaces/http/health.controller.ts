import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../../../prisma/prisma.service';
import { HealthResponseDto } from '../dto/health-response.dto';

@ApiTags('health')
@Controller('health')
export class HealthController {
  private readonly MEMORY_HEAP_THRESHOLD_BYTES =
    Number(process.env.MEMORY_HEAP_THRESHOLD_BYTES) || 300 * 1024 * 1024; // 300MB
  private readonly DISK_STORAGE_THRESHOLD_PERCENT =
    Number(process.env.DISK_STORAGE_THRESHOLD_PERCENT) || 0.8; // 80%

  constructor(
    private health: HealthCheckService,
    private prisma: PrismaHealthIndicator,
    private db: PrismaService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOkResponse({
    description: 'The health check result.',
    type: HealthResponseDto,
  })
  check(): Promise<HealthResponseDto> {
    return this.health.check([
      () => this.prisma.pingCheck('database', this.db.prisma),
      () =>
        this.memory.checkHeap('memory_heap', this.MEMORY_HEAP_THRESHOLD_BYTES),
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: this.DISK_STORAGE_THRESHOLD_PERCENT,
        }),
    ]);
  }
}
