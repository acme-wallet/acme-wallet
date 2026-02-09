import { User } from "../entities/user.entity";

export default interface IUserRepository {
    save(user: User): Promise<string>;
}
