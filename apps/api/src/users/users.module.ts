import { Module } from '@nestjs/common';
import CreateUserUseCase from './application/use-cases/create-user.use-case';
import GetUsersUseCase from './application/use-cases/get-users.use-case';
import GetUserByIdUseCase from './application/use-cases/get-user-by-id.use-case';
import UpdateUserUseCase from './application/use-cases/update-user.use-case';
import DeleteUserUseCase from './application/use-cases/delete-user.use-case';
import { UsersController } from './interfaces/http/users.controller';
import { UsersPersistenceModule } from './infra/repositories/user-persistence.module';

@Module({
  imports: [UsersPersistenceModule],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    GetUsersUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class UsersModule {}
