import { User } from 'src/users/domain/entities/user.entity';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';

export class MemoryDBRepository implements IUserRepository {
  public items: User[] = [];

  create(user: User): Promise<{ id: string }> {
    this.items.push(user);
    return Promise.resolve({
      id: user.id,
    });
  }

  findAll(name?: string): Promise<User[]> {
    if (name) {
      return Promise.resolve(this.items.filter((item) => item.name === name));
    }
    return Promise.resolve(this.items);
  }
}
