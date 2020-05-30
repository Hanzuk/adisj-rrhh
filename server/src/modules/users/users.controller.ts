import { Request, Response } from 'express';
import { hash } from 'bcryptjs';

import { UsersBusiness } from './users.business';
import { User } from './models/user.model';
import { TempUser } from './models/temp.model';

export class UsersController {
  constructor(private business: UsersBusiness = new UsersBusiness()) {}

  public create = async (req: Request, res: Response) => {
    let newUser: User | TempUser;

    if (req.body.tipo_empleado !== 4) {
      newUser = new User({
        cedula: req.body.cedula,
        nombre: req.body.nombre,
        p_apellido: req.body.p_apellido,
        s_apellido: req.body.s_apellido,
        fecha_nacimiento: req.body.fecha_nacimiento,
        correo: req.body.correo,
        clave: await hash(req.body.clave, 10),
        tipo_empleado: req.body.tipo_empleado,
        salario_hora: req.body.salario_hora,
        jornada: req.body.jornada,
        telefonos: req.body.telefonos,
        direccion: req.body.direccion,
      });
    } else {
      newUser = new TempUser({
        cedula: req.body.cedula,
        nombre: req.body.nombre,
        p_apellido: req.body.p_apellido,
        s_apellido: req.body.s_apellido,
        fecha_nacimiento: req.body.fecha_nacimiento,
        correo: req.body.correo,
        clave: await hash(req.body.clave, 10),
        tipo_empleado: req.body.tipo_empleado,
        salario_hora: req.body.salario_hora,
        jornada: req.body.jornada,
        telefonos: req.body.telefonos,
        direccion: req.body.direccion,
        fecha_salida: req.body.fecha_salida,
        descripcion: req.body.descripcion,
      });
    }

    try {
      await this.business.create(newUser);

      return res.status(201).send({
        status: 201,
        type: 'Created',
        message: 'Resource has been created',
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        type: 'BadRequestException',
        message: 'The resource could not be created',
        error,
      });
    }
  };

  public findOne = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const userInfo = await this.business.findOne(parseInt(userId));
      return res.status(200).send(userInfo);
    } catch (error) {
      return res.status(404).send({
        status: 404,
        type: 'NotFound',
        message: 'Can not find the requested resource',
        error,
      });
    }
  };

  public findAll = async (req: Request, res: Response) => {
    try {
      const usersInfo = await this.business.findAll();
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

  public update = async (req: Request, res: Response) => {
    let newUser: User | TempUser;

    if (req.body.tipo_empleado !== 4) {
      newUser = new User({
        id: parseInt(req.params.userId),
        cedula: req.body.cedula,
        nombre: req.body.nombre,
        p_apellido: req.body.p_apellido,
        s_apellido: req.body.s_apellido,
        fecha_nacimiento: req.body.fecha_nacimiento,
        correo: req.body.correo,
        clave: await hash(req.body.clave, 10),
        tipo_empleado: req.body.tipo_empleado,
        salario_hora: req.body.salario_hora,
        jornada: req.body.jornada,
        telefonos: req.body.telefonos,
        direccion: req.body.direccion,
      });
    } else {
      newUser = new TempUser({
        id: parseInt(req.params.userId),
        cedula: req.body.cedula,
        nombre: req.body.nombre,
        p_apellido: req.body.p_apellido,
        s_apellido: req.body.s_apellido,
        fecha_nacimiento: req.body.fecha_nacimiento,
        correo: req.body.correo,
        clave: await hash(req.body.clave, 10),
        tipo_empleado: req.body.tipo_empleado,
        salario_hora: req.body.salario_hora,
        jornada: req.body.jornada,
        telefonos: req.body.telefonos,
        direccion: req.body.direccion,
        fecha_salida: req.body.fecha_salida,
        descripcion: req.body.descripcion,
      });
    }

    try {
      await this.business.update(newUser);

      return res.status(200).send({
        status: 200,
        type: 'Updated',
        message: 'Resource has been updated',
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        type: 'BadRequestException',
        message: 'The resource could not be Updated',
        error,
      });
    }
  };

  public updateContact = async (req: Request, res: Response) => {
    try {
      await this.business.updateContact({
        id: parseInt(req.params.userId),
        correo: req.body.correo,
        telefonos: req.body.telefonos,
        direccion: req.body.direccion,
      });

      return res.status(201).send({
        status: 201,
        type: 'Updated',
        message: 'Resource has been Updated',
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

  public reHire = async (req: Request, res: Response) => {
    const { fecha_salida, descripcion } = req.body;

    try {
      await this.business.reHire(
        parseInt(req.params.userId),
        undefined,
        fecha_salida,
        descripcion
      );

      return res.status(200).send({
        status: 200,
        type: 'Updated',
        message: 'Resource has been Updated',
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        type: 'BadRequestException',
        message: 'The resource could not be updated',
        error: error.message,
      });
    }
  };

  public delete = async (req: Request, res: Response) => {};
}
