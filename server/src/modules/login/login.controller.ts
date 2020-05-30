import { Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { Login } from './login.interface';
import { LoginBusiness } from './login.business';

export class LoginController {
  constructor(private business: LoginBusiness = new LoginBusiness()) {}

  public login = async (req: Request, res: Response): Promise<Response> => {
    const { correo, clave } = req.body;

    let credentials: Login;

    try {
      credentials = await this.business.login(correo);
    } catch (error) {
      return res.status(404).send({
        status: 404,
        type: 'NotFoundException',
        message: 'Can not find the requested resource',
        error: error.message,
      });
    }

    if (!credentials)
      return res.status(401).send({
        status: 401,
        type: 'UnauthorizedException',
        message: 'No user registered with this credentials',
      });

    const valid = await compare(clave, credentials.clave);
    console.log('LoginController -> constructor -> credentials', credentials);

    if (!valid)
      return res.status(401).send({
        status: 401,
        type: 'UnauthorizedException',
        message: 'No user registered with this credentials',
      });

    const token = sign({ ...credentials }, process.env.JWT_KEY || 'secret', {
      expiresIn: '1y',
    });

    return res.status(200).send({ token });
  };
}
