import { Injectable } from '@nestjs/common';
import { DeleteUserInput, DeleteUserOutput } from '@repo/schemas';
import { IUseCase } from '../../../common/use-case.interface';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { IUserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export default class DeleteUserUseCase implements IUseCase<
  DeleteUserInput,
  DeleteUserOutput
> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: DeleteUserInput): Promise<DeleteUserOutput> {
    const userExists = await this.userRepository.findById(input.id);

    if (!userExists) {
      throw new UserNotFoundException(input.id);
    }

    await this.userRepository.delete(input.id);
  }
}
