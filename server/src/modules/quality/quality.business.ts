import { QualityRepository } from './quality.repository';
import { Quality } from './quality.model';

export class QualityBusiness {
  constructor(private repository = new QualityRepository()) {}

  public async createVote(vote: Quality) {
    await this.repository.insertVote(vote);
  }

  public async getDriversRating() {
    const rating = await this.repository.getDriversRating();

    return rating.map((driver) => {
      const precision = Math.pow(10, 1);
      const calificacion =
        Math.round(
          (driver.suma_calificaciones / driver.cantidad_calificaciones) *
            precision
        ) / precision;

      return {
        id_empleado: driver.id_empleado,
        calificacion,
        nombre: driver.nombre,
        p_apellido: driver.p_apellido,
        s_apellido: driver.s_apellido,
      };
    });
  }

  public async getVotesFromDriver(userId: number) {
    return await this.repository.getVotesFromDriver(userId);
  }
}
