import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/use-case.interface';
import { UserNotFoundException } from 'src/users/domain/exceptions/user-not-found.exception';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';
import {
  DeleteUserInputDto,
  DeleteUserOutputDto,
} from 'src/users/interfaces/dto/user/delete-user.dto';

@Injectable()
export class DeleteUserUseCase implements IUseCase<
  DeleteUserInputDto,
  DeleteUserOutputDto
> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: DeleteUserInputDto): Promise<DeleteUserOutputDto> {
    const userExists = await this.userRepository.findById(input.id);

    if (!userExists) {
      throw new UserNotFoundException(input.id);
    }

    await this.userRepository.delete(input.id);
  }
}
