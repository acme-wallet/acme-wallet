import { Test } from "@nestjs/testing";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "src/users/domain/entities/user.entity";
import { UserPrismaRepository } from "src/users/infra/repositories/user-prisma.repository";

describe("UserPrismaRepository", () => {
  let repo: UserPrismaRepository;

  const prismaMock = {
    prisma: {
      user: {
        create: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserPrismaRepository,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    })
      .compile();

    repo = moduleRef.get(UserPrismaRepository);
  });

  it("saves a user and returns id", async () => {
    prismaMock.prisma.user.create.mockResolvedValue({ id: "u1" });

    const input = new User("Ana", "ana@acme.com");
    const output = await repo.create(input);

    expect(prismaMock.prisma.user.create).toHaveBeenCalledWith({
      data: { id: input.id, name: "Ana", email: "ana@acme.com" },
    });
    expect(output).toEqual({ id: "u1" });
  });
});
