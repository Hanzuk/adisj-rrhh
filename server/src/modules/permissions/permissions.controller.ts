import { Request, Response } from 'express';
import { PermissionsBusiness } from './permissions.business';
import { Rol } from '../../utils/enums';

export class PermissionsController {
  constructor(
    private business: PermissionsBusiness = new PermissionsBusiness()
  ) {}

  public create = async (req: Request, res: Response) => {
    const { titulo, descripcion, fecha_salida, horas } = req.body;

    try {
      await this.business.create({
        id_empleado: res.locals.authenticated.id,
        id_estado: 1,
        titulo,
        descripcion,
        fecha_salida,
        horas,
      });

      return res.status(201).send({
        status: 201,
        type: 'Created',
        message: 'New permission has been created',
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        type: 'BadRequestException',
        message: 'New permission could not be created',
        error,
      });
    }
  };

  public findAll = async (req: Request, res: Response) => {
    try {
      const permissions = await this.business.findAll();

      if (res.locals.authenticated.tipo_empleado !== Rol.Admin) {
        return res
          .status(200)
          .send(
            permissions.filter(
              (permission) =>
                permission.id_empleado === res.locals.authenticated.id
            )
          );
      }

      return res.status(200).send(permissions);
    } catch (error) {
      return res.status(404).send({
        status: 400,
        type: 'NotFoundException',
        message: 'No permissiosn found',
        error,
      });
    }
  };

  public updateAdmin = async (req: Request, res: Response) => {
    const { permissionId } = req.params;
    const { id_estado } = req.body;

    try {
      await this.business.onlyAdminUpdate(parseInt(permissionId), {
        id_estado,
      });
      return res.status(200).send({
        status: 200,
        type: 'Updated',
        message: 'Permission has been updated',
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        type: 'BadRequestException',
        message: 'The resource could not be updated',
        error,
      });
    }
  };

  public update = async (req: Request, res: Response) => {
    const { permissionId } = req.params;
    const { titulo, descripcion, fecha_salida, horas } = req.body;

    try {
      if (res.locals.authenticated.tipo_empleado !== Rol.Admin) {
        await this.business.onlyAdminUpdate(parseInt(permissionId), {
          id_estado: 1,
          titulo,
          descripcion,
          fecha_salida,
          horas,
        });

        return res.status(200).send({
          status: 200,
          type: 'Updated',
          message: 'Permission has been updated',
        });
      }

      return res.status(401).send({
        status: 401,
        type: 'UnauthorizedException',
        message: 'Admin not authorized to do this action',
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        type: 'BadRequestException',
        message: 'The resource could not be updated',
        error,
      });
    }
  };

  public delete = async (req: Request, res: Response) => {
    const { permissionId } = req.params;

    if (res.locals.authenticated.tipo_empleado !== Rol.Admin) {
      try {
        await this.business.allUpdate(parseInt(permissionId), {
          solo_admin: true,
        });

        return res.status(200).send({
          status: 200,
          type: 'Deleted',
          message: 'Permission has been deleted',
        });
      } catch (error) {
        return res.status(200).send({
          status: 200,
          type: 'Deleted',
          message: 'Permission has been deleted',
        });
      }
    }

    try {
      await this.business.allUpdate(parseInt(permissionId), {
        activo: false,
      });

      return res.status(200).send({
        status: 200,
        type: 'Deleted',
        message: 'Permission has been deleted',
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        type: 'Deleted',
        message: 'Could not delete permission',
      });
    }
  };
}
