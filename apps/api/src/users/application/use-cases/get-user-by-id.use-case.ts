import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { GetUserByIdInput, GetUserByIdOutput } from '@repo/schemas';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

@Injectable()
export default class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetUserByIdInput): Promise<GetUserByIdOutput> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new UserNotFoundException(input.id);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
