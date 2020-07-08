import DB from '../../database/database';

export class TravelExpensesRepository {
  public async insertTravelExpense(travelEx: { id_empleado: number; motivo: string; monto: number }) {
    await DB.query('INSERT INTO viaticos SET ?', travelEx);
  }

  public getTravelExpense(): Promise<{ id_empleado: number }[]> {
    return DB.query(
      'SELECT v.id, v.id_empleado, v.motivo, v.monto, v.fecha, e.nombre, e.p_apellido FROM viaticos v INNER JOIN empleados e ON v.id_empleado = e.id WHERE v.activo = 1 ORDER BY v.fecha DESC;',
      ''
    );
  }

  public async deleteTravelExpense(id: number) {
    await DB.query('DELETE FROM viaticos WHERE id = ?;', [id]);
  }
}
