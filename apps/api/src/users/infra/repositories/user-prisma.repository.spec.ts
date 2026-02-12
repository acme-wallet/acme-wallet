import { Test } from "@nestjs/testing";
import { PrismaClient } from "@repo/db";
import { DeepMockProxy, mockDeep } from "vitest-mock-extended";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "src/users/domain/entities/user.entity";
import { UserPrismaRepository } from "src/users/infra/repositories/user-prisma.repository";

describe("UserPrismaRepository", () => {
  let repo: UserPrismaRepository;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserPrismaRepository,
        {
          provide: PrismaService,
          useValue: { prisma: prismaMock },
        },
      ],
    })
      .compile();

    repo = moduleRef.get(UserPrismaRepository);
  });

  it("saves a user and returns id", async () => {
    const input = new User("Ana", "ana@acme.com");

    prismaMock.user.create.mockResolvedValue({
      id: "u1",
      name: input.name,
      email: input.email,
      createdAt: new Date(),
    });
    const output = await repo.create(input);

    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: input.name,
        email: input.email,
      }),
    });

    expect(output).toEqual({ id: "u1" });
  });
});
