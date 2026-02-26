import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import CreateUserUseCase from 'src/users/application/use-cases/create-user.use-case';
import DeleteUserUseCase from 'src/users/application/use-cases/delete-user.use-case';
import GetUserByIdUseCase from 'src/users/application/use-cases/get-user-by-id.use-case';
import GetUsersUseCase from 'src/users/application/use-cases/get-users.use-case';
import UpdateUserUseCase from 'src/users/application/use-cases/update-user.use-case';
import {
  CreateUserRequest,
  CreateUserResponse,
} from '../dto/user/create-user.dto';
import { GetUserByIdResponse } from '../dto/user/get-user-by-id.dto';
import { GetUsersRequest, GetUsersResponse } from '../dto/user/get-users.dto';
import {
  UpdateUserRequest,
  UpdateUserResponse,
} from '../dto/user/update-user.dto';

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
    return this.getUsersUseCase.execute(query);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GetUserByIdResponse> {
    return this.getUserByIdUseCase.execute({ id });
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserRequest,
  ): Promise<UpdateUserResponse> {
    return this.updateUserUseCase.execute({ ...body, id });
  }

  // DO NOT delete a user, just for demonstration purposes.
  // In a real application, you might want to implement soft deletes.
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deleteUserUseCase.execute({ id });
  }
}
