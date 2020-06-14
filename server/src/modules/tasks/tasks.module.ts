import { Router } from 'express';

import { TasksController } from './tasks.controller';
import Auth from '../../middleware/auth';
import { Rol } from '../../utils/enums';

export class TasksModule {
  public router: Router;
  private controller: TasksController;

  constructor() {
    this.router = Router();
    this.controller = new TasksController();
    this.setRoutes();
  }

  private setRoutes() {
    this.router.get('/', this.controller.getTasks);
    this.router.post(
      '/:userId',
      Auth.role([Rol.Admin]),
      this.controller.createTask
    );
  }
}
