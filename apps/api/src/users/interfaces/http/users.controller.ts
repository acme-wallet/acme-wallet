import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import CreateUserUseCase from 'src/users/application/use-cases/create-user.use-case';
import { CreateUserDto } from '../dto/user/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly createUseCase: CreateUserUseCase) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  create(@Body() body: CreateUserDto) {
    return this.createUseCase.execute(body.name, body.email);
  }

}
