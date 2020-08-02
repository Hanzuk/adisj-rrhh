import { Router } from 'express';

import { MailController } from './mail.controller';

export class MailModule {
  public router: Router;
  private controller: MailController;

  constructor() {
    this.router = Router();
    this.controller = new MailController();
    this.setRoutes();
  }

  private setRoutes() {
    this.router.post('/credentials', this.controller.sendCredentials);
  }
}
