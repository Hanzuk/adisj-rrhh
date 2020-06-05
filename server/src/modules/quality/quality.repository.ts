import { Quality, DriverRating } from './quality.model';
import DB from '../../database/database';

export class QualityRepository {
  public async insertVote(vote: Quality): Promise<void> {
    await DB.query('INSERT INTO control_calidad SET ?', vote);
  }

  public async getDriversRating(): Promise<DriverRating[]> {
    const result = await DB.query(
      `SELECT cc.id_empleado
        , SUM(cc.calificacion) AS suma_calificaciones
        , COUNT(cc.id_empleado) AS cantidad_calificaciones
        , e.nombre
        , e.p_apellido
        , e.s_apellido
      FROM control_calidad cc
        INNER JOIN empleados e
        ON cc.id_empleado = e.id
      GROUP BY id_empleado;`,
      ''
    );

    return [...result];
  }

  public async getVotesFromDriver(userId: number): Promise<Quality[]> {
    const result = await DB.query(
      `SELECT calificacion
        , nombre_cliente
        , comentario
      FROM control_calidad
      WHERE id_empleado = ?`,
      [userId]
    );

    return [...result];
  }
}
