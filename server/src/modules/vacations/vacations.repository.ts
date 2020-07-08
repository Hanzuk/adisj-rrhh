import { Vacation, AvailableVacations } from './vacation.model';
import DB from '../../database/database';

export class VacationsRepository {
  public async insertRequest(request: Vacation): Promise<void> {
    await DB.query('INSERT INTO vacaciones SET ?', request);
  }

  public async getAvailableDays(userId: number): Promise<AvailableVacations> {
    const result = await DB.query(
      'SELECT id, id_empleado, cantidad FROM vacaciones_disponibles WHERE id_empleado = ? AND activo = 1;',
      userId
    );
    return { ...result[0] };
  }

  public async updateAvailableDays(newAvailableDays: AvailableVacations): Promise<void> {
    await DB.query('UPDATE vacaciones_disponibles SET ? WHERE id = ?;', [
      { cantidad: newAvailableDays.cantidad },
      newAvailableDays.id,
    ]);
  }

  public async getRequests() {
    const result = await DB.query(
      `SELECT v.id, v.fecha_salida, v.fecha_entrada, v.cantidad, e.nombre, e.p_apellido, e.s_apellido
      FROM vacaciones v
      INNER JOIN empleados e
      ON v.id_empleado = e.id`,
      ''
    );
    return [...result];
  }
}
