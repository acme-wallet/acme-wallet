import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { prisma, PrismaClient } from "@repo/db";

@Injectable()
export class PrismaService implements OnModuleDestroy {
  readonly prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
