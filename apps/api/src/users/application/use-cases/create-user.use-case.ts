import { randomUUID } from 'node:crypto';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { CreateUserInput, CreateUserOutput } from '@repo/schemas';

@Injectable()
export default class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const id = randomUUID();
    const user = new User(input.name, input.email, id);

    await this.userRepository.create(user);

    return {
      id: user.id,
    };
  }
}
