import { Router } from 'express';

import { VacationsController } from './vacations.controller';
import Auth from '../../middleware/auth';
import { Rol } from '../../utils/enums';

export class VacationsModule {
  public router: Router;
  private controller: VacationsController;

  constructor() {
    this.router = Router();
    this.controller = new VacationsController();
    this.setRoutes();
  }

  private setRoutes() {
    this.router.get(
      '/',
      Auth.role([Rol.Admin]),
      this.controller.getVacationsRequests
    );
    this.router.post(
      '/',
      Auth.role([Rol.Chofer, Rol.Secretario, Rol.Admin]),
      this.controller.createVacationRequest
    );
  }
}
