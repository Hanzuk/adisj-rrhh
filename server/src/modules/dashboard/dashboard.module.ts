import { Router } from 'express';

import { DashboardController } from './dashboard.controller';

export class DashboardModule {
  public router: Router;
  private controller: DashboardController;

  constructor() {
    this.router = Router();
    this.controller = new DashboardController();
    this.setRoutes();
  }

  private setRoutes() {
    this.router.get('/dashboard-admin', this.controller.adminDashboard);
    this.router.get('/dashboard-employee', this.controller.employeeDashboard);
  }
}
