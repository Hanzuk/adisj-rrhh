import DB from '../../database/database';
import { ILogin } from './login.model';

export class LoginRepository {
  async login(email: string): Promise<ILogin> {
    const result = await DB.query(
      'SELECT id, correo, clave, tipo_empleado FROM empleados WHERE correo = ?',
      [email]
    );

    return {
      id: result[0].id,
      email: result[0].correo,
      password: result[0].clave,
      rol: result[0].tipo_empleado,
    };
  }
}
