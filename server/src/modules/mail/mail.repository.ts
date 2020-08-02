import DB from '../../database/database';

export class MailRepository {
  async userInfo(id: number): Promise<{ nombre: string; correo: string; clave: string }> {
    const result = await DB.query('SELECT nombre, correo, clave FROM empleados WHERE id = ?', [id]);

    return result[0];
  }
}
