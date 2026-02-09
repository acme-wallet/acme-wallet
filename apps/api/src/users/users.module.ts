import { Module } from '@nestjs/common';
import CreateUserUseCase from './application/use-cases/create-user.use-case';
import { IUserRepository } from './domain/repositories/user.repository';
import { MemoryDBRepository } from './infra/repositories/memory-db.repository';
import { UsersController } from './interfaces/http/users.controller';

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
