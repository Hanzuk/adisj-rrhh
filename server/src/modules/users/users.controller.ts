import { Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { UsersBusiness } from './users.business';
import { User } from './users.model';
import { IUsersCrendentials } from './interfaces/users.credentials';

export class UsersController {
  constructor(private business: UsersBusiness = new UsersBusiness()) {}

  public login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    let user: IUsersCrendentials;

    try {
      user = await this.business.login(new User(email, password));
    } catch (error) {
      return res
        .status(500)
        .send({
          code: 'InternalServerError',
          message: 'Error retrieving the user',
          error,
        });
    }

    if (!user)
      return res.status(401).send({
        code: 'Unauthorized',
        message: 'No user registered with this credentials',
      });

    const valid = await compare(password, user.password);

    if (!valid)
      return res.status(401).send({
        code: 'Unauthorized',
        message: 'Invalid credentials',
      });

    const token = sign(user, process.env.JWT_KEY || 'secret', {
      expiresIn: '24h',
    });

    return res.status(200).send({ token });
  };

  public create = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send({ message: 'Empty fields' });

    try {
      const user = await this.business.create(
        new User(email, await hash(password, 10))
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
