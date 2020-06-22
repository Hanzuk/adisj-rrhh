import { WagesBusiness } from './wages.business';
import { Request, Response } from 'express';

export class WagesController {
  constructor(private business = new WagesBusiness()) {}

  public calcSalary = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const basicData = await this.business.getBasicSalaryData(
        parseInt(userId)
      );

      const calc = await this.business.getSalaryCalc(parseInt(userId));

      return res.status(200).send({ ...basicData, ...calc });
    } catch (error) {
      return res.status(400).send(error);
    }
  };

  public increaseSalary = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { cantidad } = req.body;

    try {
      await this.business.addIncrease(parseInt(userId), parseInt(cantidad));
      return res.status(200).send({ message: 'Aumento salarial realizado' });
    } catch (error) {
      return res.status(400).send(error);
    }
  };
}
