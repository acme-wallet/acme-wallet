import { INestApplication } from "@nestjs/common"
import { MemoryDBRepository } from "src/users/infra/repositories/memory-db.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { IUserRepository } from "src/users/domain/repositories/user.repository";
import request from 'supertest';
import { UsersModule } from "src/users/users.module";
import { MockProxy, mock } from "vitest-mock-extended";

describe('UserController (Integration)', () => {
    let app: INestApplication;
    let userRepository: MockProxy<IUserRepository>;

    beforeAll(async () => {
        userRepository = mock<IUserRepository>();
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UsersModule]
        })
            .overrideProvider(IUserRepository)
            .useValue(userRepository)
            .compile()

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('/users (POST) - should create a user', async () => {
        const payload = { name: 'Leandro Amaral', email: 'leandro@email.org.br' }
        // userRepository.create.mockResolvedValue({
        //     id: 'uuid-123',
        //     ...payload
        // });

        const response = await request(app.getHttpServer())
            .post('/users')
            .send(payload)

        expect(response.status).toBe(201)
        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(String)
        }));
    })

    it('/users (POST) - should return 400 if email is invalid', async () => {
        const payload = { name: 'John', email: 'email-invalido' }
        const response = await request(app.getHttpServer())
            .post('/users')
            .send(payload);

        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                message: "Validation failed",
                errors: expect.arrayContaining([
                    expect.objectContaining({
                        path: ['email'],
                        message: "E-mail inválido"
                    })
                ])
            })
        );
    });

    afterAll(async () => {
        await app.close();
    })
})
