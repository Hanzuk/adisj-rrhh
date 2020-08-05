import { Request, Response } from 'express';
import { DashboardBusiness } from './dashboard.business';

export class DashboardController {
  constructor(private business = new DashboardBusiness()) {}

  public adminDashboard = async (req: Request, res: Response) => {
    try {
      const data = await this.business.adminDahsData();
      res.status(200).send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  public employeeDashboard = async (req: Request, res: Response) => {
    const { id } = res.locals.authenticated;

    try {
      const data = await this.business.employeeDahsData(id);
      res.status(200).send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  };
}
