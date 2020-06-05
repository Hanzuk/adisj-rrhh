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
        message: 'Tienes que haber iniciado sesión para realizar esta acción',
      });

    const token = bearer.split(' ')[1];

    jwt.verify(token, process.env.JWT_KEY || 'secret', (error, decoded) => {
      if (error)
        return res.status(401).send({
          status: 401,
          type: 'UnauthorizedException',
          message: 'Tienes que haber iniciado sesión para realizar esta acción',
        });
      res.locals.authenticated = decoded;
      next();
    });
  };

  public role(roles: Rol[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { tipo_empleado } = res.locals.authenticated;

      if (roles.indexOf(tipo_empleado) < 0) {
        return res.status(401).send({
          status: 401,
          type: 'UnauthorizedException',
          message: 'No tienes el permiso para realizar esta acción',
        });
      }

      next();
    };
  }
}

export default new AuthMiddleware();
