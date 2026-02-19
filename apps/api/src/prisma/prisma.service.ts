import { Inject, Injectable, OnModuleDestroy, Optional } from '@nestjs/common';
import { prisma, PrismaClient } from '@repo/db';

export const PRISMA_CLIENT = Symbol("PRISMA_CLIENT")

@Injectable()
export class PrismaService implements OnModuleDestroy {
  readonly prisma: PrismaClient;

  constructor(
    @Optional() @Inject(PRISMA_CLIENT) client?: PrismaClient
  ) {
    this.prisma = client ?? prisma;
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
