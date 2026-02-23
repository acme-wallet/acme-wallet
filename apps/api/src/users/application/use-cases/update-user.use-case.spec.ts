import UpdateUserUseCase from './update-user.use-case';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { mock, MockProxy } from 'vitest-mock-extended';

describe('Update User Use Case', () => {
  let userRepository: MockProxy<IUserRepository>;
  let sut: UpdateUserUseCase;

  beforeEach(() => {
    userRepository = mock<IUserRepository>();
    sut = new UpdateUserUseCase(userRepository);
  });

  it('should be able to update a user', async () => {
    const user = User.create('Leandro', 'leandro@email.com');
    userRepository.findById.mockResolvedValue(user);

    const result = await sut.execute({ id: user.id, name: 'Updated Name' });

    expect(result.id).toBe(user.id);
    expect(userRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        _name: 'Updated Name',
        _email: 'leandro@email.com',
      }),
    );
  });

  it('should throw error if user not found', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(
      sut.execute({ id: 'invalid-id', name: 'New Name' }),
    ).rejects.toThrow('User not found');
  });
});
