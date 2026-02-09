import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import CreateUserUseCase from '../application/use-cases/create-user.use-case';

@Controller('users')
export class UsersController {
  constructor(private readonly createUseCase: CreateUserUseCase) {}

  @Post()
  create(@Body() body: { name: string, email: string }) {
    return this.createUseCase.execute(body.name, body.email);
  }

}
