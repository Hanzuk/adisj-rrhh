import { Router } from 'express';

import { ProfilesController } from './profiles.controller';
import Auth from '../../middleware/auth';
import { Rol } from '../../utils/enums';

export class ProfilesModule {
  public router: Router;
  private controller: ProfilesController;

  constructor() {
    this.router = Router();
    this.controller = new ProfilesController();
    this.setRoutes();
  }

  private setRoutes() {
    this.router.get('/', this.controller.myInfo);
    this.router.put(
      '/',
      Auth.role([Rol.Chofer, Rol.Secretario, Rol.Temporal]),
      this.controller.editInfo
    );
  }
}
