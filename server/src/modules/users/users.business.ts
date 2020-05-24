import { User, TemporaryUser } from './users.model';
import { UsersRepository } from './users.repository';

export class UsersBusiness {
  constructor(private repository: UsersRepository = new UsersRepository()) {}

  async create(user: User | TemporaryUser): Promise<void> {
    if (user instanceof TemporaryUser) {
      await this.repository.createTemporary(user);
      return;
    }

    await this.repository.create(user);
  }
}
