import { Login } from './login.interface';
import { LoginRepository } from './login.repository';

export class LoginBusiness {
  constructor(private repository: LoginRepository = new LoginRepository()) {}

  async login(email: string): Promise<Login> {
    return await this.repository.login(email);
  }
}
