import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { GetUsersInput, GetUsersOutput } from '@repo/schemas';

@Injectable()
export default class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetUsersInput): Promise<GetUsersOutput[]> {
    return this.userRepository.findAll(input);
  }
}
