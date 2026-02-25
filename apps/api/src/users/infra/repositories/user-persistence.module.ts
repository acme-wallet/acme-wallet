import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserPrismaRepository } from './user-prisma.repository';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    UserPrismaRepository,
    { provide: IUserRepository, useExisting: UserPrismaRepository },
  ],
  exports: [IUserRepository],
})
export class UsersPersistenceModule {}
