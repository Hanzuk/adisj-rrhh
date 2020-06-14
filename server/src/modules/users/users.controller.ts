import { Request, Response } from 'express';
import { hash } from 'bcryptjs';
import moment from 'moment';

import { UsersBusiness } from './users.business';
import { IUser } from './models/user.interface';
import { Rol } from '../../utils/enums';
import { IPhone } from './models/phone.interface';
import { IAddress } from './models/address.interface';
import { ISalary } from './models/salary.interface';
import {
  ITemporaryUser,
  ITemporaryContract,
} from './models/temporary.interface';

export class UsersController {
  constructor(private business: UsersBusiness = new UsersBusiness()) {}

  public newUser = async (req: Request, res: Response) => {
    if (req.body.tipo_empleado === Rol.Temporal) {
      return res
        .status(400)
        .send({ message: 'Demasiados datos para este tipo de empleado' });
    }

    const userData: IUser = {
      cedula: req.body.cedula,
      nombre: req.body.nombre,
      p_apellido: req.body.p_apellido,
      s_apellido: req.body.s_apellido,
      fecha_nacimiento: req.body.fecha_nacimiento,
      correo: req.body.correo,
      clave: await hash(req.body.clave, 10),
      activo: req.body.activo,
      tipo_empleado: req.body.tipo_empleado,
    };

    const phonesData: IPhone[] = req.body.telefonos;
    const addressData: IAddress = {
      id_empleado: 0,
      codigo_provincia: req.body.direccion.provincia,
      codigo_canton: req.body.direccion.canton,
      codigo_distrito: req.body.direccion.distrito,
      direccion: req.body.direccion.direccion,
    };
    const salaryData: ISalary = {
      id_empleado: 0,
      salario_hora: req.body.salario_hora,
      jornada: req.body.jornada,
    };

    try {
      await this.business.saveEmployee(
        userData,
        addressData,
        phonesData,
        salaryData
      );

      return res.status(201).send({
        message: 'Nuevo empleado contratado',
      });
    } catch (error) {
      return res.status(400).send({
        message: 'No se pudo registrar el nuevo empleado',
        error,
      });
    }
  };

  public newTemporaryUser = async (req: Request, res: Response) => {
    if (req.body.tipo_empleado !== Rol.Temporal) {
      return res
        .status(400)
        .send({ message: 'Insuficientes datos para este tipo de empleado' });
    }

    const userData: IUser = {
      cedula: req.body.cedula,
      nombre: req.body.nombre,
      p_apellido: req.body.p_apellido,
      s_apellido: req.body.s_apellido,
      fecha_nacimiento: req.body.fecha_nacimiento,
      correo: req.body.correo,
      clave: await hash(req.body.clave, 10),
      activo: req.body.activo,
      tipo_empleado: req.body.tipo_empleado,
    };

    const phonesData: IPhone[] = req.body.telefonos;
    const addressData: IAddress = {
      id_empleado: 0,
      codigo_provincia: req.body.direccion.provincia,
      codigo_canton: req.body.direccion.canton,
      codigo_distrito: req.body.direccion.distrito,
      direccion: req.body.direccion.direccion,
    };
    const salaryData: ISalary = {
      id_empleado: 0,
      salario_hora: req.body.salario_hora,
      jornada: req.body.jornada,
    };

    try {
      const userId = await this.business.saveEmployee(
        userData,
        addressData,
        phonesData,
        salaryData
      );

      const contractDate = moment(new Date());
      const outDate = moment(req.body.fecha_salida);

      const contractedDays = outDate.diff(contractDate, 'days');

      const tempData: ITemporaryUser = {
        id_empleado: userId,
        fecha_salida: req.body.fecha_salida,
        descripcion: req.body.descripcion,
      };
      const contractData: ITemporaryContract = {
        id_empleado: userId,
        fecha_contrato: new Date(),
        fecha_salida: tempData.fecha_salida,
        descripcion: tempData.descripcion,
        dias: contractedDays,
      };

      await this.business.saveTemporaryEmployee(tempData, contractData);

      return res.status(201).send({
        message: 'Nuevo empleado temporal contratado',
      });
    } catch (error) {
      return res.status(400).send({
        message: 'No se pudo registrar el nuevo empleado temporal',
        error,
      });
    }
  };

  public findEmployee = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const userInfo = await this.business.getEmployee(parseInt(userId));
      return res.status(200).send(userInfo);
    } catch (error) {
      return res.status(404).send({
        message: 'No se pudo encontrar ese empleado',
        error,
      });
    }
  };

  public findEmployees = async (req: Request, res: Response) => {
    try {
      const usersInfo = await this.business.getEmployees();
      return res.status(200).send(usersInfo);
    } catch (error) {
      return res.status(404).send({
        status: 404,
        type: 'NotFound',
        message: 'Can not find the requested resources',
        error,
      });
    }
  };

  public updateEmployee = async (req: Request, res: Response) => {
    try {
      await this.business.update(
        parseInt(req.params.userId),
        {
          cedula: req.body.cedula,
          nombre: req.body.nombre,
          p_apellido: req.body.p_apellido,
          s_apellido: req.body.s_apellido,
          fecha_nacimiento: req.body.fecha_nacimiento,
          clave: await hash(req.body.clave, 10),
        },
        {
          salario_hora: req.body.salario_hora,
          jornada: req.body.jornada,
        }
      );

      return res.status(200).send({
        message: 'Datos del empleado actuailizados',
      });
    } catch (error) {
      return res.status(400).send({
        message: 'No se pudo actualzar los datos del empleado',
        error,
      });
    }
  };

  public rehire = async (req: Request, res: Response) => {
    const { fecha_salida, descripcion } = req.body;

    try {
      await this.business.reHire(
        parseInt(req.params.userId),
        undefined,
        fecha_salida,
        descripcion
      );

      return res.status(200).send({
        message: 'El empleado temporal ha sido re-contratado',
      });
    } catch (error) {
      return res.status(400).send({
        message:
          error.message || 'No se pudo re-contratar el empleado temporal',
        error,
      });
    }
  };

  public delete = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { descripcion } = req.body;

    try {
      await this.business.fire({ descripcion, id_empleado: parseInt(userId) });
      return res.status(200).send({ message: 'Empleado despedido' });
    } catch (error) {
      return res.status(400).send(error);
    }
  };
}
