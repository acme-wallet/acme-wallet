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

  findAll(filter?: {
    name?: string;
    email?: string;
    id?: string;
  }): Promise<User[]> {
    let users = this.items;

    if (filter?.name) {
      users = users.filter((item) => item.name.includes(filter.name as string));
    }

    if (filter?.email) {
      users = users.filter((item) =>
        item.email.includes(filter.email as string),
      );
    }

    if (filter?.id) {
      users = users.filter((item) => item.id === filter.id);
    }

    return Promise.resolve(users);
  }
}
