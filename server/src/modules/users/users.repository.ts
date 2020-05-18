import DB from '../../database/database';
import { User } from './users.model';
import { IUsersCrendentials } from './interfaces/users.credentials';

export class UsersRepository {
  async login(user: User): Promise<IUsersCrendentials> {
    const result = await DB.query(
      'SELECT email, password FROM users WHERE email = ?',
      [user.email]
    );
    return {
      email: result[0].email,
      password: result[0].password,
      typeEmployee: 'chofer',
    };
  }

  async create(user: User): Promise<User> {
    await DB.query('INSERT INTO users SET ?', {
      email: user.email,
      password: user.password,
    });
    return user;
  }
}
