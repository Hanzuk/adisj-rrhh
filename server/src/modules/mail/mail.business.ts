import { MailRepository } from './mail.repository';

export class LoginBusiness {
  constructor(private repository: MailRepository = new MailRepository()) {}

  async userInfo(id: number): Promise<{ nombre: string; correo: string; clave: string }> {
    const data = await this.repository.userInfo(id);
    return { nombre: data.nombre, correo: data.correo, clave: '' };
  }
}
