import { User } from '../entities/user.entity';

export abstract class IUserRepository {
  abstract create(user: User): Promise<{ id: string }>;
  abstract findAll(filter?: {
    name?: string;
    email?: string;
    id?: string;
  }): Promise<User[]>;
}
