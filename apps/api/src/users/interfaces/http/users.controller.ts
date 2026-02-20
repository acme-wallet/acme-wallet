import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import CreateUserUseCase from 'src/users/application/use-cases/create-user.use-case';
import {
  CreateUserRequest,
  CreateUserResponse,
} from '../dto/user/create-user.dto';
import GetUsersUseCase from 'src/users/application/use-cases/get-users.use-case';
import { GetUsersRequest, GetUsersResponse } from '../dto/user/get-users.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUseCase: CreateUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
  ) {}

  @Post()
  create(@Body() body: CreateUserRequest): Promise<CreateUserResponse> {
    const input = {
      name: body.name,
      email: body.email,
    };
    return this.createUseCase.execute(input);
  }

  @Get()
  async findAll(@Query() query: GetUsersRequest): Promise<GetUsersResponse[]> {
    const users = await this.getUsersUseCase.execute(query);
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
  }
}
