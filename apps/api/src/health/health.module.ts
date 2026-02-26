import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from '../prisma/prisma.module';
import { HealthController } from './interfaces/http/health.controller';

@Module({
  imports: [ConfigModule, TerminusModule, PrismaModule],
  controllers: [HealthController],
})
export class HealthModule {}
