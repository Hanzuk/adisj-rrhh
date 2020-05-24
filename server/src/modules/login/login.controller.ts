import { Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { ILogin } from './login.model';
import { LoginBusiness } from './login.business';

export class LoginController {
  constructor(private business: LoginBusiness = new LoginBusiness()) {}

  public login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    let credentials: ILogin;

    try {
      credentials = await this.business.login(email);
    } catch (error) {
      return res.status(500).send({
        code: 'InternalServerError',
        message: 'Error retrieving the user',
        error,
      });
    }

    if (!credentials)
      return res.status(401).send({
        code: 'Unauthorized',
        message: 'No user registered with this credentials',
      });

    const valid = await compare(password, credentials.password);

    if (!valid)
      return res.status(401).send({
        code: 'Unauthorized',
        message: 'Invalid credentials',
      });

    const token = sign(credentials, process.env.JWT_KEY || 'secret', {
      expiresIn: '10m',
    });

    return res.status(200).send({ token });
  };
}
