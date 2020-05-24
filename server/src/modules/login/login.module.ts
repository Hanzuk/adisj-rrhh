import { Router } from 'express';

import { LoginController } from './login.controller';
import Auth from '../../middleware/auth';

export class LoginModule {
  public router: Router;
  private controller: LoginController;

  constructor() {
    this.router = Router();
    this.controller = new LoginController();
    this.setRoutes();
  }

  private setRoutes() {
    this.router.post('/', this.controller.login);
  }
}
