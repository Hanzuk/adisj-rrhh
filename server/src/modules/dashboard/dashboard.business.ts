import { DashboardRepository } from './dashboard.repository';

export class DashboardBusiness {
  constructor(private repository: DashboardRepository = new DashboardRepository()) {}

  async adminDahsData() {
    return this.repository.adminDashData();
  }

  async employeeDahsData(userId: number) {
    return this.repository.employeeDashData(userId);
  }
}
