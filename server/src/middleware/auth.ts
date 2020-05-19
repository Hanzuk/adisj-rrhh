import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

class AuthMiddleware {
  public user = (req: Request, res: Response, next: NextFunction): Response => {
    const bearer = req.headers['authorization'];

    if (!bearer) return res.status(401).send({ code: 'Unauthorized' });

    const token = bearer.split(' ')[1];

    jwt.verify(token, process.env.JWT_KEY || 'secret', (error, decoded) => {
      if (error) return res.status(401).send({ code: 'Unauthorized' });
      //TODO: Declaration Merging
      req.body.user = decoded;
      next();
    });
  };

  public role(role: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.body.user.typeEmployee !== role)
        return res
          .status(401)
          .send({ code: 'Unauthorized', message: 'Role admin only' });

      next();
    };
  }
}

export default new AuthMiddleware();
