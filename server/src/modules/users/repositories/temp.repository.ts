import DB from '../../../database/database';

export class TempRepository {
  async create(userId: number, departure: Date, description: string) {
    await DB.query('INSERT INTO empleados_temporales SET ?;', {
      id_empleado: userId,
      fecha_salida: departure,
      descripcion: description,
    });

    await DB.query('INSERT INTO contratos_empleados_temporales SET ?;', {
      id_empleado: userId,
      fecha_contrato: new Date(),
      fecha_salida: departure,
      descripcion: description,
    });
  }

  async info(userId: number) {
    const tempInfo = await DB.query(
      `SELECT et.fecha_salida, et.descripcion
      FROM empleados e
      INNER JOIN empleados_temporales et
      ON e.id = et.id_empleado
      WHERE e.id = ?;`,
      [userId]
    );

    return tempInfo[0];
  }
}
