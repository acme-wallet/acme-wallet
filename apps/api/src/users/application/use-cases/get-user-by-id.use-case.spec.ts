import GetUserByIdUseCase from './get-user-by-id.use-case';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { mock, MockProxy } from 'vitest-mock-extended';

describe('Get User By Id Use Case', () => {
  let userRepository: MockProxy<IUserRepository>;
  let sut: GetUserByIdUseCase;

  beforeEach(() => {
    userRepository = mock<IUserRepository>();
    sut = new GetUserByIdUseCase(userRepository);
  });

  it('should be able to get a user by id', async () => {
    const user = User.create('Leandro', 'leandro@email.com');
    userRepository.findById.mockResolvedValue(user);

    const result = await sut.execute({ id: user.id });

    expect(result.id).toBe(user.id);
    expect(result.name).toBe('Leandro');
    expect(userRepository.findById).toHaveBeenCalledWith(user.id);
  });

  it('should throw error if user not found', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(sut.execute({ id: 'invalid-id' })).rejects.toThrow(
      'User not found',
    );
  });
});
