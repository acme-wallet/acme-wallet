import DeleteUserUseCase from './delete-user.use-case';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { mock, MockProxy } from 'vitest-mock-extended';

describe('Delete User Use Case', () => {
  let userRepository: MockProxy<IUserRepository>;
  let sut: DeleteUserUseCase;

  beforeEach(() => {
    userRepository = mock<IUserRepository>();
    sut = new DeleteUserUseCase(userRepository);
  });

  it('should be able to delete a user', async () => {
    const user = User.create('Leandro', 'leandro@email.com');
    userRepository.findById.mockResolvedValue(user);

    await sut.execute({ id: user.id });

    expect(userRepository.delete).toHaveBeenCalledWith(user.id);
  });

  it('should throw error if user not found', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(sut.execute({ id: 'invalid-id' })).rejects.toThrow(
      'User with id "invalid-id" not found',
    );
  });
});
