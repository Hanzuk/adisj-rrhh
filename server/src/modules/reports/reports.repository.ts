import DB from '../../database/database';

export class ReportsRepository {
  async getQualityData(): Promise<{ felicitaciones: any[]; amonestaciones: any[] }> {
    const data = await Promise.all([
      DB.query(
        `SELECT CONCAT(e.nombre, ' ', e.p_apellido) as nombre
          , f.descripcion
          , f.fecha
        FROM felicitaciones f
        INNER JOIN empleados e ON f.id_empleado = e.id
        WHERE f.activo = true AND MONTH(f.fecha) = MONTH(CURDATE()) AND YEAR(f.fecha) = YEAR(CURDATE());`,
        ''
      ),
      DB.query(
        `SELECT CONCAT(e.nombre, ' ', e.p_apellido) as nombre
          , a.descripcion
          , a.fecha
        FROM amonestaciones a
        INNER JOIN empleados e ON a.id_empleado = e.id
        WHERE a.activo = true AND MONTH(a.fecha) = MONTH(CURDATE()) AND YEAR(a.fecha) = YEAR(CURDATE());`,
        ''
      ),
    ]);

    return {
      felicitaciones: [...data[0]],
      amonestaciones: [...data[1]],
    };
  }
}
