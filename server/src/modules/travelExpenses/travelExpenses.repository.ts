import DB from '../../database/database';

export class TravelExpensesRepository {
  public async insertTravelExpense(travelEx: { id_empleado: number; motivo: string; monto: number }) {
    await DB.query('INSERT INTO viaticos SET ?', travelEx);
  }

  // public async getAvailableDays(userId: number) {
  //   const result = await DB.query(
  //     'SELECT id, id_empleado, cantidad FROM vacaciones_disponibles WHERE id_empleado = ? AND activo = 1;',
  //     userId
  //   );
  //   return { ...result[0] };
  // }

  // public async updateAvailableDays(newAvailableDays: AvailableVacations) {
  //   await DB.query('UPDATE vacaciones_disponibles SET ? WHERE id = ?;', [
  //     { cantidad: newAvailableDays.cantidad },
  //     newAvailableDays.id,
  //   ]);
  // }

  // public async getRequests() {
  //   const result = await DB.query(
  //     `SELECT v.id, v.fecha_salida, v.fecha_entrada, v.cantidad, e.nombre, e.p_apellido, e.s_apellido
  //     FROM vacaciones v
  //     INNER JOIN empleados e
  //     ON v.id_empleado = e.id`,
  //     ''
  //   );
  //   return [...result];
  // }
}
