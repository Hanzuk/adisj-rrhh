import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { UsersBusiness } from './users.business';
import { User } from './users.model';

export class UsersController {
  constructor(private business: UsersBusiness = new UsersBusiness()) {}

  public login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    try {
      const user = await this.business.login(new User(email, password));

      if (!user)
        return res.status(401).send({
          code: 'Unauthorized',
          message: 'No user registered with this credentials',
        });

      if (user.password != password)
        return res.status(401).send({
          code: 'Unauthorized',
          message: 'Invalid credentials',
        });

      const token = jwt.sign(user, process.env.JWT_KEY || 'secret', {
        expiresIn: '24h',
      });

      return res.status(200).send({ token });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ code: 500, message: 'InternalServerError', error });
    }
  };

  public create = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send({ message: 'Empty fields' });
      return;
    }

    try {
      const user = await this.business.create(new User(email, password));
      res.status(200).send(user);
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: 'Error creating new user' });
    }
  };

  public me = (req: Request, res: Response) => {
    res.status(200).send({ message: 'Soy yo' });
  };
}
