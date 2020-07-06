import { Router } from 'express';

import { WagesController } from './wages.controller';
import Auth from '../../middleware/auth';
import { Rol } from '../../utils/enums';

export class WageseModule {
  public router: Router;
  private controller: WagesController;

  constructor() {
    this.router = Router();
    this.controller = new WagesController();
    this.setRoutes();
  }

  private setRoutes() {
    this.router.post('/calc-wages', Auth.role([Rol.Admin]), this.controller.calcSalary);
    this.router.post('/:userId/increase', Auth.role([Rol.Admin]), this.controller.increaseSalary);
    this.router.get('/increases', Auth.role([Rol.Admin]), this.controller.increases);
    this.router.post('/retention', Auth.role([Rol.Admin]), this.controller.newRetention);
    this.router.get('/retentions', Auth.role([Rol.Admin]), this.controller.retentions);
    this.router.delete('/:retentionId/delete-retention', Auth.role([Rol.Admin]), this.controller.delete);
    this.router.get('/handicaps', Auth.role([Rol.Admin]), this.controller.handicaps);
    this.router.post('/handicaps', Auth.role([Rol.Admin]), this.controller.newHandicap);
  }
}
