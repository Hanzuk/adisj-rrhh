import { Request, Response } from 'express';
import { OvertimeBusiness } from './overtime.business';
import { Rol } from '../../utils/enums';

export class OvertimeController {
  constructor(private business: OvertimeBusiness = new OvertimeBusiness()) {}

  public create = async (req: Request, res: Response) => {
    const { id_empleado, cantidad_horas, descripcion } = req.body;

    try {
      await this.business.create({
        id_empleado: res.locals.authenticated.id,
        cantidad_horas,
        descripcion,
      });

      return res.status(201).send({
        status: 201,
        type: 'Created',
        message: 'New overtime request has been created',
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        type: 'BadRequestException',
        message: 'New overtime request could not be created',
        error,
      });
    }
  };

  public findAll = async (req: Request, res: Response) => {
    try {
      const overtimeRequests = await this.business.findAll();

      if (res.locals.authenticated.id !== Rol.Admin) {
        return res
          .status(200)
          .send(
            overtimeRequests.filter(
              (request) => request.id_empleado === res.locals.authenticated.id
            )
          );
      }

      return res.status(200).send(overtimeRequests);
    } catch (error) {
      return res.status(404).send({
        status: 400,
        type: 'NotFoundException',
        message: 'No permissiosn found',
        error,
      });
    }
  };

  public approveOrReject = async (req: Request, res: Response) => {
    const { overtimeId } = req.params;
    const { id_estado } = req.body;

    try {
      await this.business.onlyAdminUpdate(parseInt(overtimeId), {
        id_estado,
      });

      return res.status(200).send({
        status: 200,
        type: 'Updated',
        message: 'Overtime request has been updated',
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        type: 'BadRequestException',
        message: 'Overtime request could not be updated',
        error,
      });
    }
  };

  public update = async (req: Request, res: Response) => {
    const { overtimeId } = req.params;
    const { cantidad_horas, descripcion } = req.body;

    try {
      await this.business.onlyAdminUpdate(parseInt(overtimeId), {
        id_estado: 1,
        cantidad_horas,
        descripcion,
      });

      return res.status(200).send({
        status: 200,
        type: 'Updated',
        message: 'Overtime request has been updated',
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        type: 'BadRequestException',
        message: 'Overtime request could not be updated',
        error,
      });
    }
  };

  public delete = async (req: Request, res: Response) => {
    const { overtimeId } = req.params;

    try {
      await this.business.allUpdate(parseInt(overtimeId), {
        activo: false,
      });

      return res.status(200).send({
        status: 200,
        type: 'Deleted',
        message: 'Overtime request has been deleted',
      });
    } catch (error) {
      return res.status(200).send({
        status: 200,
        type: 'Deleted',
        message: 'Overtime request has been deleted',
      });
    }
  };
}
