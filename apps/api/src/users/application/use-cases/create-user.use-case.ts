import { Injectable } from '@nestjs/common';
import { CreateUserInput, CreateUserOutput } from '@repo/schemas';
import { IUseCase } from 'src/common/use-case.interface';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export default class CreateUserUseCase implements IUseCase<
  CreateUserInput,
  CreateUserOutput
> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const user = User.create(input.name, input.email);

    await this.userRepository.create(user);

    return {
      id: user.id,
    };
  }
}
