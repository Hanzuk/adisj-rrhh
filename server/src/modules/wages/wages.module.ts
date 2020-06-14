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
    this.router.post(
      '/:userId/calc',
      Auth.role([Rol.Admin]),
      this.controller.calcSalary
    );
  }
}
