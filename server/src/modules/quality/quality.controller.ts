import { Request, Response } from 'express';
import { addDays } from 'date-fns';
import { QualityBusiness } from './quality.business';
import { Rol } from '../../utils/enums';

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
        expires: addDays(new Date(), 13),
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

  public getDrivers = async (req: Request, res: Response) => {
    try {
      const drivers = await this.business.getDrivers();
      return res.status(200).send(drivers);
    } catch (error) {
      return res.status(400).send({
        message: 'No se pudo obtener los choferes',
        error,
      });
    }
  };

  public deleteVote = async (req: Request, res: Response) => {
    try {
      await this.business.deleteVote(parseInt(req.params.voteId));
      return res.status(200).send({ message: 'Voto eliminado' });
    } catch (error) {
      return res.status(400).send({
        message: 'No se pudo eliminar el voto',
        error,
      });
    }
  };

  public newWarning = async (req: Request, res: Response) => {
    const { id_empleado, descripcion } = req.body;
    try {
      await this.business.addWarning({ id_empleado, descripcion });
      return res.status(200).send({ message: 'Amonestacion registrada.' });
    } catch (error) {
      return res.status(400).send({
        message: 'No se pudo registrar la amonestacion',
        error,
      });
    }
  };

  public newCongrat = async (req: Request, res: Response) => {
    const { id_empleado, descripcion } = req.body;
    try {
      await this.business.addCongrat({ id_empleado, descripcion });
      return res.status(200).send({ message: 'Felicitacion registrada.' });
    } catch (error) {
      return res.status(400).send({
        message: 'No se pudo registrar la felicitacion',
        error,
      });
    }
  };

  public getWarnings = async (req: Request, res: Response) => {
    try {
      const data = await this.business.getWarnings();

      if (res.locals.authenticated.tipo_empleado !== Rol.Admin) {
        return res.status(200).send(data.filter((item) => item.id_empleado === res.locals.authenticated.id));
      }

      return res.status(200).send(data);

      return res.status(200).send(data);
    } catch (error) {
      return res.status(400).send({
        message: 'No se pudo obtener las amonestaciones',
        error,
      });
    }
  };

  public getCongrats = async (req: Request, res: Response) => {
    try {
      const data = await this.business.getCongrats();
      return res.status(200).send(data);
    } catch (error) {
      return res.status(400).send({
        message: 'No se pudo obtener las felicitaciones',
        error,
      });
    }
  };
}
