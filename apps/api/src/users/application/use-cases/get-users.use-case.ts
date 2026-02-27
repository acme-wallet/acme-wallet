import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/use-case.interface';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';
import {
  GetUsersInputDto,
  GetUsersOutputDto,
} from 'src/users/interfaces/dto/user/get-users.dto';

@Injectable()
export class GetUsersUseCase implements IUseCase<
  GetUsersInputDto,
  GetUsersOutputDto[]
> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetUsersInputDto): Promise<GetUsersOutputDto[]> {
    const users = await this.userRepository.findAll(input);

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
  }
}
