import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/use-case.interface';
import { User } from 'src/users/domain/entities/user.entity';
import { UserNotFoundException } from 'src/users/domain/exceptions/user-not-found.exception';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';
import {
  UpdateUserInputDto,
  UpdateUserOutputDto,
} from 'src/users/interfaces/dto/user/update-user.dto';

@Injectable()
export default class UpdateUserUseCase implements IUseCase<
  UpdateUserInputDto,
  UpdateUserOutputDto
> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UpdateUserInputDto): Promise<UpdateUserOutputDto> {
    const userExists = await this.userRepository.findById(input.id);

    if (!userExists) {
      throw new UserNotFoundException(input.id);
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
