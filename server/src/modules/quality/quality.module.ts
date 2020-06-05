import { Router } from 'express';

import { QualityController } from './quality.controller';
import Auth from '../../middleware/auth';
import { Rol } from '../../utils/enums';

export class QualityModule {
  public router: Router;
  private controller: QualityController;

  constructor() {
    this.router = Router();
    this.controller = new QualityController();
    this.setRoutes();
  }

  private setRoutes() {
    this.router.get(
      '/',
      Auth.user,
      Auth.role([Rol.Admin]),
      this.controller.getRating
    );
    this.router.get(
      '/:userId',
      Auth.user,
      Auth.role([Rol.Admin]),
      this.controller.getDriverVotes
    );
    this.router.post('/vote', this.controller.vote);
  }
}
