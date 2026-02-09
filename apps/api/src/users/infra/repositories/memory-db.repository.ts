import { User } from "src/users/domain/entities/user.entity";
import { IUserRepository } from "src/users/domain/repositories/user.repository";

export class MemoryDBRepository implements IUserRepository {
    public items: User[] = [];

    async save(user: User): Promise<{ id: string }> {
        this.items.push(user);
        return {
            id: user.id,
        };
    }
}
