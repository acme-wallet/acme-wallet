import { Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/entities/user.entity';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: User): Promise<void> {
    await this.prismaService.prisma.user.create({
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
      },
    });
  }

  async findAll(filter?: {
    name?: string;
    email?: string;
    id?: string;
  }): Promise<User[]> {
    const users = await this.prismaService.prisma.user.findMany({
      where: {
        name: {
          contains: filter?.name,
        },
        email: {
          contains: filter?.email,
        },
        id: {
          equals: filter?.id,
        },
      },
    });

    return users.map((user) =>
      User.restore(user.id, user.name, user.email, user.createdAt),
    );
  }
}
