import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  ParseUUIDPipe,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import CreateUserUseCase from 'src/users/application/use-cases/create-user.use-case';
import {
  CreateUserRequest,
  CreateUserResponse,
} from '../dto/user/create-user.dto';
import GetUsersUseCase from 'src/users/application/use-cases/get-users.use-case';
import { GetUsersRequest, GetUsersResponse } from '../dto/user/get-users.dto';
import GetUserByIdUseCase from '../../application/use-cases/get-user-by-id.use-case';
import UpdateUserUseCase from '../../application/use-cases/update-user.use-case';
import DeleteUserUseCase from '../../application/use-cases/delete-user.use-case';
import {
  UpdateUserRequest,
  UpdateUserResponse,
} from '../dto/user/update-user.dto';
import { GetUserByIdOutput } from '@repo/schemas';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUseCase: CreateUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
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

  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GetUserByIdOutput> {
    return this.getUserByIdUseCase.execute({ id });
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserRequest,
  ): Promise<UpdateUserResponse> {
    return this.updateUserUseCase.execute({ ...body, id });
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deleteUserUseCase.execute({ id });
  }
}
