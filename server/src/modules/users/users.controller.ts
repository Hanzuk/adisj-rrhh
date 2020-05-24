import { Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { UsersBusiness } from './users.business';
import { User, TemporaryUser } from './users.model';
import { Rol } from './interfaces/users.interfaces';

export class UsersController {
  constructor(private business: UsersBusiness = new UsersBusiness()) {}

  public create = async (req: Request, res: Response): Promise<Response> => {
    const {
      idCard,
      name,
      lastName1,
      lastName2,
      birthdate,
      email,
      password,
      phones,
      address,
      departureDate,
      description,
      salary,
      rol,
    } = req.body;

    try {
      if (rol === Rol.TEMPORARY) {
        await this.business.create(
          new TemporaryUser(
            idCard,
            name,
            lastName1,
            lastName2,
            birthdate,
            email,
            await hash(password, 10),
            phones,
            address,
            departureDate,
            description,
            salary,
            rol
          )
        );

        return res
          .status(201)
          .send({ code: 'Created', message: 'New user created successfully' });
      }

      await this.business.create(
        new User(
          idCard,
          name,
          lastName1,
          lastName2,
          birthdate,
          email,
          await hash(password, 10),
          phones,
          address,
          salary,
          rol
        )
      );

      return res
        .status(201)
        .send({ code: 'Created', message: 'New user created successfully' });
    } catch (error) {
      return res.status(400).send({
        code: 'BadRequest',
        message: 'Error creating new user',
        error,
      });
    }
  };

  public me = (req: Request, res: Response) => {
    res.status(200).send({ message: 'Soy yo' });
  };
}
