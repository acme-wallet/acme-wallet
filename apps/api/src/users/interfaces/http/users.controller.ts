import { Controller, Post, Body, UsePipes, Get, Query } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import CreateUserUseCase from 'src/users/application/use-cases/create-user.use-case';
import {
  CreateUserRequest,
  CreateUserResponse,
} from '../dto/user/create-user.dto';
import GetUsersUseCase from 'src/users/application/use-cases/get-users.use-case';
import { GetUsersResponse } from '../dto/user/get-users.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUseCase: CreateUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
  ) { }

  @Post()
  @UsePipes(ZodValidationPipe)
  create(@Body() body: CreateUserRequest): Promise<CreateUserResponse> {
    const input = {
      name: body.name,
      email: body.email,
    };
    return this.createUseCase.execute(input);
  }

  @Get()
  async findAll(@Query('name') name?: string): Promise<GetUsersResponse[]> {
    const users = await this.getUsersUseCase.execute({ name });
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
  }
}
