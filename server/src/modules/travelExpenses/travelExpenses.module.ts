import { Router } from 'express';

import { TravelExpensesController } from './travelExpenses.controller';
import Auth from '../../middleware/auth';
import { Rol } from '../../utils/enums';

export class TravelExpensesModule {
  public router: Router;
  private controller: TravelExpensesController;

  constructor() {
    this.router = Router();
    this.controller = new TravelExpensesController();
    this.setRoutes();
  }

  private setRoutes() {
    this.router.post('/', Auth.role([Rol.Admin]), this.controller.newTravelEx);
    // this.router.post('/', Auth.role([Rol.Chofer, Rol.Secretario, Rol.Admin]), this.controller.createVacationRequest);
    // this.router.get(
    //   '/available-days',
    //   Auth.role([Rol.Chofer, Rol.Secretario, Rol.Admin]),
    //   this.controller.availableDays
    // );
  }
}
