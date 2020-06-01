import DB from '../../database/database';
import { Overtime } from './overtime.model';

export class OvertimeRepository {
  async create(overtime: Overtime) {
    await DB.query('INSERT INTO horas_extras SET ?', overtime);
  }

  async findAll(): Promise<Overtime[]> {
    const result = await DB.query(
      'SELECT id, id_empleado, id_estado, cantidad_horas, descripcion, fecha, activo FROM horas_extras',
      ''
    );

    return [...result];
  }

  async onlyAdminUpdate(overtimeId: number, overtime: Overtime) {
    await DB.query('UPDATE horas_extras SET ? WHERE id = ?;', [
      overtime,
      overtimeId,
    ]);
  }

  async allUpdate(overtimeId: number, overtime: Overtime) {
    await DB.query('UPDATE horas_extras SET ? WHERE id = ?;', [
      overtime,
      overtimeId,
    ]);
  }
}
