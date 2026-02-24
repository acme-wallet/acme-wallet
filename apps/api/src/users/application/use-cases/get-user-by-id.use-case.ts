<<<<<<< HEAD
import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { GetUserByIdInput, GetUserByIdOutput } from '@repo/schemas';

@Injectable()
export default class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) { }
=======
import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { GetUserByIdInput, GetUserByIdOutput } from '@repo/schemas';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

@Injectable()
export default class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
>>>>>>> ad34af1 (fix(users): refactor CRUD endpoints)

  async execute(input: GetUserByIdInput): Promise<GetUserByIdOutput> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
<<<<<<< HEAD
      throw new NotFoundException('User not found');
=======
      throw new UserNotFoundException(input.id);
>>>>>>> ad34af1 (fix(users): refactor CRUD endpoints)
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
