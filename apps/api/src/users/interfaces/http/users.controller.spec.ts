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

  const mockUser = new User('Leandro', 'leandro@email.com', '123');

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

  /**
   * Helper para validar resposta de lista de usuários
   */
  function expectValidUserList(body: GetUsersResponse[]) {
    expect(body).toHaveLength(1);
    expect(body[0]).toEqual({
      id: '123',
      name: 'Leandro',
      email: 'leandro@email.com',
    });
  }

  /**
   * Helper para testar filtros de busca
   */
  async function expectFilteredUsers(
    query: string,
    expectedFilter: Parameters<IUserRepository['findAll']>[0],
  ) {
    userRepository.findAll.mockResolvedValue([mockUser]);

    const response = await request(app.getHttpServer() as Server)
      .get(`/users?${query}`)
      .expect(200);

    const body = response.body as GetUsersResponse[];

    expectValidUserList(body);

    expect(userRepository.findAll).toHaveBeenCalledTimes(1);
    expect(userRepository.findAll).toHaveBeenCalledWith(expectedFilter);
  }

  it('/users (POST) - should create a user', async () => {
    const payload = {
      name: 'Leandro Amaral',
      email: 'leandro@email.org.br',
    };

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

  it('/users (POST) - should return 400 if any parameter is invalid', async () => {
    const payload = { name: 'John', email: 'email-invalido' };

    const response = await request(app.getHttpServer() as Server)
      .post('/users')
      .send(payload)
      .set('Accept', 'application/json');

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toBe(400);

    const validationResult = CreateUserResponseSchema.safeParse(response.body);

    expect(validationResult.success).toBe(false);
  });

  it('/users (GET) - should return a list of users', async () => {
    userRepository.findAll.mockResolvedValue([mockUser]);

    const response = await request(app.getHttpServer() as Server)
      .get('/users')
      .expect(200);

    const body = response.body as GetUsersResponse[];

    expectValidUserList(body);

    expect(userRepository.findAll).toHaveBeenCalledTimes(1);
    expect(userRepository.findAll).toHaveBeenCalledWith({
      name: undefined,
      email: undefined,
      id: undefined,
    });
  });

  it('should return filtered users by name', async () => {
    await expectFilteredUsers('name=Leandro', {
      name: 'Leandro',
      email: undefined,
      id: undefined,
    });
  });

  it('should return filtered users by email', async () => {
    await expectFilteredUsers('email=leandro@email.com', {
      name: undefined,
      email: 'leandro@email.com',
      id: undefined,
    });
  });

  it('should return filtered users by id', async () => {
    await expectFilteredUsers('id=123', {
      name: undefined,
      email: undefined,
      id: '123',
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
