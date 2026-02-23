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

  async findById(id: string): Promise<User | null> {
    const user = await this.prismaService.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return User.restore(user.id, user.name, user.email, user.createdAt);
  }

  async update(user: User): Promise<void> {
    await this.prismaService.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.prisma.user.delete({
      where: { id },
    });
  }
}
