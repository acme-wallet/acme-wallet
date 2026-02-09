import { randomUUID } from "crypto";
import { User } from "../../domain/entities/user.entity";
import IUserRepository from "../../domain/repositories/user.repository";

export default class CreateUserUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(name: string, email: string) {
        const id = randomUUID();
        const user = new User(name, email, id);

        await this.userRepository.save(user);

        return {
            id: user.id,
        }
    }
}
