import { Request, Response } from 'express';
import { hash } from 'bcryptjs';
import { differenceInCalendarDays } from 'date-fns';

import { UsersBusiness } from './users.business';
import { IUser } from './models/user.interface';
import { Rol } from '../../utils/enums';
import { IPhone } from './models/phone.interface';
import { IAddress } from './models/address.interface';
import { ISalary } from './models/salary.interface';
import { ITemporaryUser, ITemporaryContract } from './models/temporary.interface';
import { RequiredFieldsError } from '../../utils/errors/RequestFieldsError';

export class UsersController {
  constructor(private business: UsersBusiness = new UsersBusiness()) {}

  public newUser = async (req: Request, res: Response) => {
    if (req.body.tipo_empleado === Rol.Temporal) {
      return res.status(400).send({ message: 'Demasiados datos para este tipo de empleado' });
    }

    try {
      if (!req.body.hasOwnProperty('cedula')) throw new RequiredFieldsError('La cedula es requerida');
      if (!req.body.hasOwnProperty('nombre')) throw new RequiredFieldsError('El nombre es requerido');
      if (!req.body.hasOwnProperty('p_apellido')) throw new RequiredFieldsError('El primer apellido es requerido');
      if (!req.body.hasOwnProperty('s_apellido')) throw new RequiredFieldsError('El segundo apellido es requerido');
      if (!req.body.hasOwnProperty('fecha_nacimiento'))
        throw new RequiredFieldsError('La fecha de nacimiento es requerida');
      if (!req.body.hasOwnProperty('correo')) throw new RequiredFieldsError('El correo es requerido');
      if (!req.body.hasOwnProperty('clave')) throw new RequiredFieldsError('La clave es requerida');
      if (!req.body.hasOwnProperty('tipo_empleado')) throw new RequiredFieldsError('El tipo de empleado es requerido');
      if (!req.body.hasOwnProperty('telefonos')) throw new RequiredFieldsError('Al menos un telefono es requerido');
      if (!req.body.hasOwnProperty('direccion')) throw new RequiredFieldsError('La direccion es requerida');
      if (!req.body.hasOwnProperty('salario_hora')) throw new RequiredFieldsError('El salario por hora es requerido');
      if (!req.body.hasOwnProperty('jornada')) throw new RequiredFieldsError('La jornada es requerida');

      const userData: IUser = {
        cedula: req.body.cedula,
        nombre: req.body.nombre,
        p_apellido: req.body.p_apellido,
        s_apellido: req.body.s_apellido,
        fecha_nacimiento: req.body.fecha_nacimiento,
        correo: req.body.correo,
        clave: await hash(req.body.clave, 10),
        activo: true,
        tipo_empleado: req.body.tipo_empleado,
      };

      if (req.body.telefonos.length === 0) throw new RequiredFieldsError('Al menos un telefono es requerido');

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

      await this.business.savePermanent(userData, addressData, phonesData, salaryData);

      return res.status(201).send({
        message: 'Nuevo empleado contratado',
      });
    } catch (error) {
      return res.status(400).send({
        error,
      });
    }
  };

  public newTemporaryUser = async (req: Request, res: Response) => {
    if (req.body.tipo_empleado !== Rol.Temporal) {
      return res.status(400).send({ message: 'Insuficientes datos para este tipo de empleado' });
    }

    const basic: IUser = {
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

    const phones: IPhone[] = req.body.telefonos;
    const address: IAddress = {
      id_empleado: 0,
      codigo_provincia: req.body.direccion.provincia,
      codigo_canton: req.body.direccion.canton,
      codigo_distrito: req.body.direccion.distrito,
      direccion: req.body.direccion.direccion,
    };
    const salary: ISalary = {
      id_empleado: 0,
      salario_hora: req.body.salario_hora,
      jornada: req.body.jornada,
    };

    try {
      const fecha_contrato = new Date();

      const temp: ITemporaryUser = {
        id_empleado: 0,
        fecha_salida: req.body.fecha_salida,
        descripcion: req.body.descripcion,
      };
      const contrac: ITemporaryContract = {
        id_empleado: 0,
        fecha_contrato,
        fecha_salida: temp.fecha_salida,
        descripcion: temp.descripcion,
        dias: differenceInCalendarDays(new Date(req.body.fecha_salida), fecha_contrato),
      };

      await this.business.saveTemporaryEmployee(basic, address, phones, salary, temp, contrac);

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
    const { userId } = req.params;
    const { correo, jornada, salario_hora, tipo_empleado, fecha_salida, descripcion, clave } = req.body;

    let newpassword: string;

    if (clave) {
      newpassword = await hash(clave, 10);
    }

    try {
      const fecha_contrato = new Date();
      await this.business.update({
        userId: parseInt(userId),
        correo,
        jornada,
        salario_hora,
        tipo_empleado,
        clave: newpassword,
        descripcion,
        dias: differenceInCalendarDays(new Date(fecha_salida), fecha_contrato),
        fecha_contrato,
        fecha_salida,
      });

      return res.status(200).send({
        message: 'Datos del empleado actuailizados',
      });
    } catch (error) {
      return res.status(400).send({
        message: 'No se pudo actualzar los datos del empleado',
        error: error.message,
      });
    }
  };

  public rehire = async (req: Request, res: Response) => {
    const { fecha_salida, descripcion } = req.body;
    const fecha_contrato = new Date();

    try {
      await this.business.reHire({
        id_empleado: parseInt(req.params.userId),
        fecha_contrato,
        fecha_salida,
        descripcion,
        dias: differenceInCalendarDays(new Date(fecha_salida), fecha_contrato),
      });

      return res.status(200).send({
        message: 'El empleado temporal ha sido re-contratado',
      });
    } catch (error) {
      return res.status(400).send({
        message: error.message || 'No se pudo re-contratar el empleado temporal',
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

  public catalogues = async (req: Request, res: Response) => {
    try {
      const catalog = await this.business.getCatalog();
      return res.status(200).send(catalog);
    } catch (error) {
      return res.status(400).send({ message: 'No se puedo obtener el catalago' });
    }
  };
}
