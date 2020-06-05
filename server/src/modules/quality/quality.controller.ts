import { Request, Response } from 'express';
import moment from 'moment';
import { QualityBusiness } from './quality.business';

export class QualityController {
  constructor(private business: QualityBusiness = new QualityBusiness()) {}

  public vote = async (req: Request, res: Response) => {
    const { id_empleado, calificacion, nombre_cliente, comentario } = req.body;

    if (req.cookies.Limiter) {
      return res.status(400).send({ message: 'Ya has votado' });
    }

    try {
      await this.business.createVote({
        id_empleado,
        calificacion,
        nombre_cliente,
        comentario,
      });

      res.cookie('Limiter', true, {
        expires: moment().add(14, 'days').toDate(),
      });

      return res.status(200).send({ message: 'Tu voto se ha registrado' });
    } catch (error) {
      return res.status(400).send({
        message: 'No se pudo registrar tu voto',
        error,
      });
    }
  };

  public getRating = async (req: Request, res: Response) => {
    try {
      const rating = await this.business.getDriversRating();
      return res.status(200).send(rating);
    } catch (error) {
      return res.status(400).send({
        message: 'No se pudo las calificaciones y votos',
        error,
      });
    }
  };

  public getDriverVotes = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const votes = await this.business.getVotesFromDriver(parseInt(userId));
      return res.status(200).send(votes);
    } catch (error) {
      return res.status(400).send({
        message: 'No se pudo obtener los votos otorgados a este chofer',
        error,
      });
    }
  };
}
