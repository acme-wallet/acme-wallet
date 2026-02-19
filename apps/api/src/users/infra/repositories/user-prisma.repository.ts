import { Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/entities/user.entity';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: User): Promise<{ id: string }> {
    const output = await this.prismaService.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

    return {
      id: output.id,
    };
  }

  async findAll(name?: string): Promise<User[]> {
    const users = await this.prismaService.prisma.user.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });

    return users.map((user) => new User(user.name, user.email, user.id));
  }
}
