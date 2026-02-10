import { randomUUID } from "crypto";
import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "src/users/domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class CreateUserUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(input: Input): Promise<Output> {
        const id = randomUUID();
        const user = new User(input.name, input.email, id);

        await this.userRepository.create(user);

        return {
            id: user.id,
        }
    }
}

type Input = {
    name: string;
    email: string;
}

type Output = {
    id: string;
}
