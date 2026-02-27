import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/use-case.interface';
import { UserNotFoundException } from 'src/users/domain/exceptions/user-not-found.exception';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';
import {
  GetUserByIdInputDto,
  GetUserByIdOutputDto,
} from 'src/users/interfaces/dto/user/get-user-by-id.dto';

@Injectable()
export class GetUserByIdUseCase implements IUseCase<
  GetUserByIdInputDto,
  GetUserByIdOutputDto
> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetUserByIdInputDto): Promise<GetUserByIdOutputDto> {
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
