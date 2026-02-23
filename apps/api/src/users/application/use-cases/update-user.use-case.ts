<<<<<<< HEAD
import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { UpdateUserInput, UpdateUserOutput } from '@repo/schemas';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export default class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) { }
=======
import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { UpdateUserInput, UpdateUserOutput } from '@repo/schemas';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

@Injectable()
export default class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
>>>>>>> ad34af1 (fix(users): refactor CRUD endpoints)

  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    const userExists = await this.userRepository.findById(input.id);

    if (!userExists) {
<<<<<<< HEAD
      throw new NotFoundException('User not found');
=======
      throw new UserNotFoundException(input.id);
>>>>>>> ad34af1 (fix(users): refactor CRUD endpoints)
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
