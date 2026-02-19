import GetUsersUseCase from './get-users.use-case';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { mock, MockProxy } from 'vitest-mock-extended';

describe('Get Users Use Case', () => {
  let userRepository: MockProxy<IUserRepository>;
  let sut: GetUsersUseCase;

  beforeEach(() => {
    userRepository = mock<IUserRepository>();
    sut = new GetUsersUseCase(userRepository);
  });

  it('should be able to get all users', async () => {
    const user = new User('Leandro', 'leandro@email.com');
    userRepository.findAll.mockResolvedValue([user]);

    const result = await sut.execute({});

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Leandro');
    expect(userRepository.findAll).toHaveBeenCalledWith(undefined);
  });

  it('should be able to get users by name', async () => {
    const user = new User('Leandro', 'leandro@email.com');
    userRepository.findAll.mockResolvedValue([user]);

    const result = await sut.execute({ name: 'Leandro' });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Leandro');
    expect(userRepository.findAll).toHaveBeenCalledWith('Leandro');
  });
});
