import { Injectable } from '@nestjs/common';
import { UpdateUserInput, UpdateUserOutput } from '@repo/schemas';
import { IUseCase } from '../../../common/use-case.interface';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { IUserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export default class UpdateUserUseCase implements IUseCase<
  UpdateUserInput,
  UpdateUserOutput
> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    const userExists = await this.userRepository.findById(input.id);

    if (!userExists) {
      throw new UserNotFoundException(input.id);
    }

    const user = User.restore(
      userExists.id,
      input.name ?? userExists.name,
      input.email ?? userExists.email,
      userExists.createdAt,
    );

    await this.userRepository.update(user);

    return {
      id: user.id,
    };
  }
}
