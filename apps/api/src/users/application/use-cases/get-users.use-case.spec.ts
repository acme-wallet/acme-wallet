import GetUsersUseCase from './get-users.use-case';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { mock, MockProxy } from 'vitest-mock-extended';

describe('Get Users Use Case', () => {
  let userRepository: MockProxy<IUserRepository>;
  let sut: GetUsersUseCase;
  let users: User[];

  beforeEach(() => {
    userRepository = mock<IUserRepository>();
    sut = new GetUsersUseCase(userRepository);
    users = [User.create('Leandro', 'leandro@email.com')];
  });

  it('should be able to get all users', async () => {
    userRepository.findAll.mockResolvedValue(users);

    const result = await sut.execute({});

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Leandro');
    expect(userRepository.findAll).toHaveBeenCalledWith({});
    expect(userRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['name', 'Leandro'],
    ['email', 'leandro@email.com'],
  ])('should be able to get users by %s', async (field, value) => {
    userRepository.findAll.mockResolvedValue(users);

    const result = await sut.execute({ [field]: value });

    expect(result).toHaveLength(1);
    expect(result[0][field]).toBe(value);
  });
});
