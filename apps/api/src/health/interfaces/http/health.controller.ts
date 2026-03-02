import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { Env } from '../../../common/configs/env.schema';
import { PrismaService } from '../../../prisma/prisma.service';
import { HealthResponseDto } from '../dto/health-response.dto';

@ApiTags('health')
@Controller('health')
export class HealthController {
  private readonly memoryHeapThreshold: number;
  private readonly diskStorageThreshold: number;
  private readonly llamacppApiUrl: string;

  constructor(
    private health: HealthCheckService,
    private prisma: PrismaHealthIndicator,
    private db: PrismaService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private http: HttpHealthIndicator,
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
    this.llamacppApiUrl = this.configService.get('LLAMACPP_API_URL', {
      infer: true,
    });
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
      () => this.http.pingCheck('llama_cpp', `${this.llamacppApiUrl}/health`),
    ]);
  }
}
