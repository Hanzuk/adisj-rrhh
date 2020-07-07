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
    this.router.get('/rating', Auth.user, Auth.role([Rol.Admin]), this.controller.getRating);
    this.router.get('/rating/:userId', Auth.user, Auth.role([Rol.Admin]), this.controller.getDriverVotes);
    this.router.post('/vote', this.controller.vote);
    this.router.get('/drivers', this.controller.getDrivers);
    this.router.delete('/:voteId/delete-vote', Auth.user, Auth.role([Rol.Admin]), this.controller.deleteVote);
    this.router.post('/warning', Auth.user, Auth.role([Rol.Admin]), this.controller.newWarning);
    this.router.get('/warnings', Auth.user, this.controller.getWarnings);
    this.router.post('/congrat', Auth.user, Auth.role([Rol.Admin]), this.controller.newCongrat);
    this.router.get('/congrats', Auth.user, this.controller.getCongrats);
  }
}
