import DB from '../../database/database';
import { Login } from './login.interface';

export class LoginRepository {
  async login(email: string): Promise<Login> {
    const result = await DB.query(
      'SELECT id, correo, clave, tipo_empleado FROM empleados WHERE correo = ?',
      [email]
    );

    return result[0];
  }
}
