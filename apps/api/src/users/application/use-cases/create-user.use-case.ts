import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/use-case.interface';
import { User } from 'src/users/domain/entities/user.entity';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';
import {
  CreateUserInputDto,
  CreateUserOutputDto,
} from 'src/users/interfaces/dto/user/create-user.dto';

@Injectable()
export class CreateUserUseCase implements IUseCase<
  CreateUserInputDto,
  CreateUserOutputDto
> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: CreateUserInputDto): Promise<CreateUserOutputDto> {
    const user = User.create(input.name, input.email);

    await this.userRepository.create(user);

    return {
      id: user.id,
    };
  }
}
