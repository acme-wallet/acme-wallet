import { User } from '../entities/user.entity';

export abstract class IUserRepository {
  abstract create(data: User): Promise<void>;
  abstract findAll(filter?: {
    name?: string;
    email?: string;
    id?: string;
  }): Promise<User[]>;
}
