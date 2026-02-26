import { Injectable } from '@nestjs/common';
import { GetUsersInput, GetUsersOutput } from '@repo/schemas';
import { IUseCase } from '../../../common/use-case.interface';
import { IUserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export default class GetUsersUseCase implements IUseCase<
  GetUsersInput,
  GetUsersOutput[]
> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetUsersInput): Promise<GetUsersOutput[]> {
    return this.userRepository.findAll(input);
  }
}
