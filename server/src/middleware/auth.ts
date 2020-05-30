import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Rol } from 'src/utils/enums';

class AuthMiddleware {
  public user = (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers['authorization'];

    if (!bearer)
      return res.status(401).send({
        status: 401,
        type: 'UnauthorizedException',
        message: 'You have to be authorized to do this action',
      });

    const token = bearer.split(' ')[1];

    jwt.verify(token, process.env.JWT_KEY || 'secret', (error, decoded) => {
      if (error)
        return res.status(401).send({
          status: 401,
          type: 'UnauthorizedException',
          message: 'You have to be authorized to do this action',
        });
      res.locals.authenticated = decoded;
      next();
    });
  };

  public role(role: Rol) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (res.locals.authenticated.tipo_empleado !== role)
        return res.status(401).send({
          status: 401,
          type: 'UnauthorizedException',
          message: 'You have to be authorized to do this action',
        });

      next();
    };
  }
}

export default new AuthMiddleware();
