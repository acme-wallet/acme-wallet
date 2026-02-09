import { MemoryDBRepository } from "src/users/infra/repositories/memory-db.repository";
import CreateUserUseCase from "./create-user.use-case";

describe('Create User Use Case', () => {
    it('should be able to create a new user and return this id', async () => {
        // Preparação (Arrange)
        const userRepository = new MemoryDBRepository();
        const sut = new CreateUserUseCase(userRepository);

        // Execução (Act)
        const result = await sut.execute('Leandro Amaral', 'leandro.amaral@conecthus.org.br');

        // Verificação (Assert)
        expect(userRepository.items.length).toBe(1);
        expect(userRepository.items[0].name).toBe('Leandro Amaral');
    })
})
