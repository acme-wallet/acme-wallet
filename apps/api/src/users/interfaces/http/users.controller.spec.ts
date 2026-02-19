import { INestApplication } from '@nestjs/common';
import { GetUsersResponse } from 'src/users/interfaces/dto/user/get-users.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';
import request from 'supertest';
import { UsersModule } from 'src/users/users.module';
import { MockProxy, mock } from 'vitest-mock-extended';
import { CreateUserResponseSchema, CreateUserOutput } from '@repo/schemas';
import { Server } from 'http';
import { User } from 'src/users/domain/entities/user.entity';

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

  it('/users (GET) - should return a list of users', async () => {
    const user = new User('Leandro', 'leandro@email.com', '123');
    userRepository.findAll.mockResolvedValue([user]);

    const response = await request(app.getHttpServer() as Server)
      .get('/users')
      .expect(200);

    const body = response.body as GetUsersResponse[];

    expect(body).toHaveLength(1);
    expect(body[0]).toEqual({
      id: '123',
      name: 'Leandro',
      email: 'leandro@email.com',
    });
    expect(userRepository.findAll).toHaveBeenCalledWith(undefined);
  });

  it('/users (GET) - should return filtered users', async () => {
    const user = new User('Leandro', 'leandro@email.com', '123');
    userRepository.findAll.mockResolvedValue([user]);

    const response = await request(app.getHttpServer() as Server)
      .get('/users?name=Leandro')
      .expect(200);

    const body = response.body as GetUsersResponse[];

    expect(body).toHaveLength(1);
    expect(body[0]).toEqual({
      id: '123',
      name: 'Leandro',
      email: 'leandro@email.com',
    });
    expect(userRepository.findAll).toHaveBeenCalledWith('Leandro');
  });

  afterAll(async () => {
    await app.close();
  });
});
