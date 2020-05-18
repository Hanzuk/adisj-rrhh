import { User } from './users.model';
import { UsersRepository } from './users.repository';
import { IUsersCrendentials } from './interfaces/users.credentials';

export class UsersBusiness {
  constructor(private repository: UsersRepository = new UsersRepository()) {}

  async login(user: User): Promise<IUsersCrendentials> {
    const registryUser = await this.repository.login(user);
    return registryUser;
  }

  async create(user: User): Promise<User> {
    const newUser = await this.repository.create(user);
    return newUser;
  }
}
