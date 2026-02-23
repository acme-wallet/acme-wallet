import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { DeleteUserInput, DeleteUserOutput } from '@repo/schemas';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

@Injectable()
export default class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: DeleteUserInput): Promise<DeleteUserOutput> {
    const userExists = await this.userRepository.findById(input.id);

    if (!userExists) {
      throw new UserNotFoundException(input.id);
    }

    await this.userRepository.delete(input.id);
  }
}
