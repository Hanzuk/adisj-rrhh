import DB from '../../database/database';
import { Overtime } from './overtime.model';

export class OvertimeRepository {
  async create(overtime: Overtime) {
    await DB.query('INSERT INTO horas_extras SET ?', overtime);
  }

  async findAll(): Promise<Overtime[]> {
    const result = await DB.query(
      `SELECT he.id
        , he.id_estado
        , he.id_empleado
        , he.cantidad_horas
        , he.descripcion
        , he.fecha
        , he.activo
        , CONCAT(e.nombre, ' ', e.p_apellido) as empleado
      FROM horas_extras he
      INNER JOIN empleados e ON e.id = he.id_empleado
      WHERE he.activo = 1`,
      ''
    );

    return [...result];
  }

  async onlyAdminUpdate(overtimeId: number, overtime: Overtime) {
    await DB.query('UPDATE horas_extras SET ? WHERE id = ?;', [overtime, overtimeId]);
  }

  async allUpdate(overtimeId: number, overtime: Overtime) {
    await DB.query('UPDATE horas_extras SET ? WHERE id = ?;', [overtime, overtimeId]);
  }
}
