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
    this.router.get('/', this.controller.getTravelEx);
    this.router.delete('/:travelExpId', Auth.role([Rol.Admin]), this.controller.delete);
  }
}
