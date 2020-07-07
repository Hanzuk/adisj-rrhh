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
    this.router.get('/tasks', this.controller.getTasks);
    this.router.get('/task/:taskId', this.controller.getTask);
    this.router.post('/task/:userId', Auth.role([Rol.Admin]), this.controller.createTask);
    this.router.post('/driver/:userId', Auth.role([Rol.Admin]), this.controller.createTaskDriver);
    this.router.delete('/task/:taskId', Auth.role([Rol.Admin]), this.controller.deleteTask);
    this.router.get('/schedule', Auth.role([Rol.Admin]), this.controller.schedule);
  }
}
