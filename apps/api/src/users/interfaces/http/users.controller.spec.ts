import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { Server } from 'http';
import { mock } from 'vitest-mock-extended';
import { CreateUserUseCase } from 'src/users/application/use-cases/create-user.use-case';
import { GetUsersUseCase } from 'src/users/application/use-cases/get-users.use-case';
import { GetUserByIdUseCase } from 'src/users/application/use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from 'src/users/application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from 'src/users/application/use-cases/delete-user.use-case';
import { UsersController } from './users.controller';
import { ZodValidationPipe } from 'nestjs-zod';

describe('Users HTTP API', () => {
  let app: INestApplication;
  let server: Server;

  const createUseCase = mock<CreateUserUseCase>();
  const getUsersUseCase = mock<GetUsersUseCase>();
  const getUserByIdUseCase = mock<GetUserByIdUseCase>();
  const updateUserUseCase = mock<UpdateUserUseCase>();
  const deleteUserUseCase = mock<DeleteUserUseCase>();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: CreateUserUseCase, useValue: createUseCase },
        { provide: GetUsersUseCase, useValue: getUsersUseCase },
        { provide: GetUserByIdUseCase, useValue: getUserByIdUseCase },
        { provide: UpdateUserUseCase, useValue: updateUserUseCase },
        { provide: DeleteUserUseCase, useValue: deleteUserUseCase },
      ],
    }).compile();

    app = moduleFixture.createNestApplication({ logger: false });
    app.useGlobalPipes(new ZodValidationPipe());
    await app.init();

    server = app.getHttpServer() as Server;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('should return 201 when creating a user', async () => {
      createUseCase.execute.mockResolvedValue({
        id: '1',
      });

      const response = await request(server).post('/users').send({
        name: 'Leandro',
        email: 'leandro@email.com',
      });

      expect(response.status).toBe(201);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toEqual({
        id: '1',
      });
    });

    it('should return 400 when email is invalid', async () => {
      const response = await request(server).post('/users').send({
        name: 'John',
        email: 'email-invalido',
      });

      expect(response.statusCode).toBe(400);
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should return 400 when email is missing', async () => {
      const response = await request(server).post('/users').send({
        name: 'Leandro',
      });

      expect(response.statusCode).toBe(400);
    });

    it('should return 500 if use case throws unexpected error', async () => {
      createUseCase.execute.mockRejectedValue(new Error('Unexpected'));

      const response = await request(server).post('/users').send({
        name: 'Leandro',
        email: 'leandro@email.com',
      });

      expect(response.statusCode).toBe(500);
    });
  });

  describe('GET /users', () => {
    it('should return 200 with a list of users', async () => {
      getUsersUseCase.execute.mockResolvedValue([
        {
          id: '1',
          name: 'Leandro',
          email: 'leandro@email.com',
        },
      ]);

      const response = await request(server).get('/users');

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toEqual([
        {
          id: '1',
          name: 'Leandro',
          email: 'leandro@email.com',
        },
      ]);
    });

    it('should return 200 with an empty list when no users exist', async () => {
      getUsersUseCase.execute.mockResolvedValue([]);

      const response = await request(server).get('/users');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should accept query params', async () => {
      getUsersUseCase.execute.mockResolvedValue([]);

      const response = await request(server).get('/users?name=Leandro');

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 500 if use case throws unexpected error', async () => {
      getUsersUseCase.execute.mockRejectedValue(new Error('Unexpected'));

      const response = await request(server).get('/users');

      expect(response.status).toBe(500);
    });
  });
  describe('GET /users/:id', () => {
    it('should return 200 with a user', async () => {
      const validId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const user = {
        id: validId,
        name: 'Leandro',
        email: 'leandro@email.com',
        createdAt: new Date().toISOString(),
      };
      getUserByIdUseCase.execute.mockResolvedValue(user);

      const response = await request(server).get(`/users/${validId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(user);
    });

    it('should return 400 when id is not a uuid', async () => {
      const response = await request(server).get('/users/invalid-id');
      expect(response.statusCode).toBe(400);
    });
  });

  describe('PUT /users/:id', () => {
    it('should return 200 when updating a user', async () => {
      updateUserUseCase.execute.mockResolvedValue({ id: '1' });

      const response = await request(server)
        .put('/users/00000000-0000-4000-a000-000000000001')
        .send({
          name: 'Updated Name',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ id: '1' });
    });
  });

  describe('DELETE /users/:id', () => {
    it('should return 200 when deleting a user', async () => {
      deleteUserUseCase.execute.mockResolvedValue(undefined);

      const response = await request(server).delete(
        '/users/00000000-0000-4000-a000-000000000001',
      );

      expect(response.statusCode).toBe(200);
    });
  });
});
