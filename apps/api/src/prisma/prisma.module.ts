// src/prisma/prisma.module.ts
import { Module } from '@nestjs/common';
import { prisma } from '@repo/db';
import { PrismaService, PRISMA_CLIENT } from './prisma.service';

@Module({
  providers: [{ provide: PRISMA_CLIENT, useValue: prisma }, PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
