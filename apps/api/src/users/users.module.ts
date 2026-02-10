import { Module } from '@nestjs/common';
import CreateUserUseCase from './application/use-cases/create-user.use-case';
import { IUserRepository } from './domain/repositories/user.repository';
import { UsersController } from './interfaces/http/users.controller';
import { UserPrismaRepository } from './infra/repositories/user-prisma.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    PrismaService,
    {
      provide: IUserRepository,
      useClass: UserPrismaRepository,
    }
  ],
})

export class UsersModule {}
