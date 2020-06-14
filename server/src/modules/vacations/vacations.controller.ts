import { Request, Response } from 'express';
import { VacationsBusiness } from './vacations.business';

export class VacationsController {
  constructor(private business: VacationsBusiness = new VacationsBusiness()) {}

  public createVacationRequest = async (req: Request, res: Response) => {
    const { fecha_salida, fecha_entrada } = req.body;

    try {
      await this.business.createRequest({
        id_empleado: res.locals.authenticated.id,
        fecha_salida,
        fecha_entrada,
      });

      return res.status(200).send({ message: 'Vacaciones solicitadas' });
    } catch (error) {
      return res.status(400).send({
        message: 'No se pudo crear la solicitud de vacaciones',
        error,
      });
    }
  };

  public getVacationsRequests = async (req: Request, res: Response) => {
    try {
      const requests = await this.business.getRequests();
      return res.status(200).send(requests);
    } catch (error) {
      return res.status(400).send({
        message: 'No se pudo obtener las solicitudes de vacaciones',
        error,
      });
    }
  };
}
