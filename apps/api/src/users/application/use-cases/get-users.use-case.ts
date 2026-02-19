import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export default class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: { name?: string }): Promise<User[]> {
    return this.userRepository.findAll(input.name);
  }
}
