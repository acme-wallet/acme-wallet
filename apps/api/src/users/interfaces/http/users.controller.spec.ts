import { INestApplication } from "@nestjs/common"
import { MemoryDBRepository } from "src/users/infra/repositories/memory-db.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { IUserRepository } from "src/users/domain/repositories/user.repository";
import request from 'supertest';
import { UsersModule } from "src/users/users.module";

describe('UserController (Integration)', () => {
    let app: INestApplication;
    let userRepository: MemoryDBRepository;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UsersModule]
        })
        .overrideProvider(IUserRepository)
        .useClass(MemoryDBRepository)
        .compile()

        app = moduleFixture.createNestApplication();
        await app.init();

        userRepository = moduleFixture.get<MemoryDBRepository>(IUserRepository);
    });

    it('/users (POST) - should create a user', async () => {
        const payload = { name: 'Leandro Amaral', email: 'leandro.amaral@conecthus.org.br' }
        const response = await  request(app.getHttpServer())
            .post('/users')
            .send(payload)
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(userRepository.items.length).toBe(1)
    })

    it('/users (POST) - should return 400 if email is invalid', async () => {
    const response = await (request as any)(app.getHttpServer())
        .post('/users')
        .send({
        name: 'Jo',
        email: 'email-invalido',
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBeDefined(); 
    });

    afterAll(async () => {
        await app.close();
    })
})
