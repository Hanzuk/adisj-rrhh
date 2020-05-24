import { ILogin } from './login.model';
import { LoginRepository } from './login.repository';

export class LoginBusiness {
  constructor(private repository: LoginRepository = new LoginRepository()) {}

  async login(email: string): Promise<ILogin> {
    const credentials = await this.repository.login(email);
    return credentials;
  }
}
