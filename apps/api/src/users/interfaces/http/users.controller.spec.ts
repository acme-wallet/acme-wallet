import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';
import request from 'supertest';
import { UsersModule } from 'src/users/users.module';
import { MockProxy, mock } from 'vitest-mock-extended';
import { CreateUserResponseSchema, CreateUserOutput } from '@repo/schemas';
import { Server } from 'http';

describe('UserController (Integration)', () => {
  let app: INestApplication;
  let userRepository: MockProxy<IUserRepository>;

  beforeAll(async () => {
    userRepository = mock<IUserRepository>();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(IUserRepository)
      .useValue(userRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('/users (POST) - should create a user', async () => {
    const payload = { name: 'Leandro Amaral', email: 'leandro@email.org.br' };

    const response = await request(app.getHttpServer() as Server)
      .post('/users')
      .send(payload)
      .set('Accept', 'application/json');

    const validatedUserSchema: CreateUserOutput =
      CreateUserResponseSchema.parse(response.body);

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toBe(201);
    expect(validatedUserSchema.id).toBeDefined();
  });

  it('/users (POST) - should return 400 if any parâmeter is invalid', async () => {
    const payload = { name: 'John', email: 'email-invalido' };

    const response = await request(app.getHttpServer() as Server)
      .post('/users')
      .send(payload)
      .set('Accept', 'application/json');

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toBe(400);

    const validationResult = CreateUserResponseSchema.safeParse(response.body);

    expect(validationResult.success).toBe(false);
    expect(validationResult.error).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
