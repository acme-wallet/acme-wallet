import { Module } from '@nestjs/common';
import { UsersController } from './interfaces/users.controller';
import CreateUserUseCase from './application/use-cases/create-user.use-case';
import { IUserRepository } from './domain/repositories/user.repository';
import { MemoryDBRepository } from './infra/repositories/memory-db.repository';

@Module({
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    {
      provide: IUserRepository,
      useClass: MemoryDBRepository,
    }
  ],
})

export class UsersModule {}
