import { User } from '../entities/user.entity';

export abstract class IUserRepository {
  abstract create(data: User): Promise<void>;
  abstract findAll(filter?: {
    name?: string;
    email?: string;
    id?: string;
  }): Promise<User[]>;
  abstract findById(id: string): Promise<User | null>;
  abstract update(user: User): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
