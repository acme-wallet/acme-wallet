import CreateUserUseCase from './create-user.use-case';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';
import { mock, MockProxy } from 'vitest-mock-extended';

describe('Create User Use Case', () => {
  let userRepository: MockProxy<IUserRepository>;
  let sut: CreateUserUseCase;

  beforeEach(() => {
    userRepository = mock<IUserRepository>();
    sut = new CreateUserUseCase(userRepository);
  });

  it('should be able to create a new user and return its id', async () => {
    userRepository.create.mockResolvedValue(undefined);

    const input = {
      name: 'Leandro Amaral',
      email: 'leandro@email.org.br',
    };

    const output = await sut.execute(input);

    expect(output).toHaveProperty('id');
    expect(typeof output.id).toBe('string');

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: input.name,
        email: input.email,
      }),
    );

    expect(userRepository.create).toHaveBeenCalledTimes(1);
  });
});
