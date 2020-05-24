import { Router } from 'express';

import { UsersController } from './users.controller';
import Auth from '../../middleware/auth';

export class UsersModule {
  public router: Router;
  private controller: UsersController;

  constructor() {
    this.router = Router();
    this.controller = new UsersController();
    this.setRoutes();
  }

  private setRoutes() {
    this.router.post('/', this.controller.create);
    this.router.get('/me', Auth.role('admin'), this.controller.me);
  }
}
