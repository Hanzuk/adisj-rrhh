import { Request, Response } from 'express';
import { ReportsBusiness } from './reports.business';
import path from 'path';

export class ReportsController {
  constructor(private business = new ReportsBusiness()) {}

  public generateSalaryReport = async (req: Request, res: Response) => {
    const filename = await this.business.generateSalaryPDF();

    res.redirect(200, '/' + filename);
  };
}
